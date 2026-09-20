import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function GameSkeleton() {
  return <div className="animate-pulse rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"><div className="h-32 rounded-2xl bg-gray-200" /><div className="mt-5 h-5 w-2/3 rounded bg-gray-200" /><div className="mt-3 h-4 w-1/2 rounded bg-gray-100" /><div className="mt-6 space-y-3"><div className="h-4 rounded bg-gray-100" /><div className="h-4 rounded bg-gray-100" /><div className="h-4 rounded bg-gray-100" /></div><div className="mt-6 h-11 rounded-xl bg-gray-100" /></div>;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getTodayInputValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function Games() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [date, setDate] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingGameId, setUpdatingGameId] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const [locationMessage, setLocationMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (skillLevel) params.set("skillLevel", skillLevel);
        if (date) params.set("date", date);

        const response = await fetch(`${API_URL}/api/games?${params}`, {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Unable to load games");
        setGames(data.games);
      } catch (loadError) {
        if (loadError.name !== "AbortError") setError(loadError.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [search, skillLevel, date]);

  async function updateMembership(game) {
    if (!user) {
      setJoinMessage("Please log in before changing game membership.");
      return;
    }

    try {
      setUpdatingGameId(game._id);
      setJoinMessage("");
      const token = await user.getIdToken(true);
      const action = game.isJoined ? "leave" : "join";
      const response = await fetch(`${API_URL}/api/games/${game._id}/${action}`, {
        method: action === "leave" ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Unable to ${action} the game`);
      setGames((currentGames) =>
        currentGames.map((currentGame) =>
          currentGame._id === game._id ? data.game : currentGame,
        ),
      );
      setJoinMessage(action === "leave" ? "You left the game." : "You joined the game successfully.");
    } catch (membershipError) {
      setJoinMessage(membershipError.message);
    } finally {
      setUpdatingGameId("");
    }
  }

  async function handleLocation() {
    setLocationMessage("");

    if (!navigator.geolocation) {
      setLocationMessage("Location is not supported by this browser.");
      return;
    }

    setLocationMessage("Requesting your location...");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`,
          );
          const data = await response.json();
          const address = data.address || {};
          const nearbyCity = address.city || address.town || address.village || address.county;

          if (!nearbyCity) throw new Error("Could not identify a nearby city");
          setSearch(nearbyCity);
          setLocationMessage(`Showing games near ${nearbyCity}.`);
        } catch (locationError) {
          setLocationMessage(locationError.message);
        }
      },
      () => setLocationMessage("Location permission was denied. Enter a city manually instead."),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  function clearFilters() {
    setSearch("");
    setSkillLevel("");
    setDate("");
    setLocationMessage("");
  }

  const activeFilterCount = [search, skillLevel, date].filter(Boolean).length;

  return (
    <main className="min-h-screen bg-[#faf9f7] px-5 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 font-bold uppercase tracking-[0.25em] text-orange-500">Discover your next game</p>
            <h1 className="text-4xl font-black tracking-tight text-gray-950 md:text-5xl">Find games near you.</h1>
            <p className="mt-3 max-w-xl text-lg text-gray-600">Find a run that fits your schedule, skill level, and city.</p>
          </div>
          <Link to="/host" className="inline-flex w-fit rounded-xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-orange-500">Host a game →</Link>
        </div>

        <div className="mb-10 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div><p className="font-bold text-gray-950">Search and filter</p><p className="mt-1 text-sm text-gray-500">Choose what kind of game you want to play.</p></div>
            {activeFilterCount > 0 && <button type="button" onClick={clearFilters} className="text-sm font-semibold text-orange-600 hover:text-orange-700">Clear all ({activeFilterCount})</button>}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Search</span><input type="text" placeholder="Court or city" value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label>
            <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Skill level</span><select value={skillLevel} onChange={(event) => setSkillLevel(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-orange-500"><option value="">All levels</option><option value="newbie">Newbie</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label>
            <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Date</span><input type="date" min={getTodayInputValue()} value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none transition focus:border-orange-500" /></label>
            <button type="button" onClick={handleLocation} className="mt-6 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600 md:mt-6">📍 Use my location</button>
          </div>
        </div>

        {locationMessage && <p className="-mt-6 mb-5 text-sm text-gray-600">{locationMessage}</p>}

        <div className="mb-5 flex items-end justify-between gap-4">
          <div><p className="font-bold uppercase tracking-[0.2em] text-orange-500">Open runs</p><h2 className="mt-1 text-2xl font-black text-gray-950">Available games</h2></div>
          <span className="text-sm font-semibold text-gray-500">{games.length} {games.length === 1 ? "game" : "games"} found</span>
        </div>

        {joinMessage && <p className="mb-5 rounded-xl bg-orange-50 px-4 py-3 text-orange-700">{joinMessage}</p>}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"><GameSkeleton /><GameSkeleton /><GameSkeleton /></div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 px-6 py-16 text-center text-red-700 shadow-sm">{error}</div>
        ) : games.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">🏀</div>
            <h3 className="mt-5 text-xl font-black text-gray-950">No games match your search</h3>
            <p className="mx-auto mt-2 max-w-md text-gray-600">Try clearing a filter or host a new game for your community.</p>
            <Link to="/host" className="mt-6 inline-flex rounded-xl bg-orange-500 px-5 py-3 font-bold text-white">Host a game</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <article
                key={game._id}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100"
              >
                <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4">
                  <span className="text-xs font-black uppercase tracking-widest text-orange-600">Pickup game</span>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-gray-800 shadow-sm">{game.players.length} / {game.maxPlayers}</span>
                </div>
                <div className="p-6">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-black text-gray-950">{game.title}</h3>
                    <span className="mt-2 inline-block rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold capitalize text-blue-700">
                      {game.skillLevel} level
                    </span>
                    {game.description && (
                      <p className="mt-2 text-sm leading-6 text-gray-500">{game.description}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 text-gray-600">
                  <p>📍 {game.courtName}, {game.city}</p>
                  <p>📅 {formatDate(game.date)}</p>
                  <p>🕒 {game.startTime} - {game.endTime}</p>
                  <p className="text-sm font-semibold text-gray-500">
                    👥 {Math.max(game.maxPlayers - game.players.length, 0)} spots available
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Link
                    to={`/games/${game._id}`}
                    className="rounded-xl border border-gray-900 px-4 py-3 text-center font-semibold text-gray-900 transition hover:bg-gray-950 hover:text-white"
                  >
                    View Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => updateMembership(game)}
                    disabled={updatingGameId === game._id || (!game.isJoined && game.players.length >= game.maxPlayers)}
                    className="rounded-xl border border-orange-500 px-4 py-3 font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updatingGameId === game._id
                      ? "Updating..."
                      : game.isJoined
                        ? "Leave Game"
                        : game.players.length >= game.maxPlayers
                          ? "Game Full"
                          : "Join Game"}
                  </button>
                </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Games;
