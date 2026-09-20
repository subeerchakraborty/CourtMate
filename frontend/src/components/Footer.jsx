function Footer() {
  return (
    <footer className="bg-[#090707] px-6 py-14 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          
          <div>
            <h2 className="text-2xl font-bold">
              🏀 CourtMate
            </h2>

            <p className="mt-3 max-w-sm text-gray-400">
              Find basketball games, meet new players, and get on the court.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              Quick Links
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-gray-400">
              <a href="/" className="hover:text-orange-400">Home</a>
              <a href="/games" className="hover:text-orange-400">Find Games</a>
              <a href="/host" className="hover:text-orange-400">Host a Game</a>
            </div>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
          © 2026 CourtMate. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
