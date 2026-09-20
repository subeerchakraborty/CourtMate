const benefits = [
  ["⚡", "Find games faster", "Search by city, date, time, and skill level."],
  ["🤝", "Meet local players", "Turn solo practice into a real basketball community."],
  ["📅", "Host your own run", "Create a game and fill the open spots with players."],
  ["🎯", "Play your level", "See the game level before you decide to join."],
];

function WhyCourtMate() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
        <div>
          <p className="font-bold uppercase tracking-[0.25em] text-orange-500">Why CourtMate</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-gray-950 md:text-5xl">Built for hoopers, by hoopers.</h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">We are making it easier to find the game you want, with the people you want to play with.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {benefits.map(([icon, title, description]) => <div key={title} className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">{icon}</span><div><h3 className="font-bold text-gray-950">{title}</h3><p className="mt-1 text-sm leading-6 text-gray-500">{description}</p></div></div>)}
          </div>
        </div>
        <div className="relative min-h-[380px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950 p-8 text-white shadow-xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="relative flex h-full min-h-[320px] flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <span className="text-sm font-semibold uppercase tracking-widest text-orange-300">Tonight's run</span>
            <div><p className="text-3xl font-black">Your next game is closer than you think.</p><p className="mt-3 text-white/60">Browse an open game or bring your own crew together.</p></div>
            <div className="flex -space-x-3 text-2xl"><span>🧑🏽</span><span>👩🏻</span><span>🧔🏾</span><span>👨🏼</span><span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-xs font-bold">+4</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyCourtMate;
