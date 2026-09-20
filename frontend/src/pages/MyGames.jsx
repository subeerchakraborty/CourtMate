import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function MyGames() {
  const { user, loading: authLoading } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leavingGameId, setLeavingGameId] = useState("");
  const [deletingGameId, setDeletingGameId] = useState("");

  useEffect(() => {
    async function loadGames() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken(true);
        const response = await fetch(`${API_URL}/api/games/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load your games");
        setGames(data.games);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, [user]);

  async function handleLeave(gameId) {
    try {
      setLeavingGameId(gameId);
      const token = await user.getIdToken(true);
      const response = await fetch(`${API_URL}/api/games/${gameId}/leave`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to leave the game");
      setGames((currentGames) => currentGames.filter((game) => game._id !== gameId));
    } catch (leaveError) {
      setError(leaveError.message);
    } finally {
      setLeavingGameId("");
    }
  }

  async function handleDelete(gameId) {
    if (!window.confirm("Permanently delete this game? This cannot be undone.")) return;

    try {
      setDeletingGameId(gameId);
      const token = await user.getIdToken(true);
      const response = await fetch(`${API_URL}/api/games/${gameId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to delete the game");
      setGames((currentGames) => currentGames.filter((game) => game._id !== gameId));
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingGameId("");
    }
  }

  function renderGameCard(game) {
    const isCompleted = game.status === "completed";
    const spotsRemaining = Math.max(game.maxPlayers - game.players.length, 0);

    return (
      <article key={game._id} className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4">
          <span className="text-xs font-black uppercase tracking-widest text-orange-600">{game.isHost ? "Hosted by you" : "Joined game"}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${isCompleted ? "bg-gray-200 text-gray-600" : "bg-white text-green-700"}`}>
            {isCompleted ? "Completed" : "Upcoming"}
          </span>
        </div>
        <div className="p-6">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-500">{game.skillLevel} level</p>
          <h2 className="mt-2 text-2xl font-black text-gray-950">{game.title}</h2>
          <div className="mt-5 space-y-3 text-gray-600">
            <p>📍 {game.courtName}, {game.city}</p>
            <p>📅 {formatDate(game.date)}</p>
            <p>🕒 {game.startTime} - {game.endTime}</p>
            <p className="text-sm font-semibold text-gray-500">👥 {game.players.length} / {game.maxPlayers} players · {spotsRemaining} spots left</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={`/games/${game._id}`} className="rounded-xl border border-gray-900 px-4 py-2 font-semibold text-gray-900 transition hover:bg-gray-950 hover:text-white">View details</Link>
            {!isCompleted && !game.isHost && (
              <button type="button" onClick={() => handleLeave(game._id)} disabled={leavingGameId === game._id} className="rounded-xl border border-red-300 px-4 py-2 font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-50">
                {leavingGameId === game._id ? "Leaving..." : "Leave game"}
              </button>
            )}
            {game.isHost && !isCompleted && (
              <>
                <Link to={`/games/${game._id}/edit`} className="rounded-xl border border-gray-300 px-4 py-2 font-semibold text-gray-700">Edit</Link>
                <button type="button" onClick={() => handleDelete(game._id)} disabled={deletingGameId === game._id} className="rounded-xl border border-red-300 px-4 py-2 font-semibold text-red-600 disabled:opacity-50">
                  {deletingGameId === game._id ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }

  if (authLoading) return <main className="min-h-screen bg-[#faf9f7] px-8 py-12">Checking your account...</main>;
  if (!user) {
    return (
      <main className="min-h-screen bg-[#faf9f7] px-6 py-12">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-gray-950">Log in to see your games</h1>
          <Link to="/login" className="mt-6 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white">Go to Login</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] px-5 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="font-bold uppercase tracking-[0.25em] text-orange-500">Your CourtMate activity</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-gray-950 md:text-5xl">My Games</h1>
        <p className="mt-3 text-lg text-gray-600">Manage the games you host and the games you join.</p>
        {loading ? <p className="mt-8">Loading your games...</p> : error ? <p className="mt-8 rounded-xl bg-red-50 p-4 text-red-700">{error}</p> : (
          games.length === 0 ? <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">You have not joined any games yet.</div> : (
            <>
              {(() => {
                const upcomingGames = games.filter((game) => game.status === "open");
                const pastGames = games.filter((game) => game.status === "completed");
                return (
                  <>
                    <section className="mt-10">
                      <div className="flex items-end justify-between gap-4"><div><p className="font-bold uppercase tracking-[0.2em] text-orange-500">What’s next</p><h2 className="mt-1 text-2xl font-black text-gray-950">Upcoming games</h2></div><span className="text-sm font-semibold text-gray-500">{upcomingGames.length}</span></div>
                      {upcomingGames.length > 0 ? <div className="mt-5 grid gap-5 md:grid-cols-2">{upcomingGames.map(renderGameCard)}</div> : <p className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-gray-600">No upcoming games yet. Find a game to join or host your own.</p>}
                    </section>
                    {pastGames.length > 0 && <section className="mt-12"><div className="flex items-end justify-between gap-4"><div><p className="font-bold uppercase tracking-[0.2em] text-gray-400">Your history</p><h2 className="mt-1 text-2xl font-black text-gray-950">Past games</h2></div><span className="text-sm font-semibold text-gray-500">{pastGames.length}</span></div><div className="mt-5 grid gap-5 md:grid-cols-2">{pastGames.map(renderGameCard)}</div></section>}
                  </>
                );
              })()}
            </>
          )
        )}
      </div>
    </main>
  );
}

export default MyGames;
