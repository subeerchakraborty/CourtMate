import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="overflow-hidden bg-[#120b0a] px-6 py-20 text-white md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="inline-flex rounded-full border border-orange-300/40 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-200">
            🏀 Built for local hoopers
          </span>
          <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">
            Find your next
            <span className="block bg-gradient-to-r from-orange-300 via-orange-500 to-red-500 bg-clip-text text-transparent">
              basketball game.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-orange-50/75">
            Discover nearby games, meet new players, and get on the court without waiting for the group chat.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/games" className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-950/40 transition hover:bg-orange-400">Find Games →</Link>
            <Link to="/host" className="rounded-xl border border-white/30 px-6 py-3 font-bold text-white transition hover:border-orange-300 hover:text-orange-200">Host a Game</Link>
          </div>
          <div className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-6">
            <div><p className="text-2xl font-black">Local</p><p className="text-sm text-orange-100/60">games nearby</p></div>
            <div><p className="text-2xl font-black">Skill-based</p><p className="text-sm text-orange-100/60">better matches</p></div>
            <div><p className="text-2xl font-black">Simple</p><p className="text-sm text-orange-100/60">join and play</p></div>
          </div>
        </div>
        <div className="relative mx-auto flex min-h-[360px] w-full max-w-xl items-center justify-center overflow-hidden rounded-[2rem] border border-orange-200/20 bg-gradient-to-br from-orange-500 via-red-700 to-[#160b16] shadow-2xl shadow-orange-950/40">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(90deg, transparent 49%, #fff 50%, transparent 51%), linear-gradient(0deg, transparent 49%, #fff 50%, transparent 51%)", backgroundSize: "130px 130px" }} />
          <div className="absolute h-64 w-64 rounded-full border-2 border-white/50" />
          <div className="absolute bottom-10 left-8 right-8 h-24 rounded-[50%] border-2 border-white/40" />
          <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-8 border-orange-100 bg-orange-500 text-8xl shadow-2xl shadow-black/40">🏀</div>
          <div className="absolute right-5 top-5 rounded-2xl bg-black/35 px-4 py-3 text-sm backdrop-blur"><span className="font-bold text-orange-200">Next run</span><br />Starts with one click</div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
