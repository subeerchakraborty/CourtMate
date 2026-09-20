import Game from "../models/Game.js";
import User from "../models/User.js";

const allowedSkillLevels = ["newbie", "intermediate", "advanced"];

function isValidSchedule(date, startTime, endTime) {
  const selectedDate = new Date(`${date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = selectedDate.getTime() === today.getTime();
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    !Number.isNaN(selectedDate.getTime()) &&
    selectedDate >= today &&
    (!isToday || startTime > currentTime) &&
    typeof startTime === "string" &&
    typeof endTime === "string" &&
    endTime > startTime
  );
}

function gameHasStarted(game) {
  const dateValue = game.date.toISOString().slice(0, 10);
  return new Date(`${dateValue}T${game.startTime}:00`) < new Date();
}

async function completePastGames() {
  const openGames = await Game.find({ status: "open" }).select("date startTime");
  const pastGameIds = openGames.filter(gameHasStarted).map((game) => game._id);
  if (pastGameIds.length) {
    await Game.updateMany({ _id: { $in: pastGameIds } }, { $set: { status: "completed" } });
  }
}

async function listGames(request, response) {
  const { search = "", skillLevel = "", date = "", sort = "soonest" } = request.query;
  const requestedLimit = Number(request.query.limit);
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 20) : null;
  const filters = { status: "open" };

  if (skillLevel && allowedSkillLevels.includes(skillLevel)) {
    filters.skillLevel = skillLevel;
  }

  if (date) {
    const selectedDate = new Date(date);

    if (Number.isNaN(selectedDate.getTime())) {
      return response.status(400).json({ message: "Please provide a valid date" });
    }

    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    filters.date = { $gte: selectedDate, $lt: nextDate };
  }

  if (search.trim()) {
    const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchPattern = new RegExp(safeSearch, "i");
    filters.$or = [
      { title: searchPattern },
      { courtName: searchPattern },
      { city: searchPattern },
    ];
  }

  try {
    await completePastGames();
    const currentUser = request.firebaseUser
      ? await User.findOne({ firebaseUid: request.firebaseUser.uid }).select("_id")
      : null;
    let gamesQuery = Game.find(filters)
      .populate("host", "name skillLevel")
      .sort(sort === "popular" ? { players: -1, date: 1, startTime: 1 } : { date: 1, startTime: 1 });
    if (limit) gamesQuery = gamesQuery.limit(limit);
    const games = await gamesQuery;

    const gamesWithMembership = games.map((game) => ({
      ...game.toObject(),
      isJoined: Boolean(
        currentUser && game.players.some((player) => player.equals(currentUser._id)),
      ),
    }));

    return response.json({ games: gamesWithMembership });
  } catch (error) {
    console.error("Game search failed:", error.message);
    return response.status(500).json({ message: "Unable to load games" });
  }
}

async function getGame(request, response) {
  try {
    await completePastGames();
    const game = await Game.findById(request.params.gameId).populate("host", "name skillLevel");
    if (!game) return response.status(404).json({ message: "Game not found" });

    let isJoined = false;
    if (request.firebaseUser) {
      const user = await User.findOne({ firebaseUid: request.firebaseUser.uid }).select("_id");
      isJoined = Boolean(user && game.players.some((player) => player.equals(user._id)));
    }

    return response.json({ game: { ...game.toObject(), isJoined } });
  } catch (error) {
    console.error("Loading game details failed:", error.message);
    return response.status(500).json({ message: "Unable to load game details" });
  }
}

async function createGame(request, response) {
  const {
    title,
    description,
    skillLevel,
    courtName,
    city,
    address,
    date,
    startTime,
    endTime,
    maxPlayers,
    location,
  } = request.body;

  if (
    !title?.trim() ||
    !allowedSkillLevels.includes(skillLevel) ||
    !courtName?.trim() ||
    !city?.trim() ||
    !address?.trim() ||
    !date ||
    !startTime ||
    !endTime
  ) {
    return response.status(400).json({
      message: "Please complete all required game fields",
    });
  }

  const parsedMaxPlayers = Number(maxPlayers);
  const parsedDate = new Date(date);

  if (
    !Number.isInteger(parsedMaxPlayers) ||
    parsedMaxPlayers < 2 ||
    parsedMaxPlayers > 100 ||
    Number.isNaN(parsedDate.getTime()) ||
    !isValidSchedule(date, startTime, endTime)
  ) {
    return response.status(400).json({
      message: "Date must be today or later, and end time must be after start time",
    });
  }

  try {
    const host = await User.findOne({ firebaseUid: request.firebaseUser.uid });

    if (!host) {
      return response.status(404).json({
        message: "CourtMate profile not found. Please complete signup first.",
      });
    }

    const game = await Game.create({
      host: host._id,
      title: title.trim(),
      description: description?.trim() || "",
      skillLevel,
      courtName: courtName.trim(),
      city: city.trim(),
      address: address.trim(),
      date: parsedDate,
      startTime,
      endTime,
      maxPlayers: parsedMaxPlayers,
      ...(location?.coordinates ? { location } : {}),
      players: [host._id],
    });

    return response.status(201).json({ game });
  } catch (error) {
    console.error("Game creation failed:", error.message);
    return response.status(500).json({ message: "Unable to create the game" });
  }
}

async function joinGame(request, response) {
  try {
    await completePastGames();
    const user = await User.findOne({ firebaseUid: request.firebaseUser.uid });
    if (!user) {
      return response.status(404).json({ message: "CourtMate profile not found" });
    }

    const game = await Game.findOneAndUpdate(
      {
        _id: request.params.gameId,
        status: "open",
        $expr: { $lt: [{ $size: "$players" }, "$maxPlayers"] },
        players: { $ne: user._id },
      },
      { $addToSet: { players: user._id } },
      { returnDocument: "after" },
    ).populate("host", "name skillLevel");

    if (!game) {
      const existingGame = await Game.findById(request.params.gameId);
      if (!existingGame) return response.status(404).json({ message: "Game not found" });
      if (existingGame.players.some((player) => player.equals(user._id))) {
        return response.status(409).json({ message: "You already joined this game" });
      }
      if (existingGame.players.length >= existingGame.maxPlayers) {
        return response.status(409).json({ message: "This game is full" });
      }
      return response.status(409).json({ message: "This game is no longer open" });
    }

    return response.json({ game });
  } catch (error) {
    console.error("Joining game failed:", error.message);
    return response.status(500).json({ message: "Unable to join the game" });
  }
}

async function listMyGames(request, response) {
  try {
    await completePastGames();
    const user = await User.findOne({ firebaseUid: request.firebaseUser.uid });
    if (!user) return response.status(404).json({ message: "CourtMate profile not found" });

    const games = await Game.find({ players: user._id, status: { $in: ["open", "completed"] } })
      .populate("host", "name skillLevel")
      .sort({ date: 1, startTime: 1 });

    return response.json({
      games: games.map((game) => ({ ...game.toObject(), isHost: game.host._id.equals(user._id) })),
    });
  } catch (error) {
    console.error("Loading my games failed:", error.message);
    return response.status(500).json({ message: "Unable to load your games" });
  }
}

async function leaveGame(request, response) {
  try {
    const user = await User.findOne({ firebaseUid: request.firebaseUser.uid });
    if (!user) return response.status(404).json({ message: "CourtMate profile not found" });

    const existingGame = await Game.findById(request.params.gameId);
    if (!existingGame) return response.status(404).json({ message: "Game not found" });
    if (existingGame.host.equals(user._id)) {
      return response.status(409).json({ message: "The host cannot leave their own game" });
    }
    if (!existingGame.players.some((player) => player.equals(user._id))) {
      return response.status(409).json({ message: "You have not joined this game" });
    }

    const game = await Game.findByIdAndUpdate(
      request.params.gameId,
      { $pull: { players: user._id } },
      { returnDocument: "after" },
    ).populate("host", "name skillLevel");

    return response.json({ game: { ...game.toObject(), isJoined: false } });
  } catch (error) {
    console.error("Leaving game failed:", error.message);
    return response.status(500).json({ message: "Unable to leave the game" });
  }
}

async function updateGame(request, response) {
  const fields = ["title", "description", "skillLevel", "courtName", "city", "address", "date", "startTime", "endTime", "maxPlayers", "location"];

  try {
    const user = await User.findOne({ firebaseUid: request.firebaseUser.uid });
    const game = await Game.findById(request.params.gameId);
    if (!user || !game) return response.status(404).json({ message: "Game not found" });
    if (!game.host.equals(user._id)) return response.status(403).json({ message: "Only the host can edit this game" });

    const updates = Object.fromEntries(fields.filter((field) => request.body[field] !== undefined).map((field) => [field, request.body[field]]));
    if (updates.title !== undefined) updates.title = updates.title.trim();
    if (updates.description !== undefined) updates.description = updates.description.trim();
    if (updates.courtName !== undefined) updates.courtName = updates.courtName.trim();
    if (updates.city !== undefined) updates.city = updates.city.trim();
    if (updates.address !== undefined) updates.address = updates.address.trim();
    if (updates.maxPlayers !== undefined) updates.maxPlayers = Number(updates.maxPlayers);
    if (updates.date !== undefined) updates.date = new Date(updates.date);

    const scheduleDate = request.body.date || game.date.toISOString().slice(0, 10);
    const scheduleStart = request.body.startTime || game.startTime;
    const scheduleEnd = request.body.endTime || game.endTime;
    if (!isValidSchedule(scheduleDate, scheduleStart, scheduleEnd)) {
      return response.status(400).json({
        message: "Date must be today or later, and end time must be after start time",
      });
    }

    Object.assign(game, updates);
    await game.save();
    await game.populate("host", "name skillLevel");
    return response.json({ game });
  } catch (error) {
    console.error("Updating game failed:", error.message);
    return response.status(400).json({ message: "Unable to update the game" });
  }
}

async function deleteGame(request, response) {
  try {
    const user = await User.findOne({ firebaseUid: request.firebaseUser.uid });
    const game = await Game.findById(request.params.gameId);
    if (!user || !game) return response.status(404).json({ message: "Game not found" });
    if (!game.host.equals(user._id)) return response.status(403).json({ message: "Only the host can delete this game" });

    await Game.deleteOne({ _id: game._id });
    return response.json({ message: "Game deleted permanently" });
  } catch (error) {
    console.error("Deleting game failed:", error.message);
    return response.status(500).json({ message: "Unable to delete the game" });
  }
}

export { createGame, deleteGame, getGame, joinGame, leaveGame, listGames, listMyGames, updateGame };
