import { useState } from "react";

const games = [
  {
    id: 1,
    title: "Evening Pickup Game",
    court: "LPU Basketball Court",
    location: "Jalandhar",
    date: "Today",
    time: "6:00 PM",
    players: "8 / 10",
  },
  {
    id: 2,
    title: "Sunday Morning Hoops",
    court: "City Sports Arena",
    location: "Phagwara",
    date: "Sunday, 12 May",
    time: "8:00 AM",
    players: "6 / 10",
  },
  {
    id: 3,
    title: "Casual 3v3 Basketball",
    court: "Model Town Court",
    location: "Jalandhar",
    date: "Tuesday, 14 May",
    time: "7:30 PM",
    players: "4 / 6",
  },
];

function Games() {
  const [search, setSearch] = useState("");

  const filteredGames = games.filter((game) => {
    const searchText = search.toLowerCase();

    return (
      game.court.toLowerCase().includes(searchText) ||
      game.location.toLowerCase().includes(searchText)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 px-8 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-3 font-semibold uppercase tracking-widest text-orange-500">
            Discover your next game
          </p>
          <h1 className="text-4xl font-bold text-gray-950">Find Games</h1>
          <p className="mt-3 text-lg text-gray-600">
            Join a game, meet new players, and get on the court.
          </p>
        </div>

        <div className="mb-10 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
          <input
            type="text"
            placeholder="Search by court or city"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-96 rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none transition focus:border-orange-500"
          />
          <input
            type="text"
            placeholder="Enter your location"
            className="w-80 rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none transition focus:border-orange-500"
          />
          <button className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
            Use my location
          </button>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-950">Available games</h2>
          <span className="text-gray-500">{filteredGames.length} games found</span>
        </div>

        {filteredGames.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <h3 className="text-xl font-bold text-gray-950">No games found</h3>
            <p className="mt-2 text-gray-600">Try searching for another court or city.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <article
                key={game.id}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-orange-500">
                      PICKUP GAME
                    </p>
                    <h3 className="text-xl font-bold text-gray-950">{game.title}</h3>
                  </div>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
                    {game.players}
                  </span>
                </div>

                <div className="space-y-3 text-gray-600">
                  <p>📍 {game.court}, {game.location}</p>
                  <p>📅 {game.date}</p>
                  <p>🕒 {game.time}</p>
                </div>

                <button className="mt-6 w-full rounded-xl border border-gray-900 px-4 py-3 font-semibold text-gray-900 transition hover:bg-gray-950 hover:text-white">
                  View Game
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Games;
