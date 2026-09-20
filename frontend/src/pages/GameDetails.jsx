import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../context/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function GameDetails() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadGame() {
      try {
        const response = await fetch(`${API_URL}/api/games/${gameId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load game details");
        setGame(data.game);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadGame();
  }, [gameId]);

  async function updateMembership() {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setUpdating(true);
      setActionMessage("");
      const token = await user.getIdToken(true);
      const action = game.isJoined ? "leave" : "join";
      const response = await fetch(`${API_URL}/api/games/${gameId}/${action}`, {
        method: action === "leave" ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Unable to ${action} the game`);
      setGame(data.game);
      setActionMessage(action === "leave" ? "You left this game." : "You joined this game.");
    } catch (actionError) {
      setActionMessage(actionError.message);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <main className="min-h-screen bg-[#faf9f7] px-6 py-12 text-gray-600">Loading game...</main>;
  if (error || !game) return <main className="min-h-screen bg-[#faf9f7] px-6 py-12 text-red-700">{error || "Game not found"}</main>;

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${game.courtName}, ${game.address}, ${game.city}`)}`;
  const coordinates = game.location?.coordinates;
  const hasCoordinates = Array.isArray(coordinates) && coordinates.length === 2;
  const [longitude, latitude] = coordinates || [];
  const mapEmbedUrl = hasCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`
    : "";
  const spotsRemaining = Math.max(game.maxPlayers - game.players.length, 0);
  const isFull = spotsRemaining === 0 && !game.isJoined;

  return (
    <main className="min-h-screen bg-[#faf9f7] px-5 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-4xl">
        <Link to="/games" className="font-semibold text-orange-600 transition hover:text-orange-700">← Back to Find Games</Link>
        <article className="mt-6 overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950 px-6 py-10 text-white md:px-10 md:py-14">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-bold uppercase tracking-[0.25em] text-orange-300">Pickup game</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold capitalize">{game.skillLevel} level</span>
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">{game.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-300">{game.description || "No description provided."}</p>
          </div>

          <div className="p-6 md:p-10">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-orange-50 p-5"><p className="text-sm font-bold uppercase tracking-wider text-orange-600">When</p><p className="mt-2 font-bold text-gray-950">{formatDate(game.date)}</p><p className="mt-1 text-gray-600">{game.startTime} - {game.endTime}</p></div>
              <div className="rounded-2xl bg-gray-50 p-5"><p className="text-sm font-bold uppercase tracking-wider text-gray-500">Players</p><p className="mt-2 font-bold text-gray-950">{game.players.length} / {game.maxPlayers} joined</p><p className="mt-1 text-gray-600">{spotsRemaining} {spotsRemaining === 1 ? "spot" : "spots"} available</p></div>
            </div>

            <div className="mt-8 grid gap-4 border-b border-gray-100 pb-8 text-gray-700 md:grid-cols-2">
              <p>👤 Host: <strong>{game.host?.name || "CourtMate player"}</strong></p>
              <p>📍 Court: <strong>{game.courtName}</strong></p>
              <p>🎯 Level: <strong className="capitalize">{game.skillLevel}</strong></p>
              <p>🏙️ City: <strong>{game.city}</strong></p>
            </div>

            <div className="mt-8 rounded-2xl bg-gray-50 p-5 md:p-6">
              <p className="font-bold text-gray-950">Court location</p>
              <p className="mt-2 text-gray-600">{game.address}, {game.city}</p>
              <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-xl bg-gray-950 px-5 py-3 font-semibold text-white transition hover:bg-orange-500">Open in Google Maps</a>
              {hasCoordinates && (
                <iframe
                  title={`Map showing ${game.courtName}`}
                  src={mapEmbedUrl}
                  className="mt-5 h-72 w-full rounded-xl border-0"
                  loading="lazy"
                />
              )}
            </div>

            {actionMessage && <p className="mt-6 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-orange-700">{actionMessage}</p>}
            <button type="button" onClick={updateMembership} disabled={updating || isFull} className="mt-8 w-full rounded-xl bg-orange-500 px-4 py-4 font-bold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50">
              {updating ? "Updating..." : game.isJoined ? "Leave Game" : isFull ? "Game Full" : "Join Game"}
            </button>
          </div>
        </article>
      </div>
    </main>
  );
}

export default GameDetails;
