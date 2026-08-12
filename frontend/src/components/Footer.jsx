function Footer() {
  return (
    <footer className="bg-gray-900 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start">
          
          <div>
            <h2 className="text-2xl font-bold">
              🏀 CourtMate
            </h2>

            <p className="mt-3 text-gray-400 max-w-sm">
              Find basketball games, meet new players, and get on the court.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              Quick Links
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-gray-400">
              <a href="/">Home</a>
              <a href="/">Find Games</a>
              <a href="/">Host a Game</a>
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