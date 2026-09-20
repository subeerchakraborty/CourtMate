import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function PopularGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPopularGames() {
      try {
        const response = await fetch(`${API_URL}/api/games?limit=3&sort=popular`);
        const data = await response.json();
        if (response.ok) setGames(data.games);
      } finally {
        setLoading(false);
      }
    }

    loadPopularGames();
  }, []);

  return (
    <section className="bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">Popular Games</h2>
            <p className="mt-3 text-gray-600">Find a real game and get on the court.</p>
          </div>
          <Link to="/games" className="font-semibold text-orange-500 hover:text-orange-600">View All →</Link>
        </div>

        {loading ? <p className="text-gray-600">Loading popular games...</p> : games.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-gray-600 shadow-sm">No upcoming games yet. Be the first to host one.</div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <article key={game._id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex h-32 items-center justify-center bg-orange-50 text-6xl">🏀</div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-gray-900">{game.title}</h3>
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold capitalize text-blue-700">{game.skillLevel}</span>
                  </div>
                  <p className="mt-3 text-gray-500">📍 {game.courtName}, {game.city}</p>
                  <div className="mt-5 space-y-2 text-sm text-gray-600">
                    <p>📅 {new Date(game.date).toLocaleDateString()}</p>
                    <p>🕐 {game.startTime} - {game.endTime}</p>
                    <p>👥 {game.players.length} / {game.maxPlayers} players</p>
                  </div>
                  <Link to={`/games/${game._id}`} className="mt-6 block w-full rounded-lg bg-orange-500 py-3 text-center font-semibold text-white hover:bg-orange-600">View Game</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PopularGames;
