import User from "../models/User.js";
import Game from "../models/Game.js";

const allowedSkillLevels = ["newbie", "intermediate", "advanced"];

async function upsertProfile(request, response) {
  const { name, skillLevel } = request.body;
  const firebaseUser = request.firebaseUser;

  if (!name?.trim() || !allowedSkillLevels.includes(skillLevel)) {
    return response.status(400).json({
      message: "Name and a valid skill level are required",
    });
  }

  if (!firebaseUser.email) {
    return response.status(400).json({
      message: "An email address is required for a CourtMate profile",
    });
  }

  const user = await User.findOneAndUpdate(
    { firebaseUid: firebaseUser.uid },
    {
      firebaseUid: firebaseUser.uid,
      name: name.trim(),
      email: firebaseUser.email,
      skillLevel,
      avatarUrl: firebaseUser.picture || "",
    },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  return response.status(201).json({ user });
}

async function getMyProfile(request, response) {
  try {
    const user = await User.findOne({ firebaseUid: request.firebaseUser.uid }).lean();
    if (!user) return response.status(404).json({ message: "CourtMate profile not found" });

    const [joinedGames, hostedGames] = await Promise.all([
      Game.countDocuments({ players: user._id }),
      Game.countDocuments({ host: user._id }),
    ]);

    return response.json({ user, stats: { joinedGames, hostedGames } });
  } catch (error) {
    console.error("Loading profile failed:", error.message);
    return response.status(500).json({ message: "Unable to load profile" });
  }
}

async function updateMyProfile(request, response) {
  const { name, skillLevel } = request.body;

  if (!name?.trim() || !allowedSkillLevels.includes(skillLevel)) {
    return response.status(400).json({ message: "Name and a valid skill level are required" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { firebaseUid: request.firebaseUser.uid },
      { name: name.trim(), skillLevel },
      { returnDocument: "after", runValidators: true },
    ).lean();

    if (!user) return response.status(404).json({ message: "CourtMate profile not found" });
    return response.json({ user });
  } catch (error) {
    console.error("Updating profile failed:", error.message);
    return response.status(400).json({ message: "Unable to update profile" });
  }
}

export { getMyProfile, updateMyProfile, upsertProfile };
