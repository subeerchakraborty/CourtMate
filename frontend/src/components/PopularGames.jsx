function PopularGames() {
  const games = [
    {
      id: 1,
      court: "LPU Basketball Court",
      location: "Jalandhar",
      date: "Today",
      time: "6:00 PM",
      players: "8 / 10",
    },
    {
      id: 2,
      court: "City Sports Complex",
      location: "Jalandhar",
      date: "Tomorrow",
      time: "5:30 PM",
      players: "6 / 10",
    },
    {
      id: 3,
      court: "Community Basketball Court",
      location: "Amritsar",
      date: "Tomorrow",
      time: "7:00 PM",
      players: "9 / 10",
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              Popular Games
            </h2>

            <p className="mt-3 text-gray-600">
              Find a game and get on the court.
            </p>
          </div>

          <button className="text-orange-500 font-semibold">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                <span className="text-5xl">🏀</span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {game.court}
                </h3>

                <p className="mt-2 text-gray-500">
                  📍 {game.location}
                </p>

                <div className="mt-5 space-y-2 text-sm text-gray-600">
                  <p>📅 {game.date}</p>
                  <p>🕐 {game.time}</p>
                  <p>👥 {game.players} players</p>
                </div>

                <button className="mt-6 w-full rounded-lg bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600">
                  View Game
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default PopularGames;