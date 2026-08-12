import { Link } from "react-router-dom";
import Button from "./Button";

function Navbar() {
  return (
    <nav className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-900">
          🏀 CourtMate
        </Link>

        {/* Navigation */}
        <div className="flex gap-8">
          <Link to="/" className="text-gray-700 hover:text-orange-500">
            Home
          </Link>

          <Link to="/games" className="text-gray-700 hover:text-orange-500">
            Find Games
          </Link>

          <Link to="/host" className="text-gray-700 hover:text-orange-500">
            Host a Game
          </Link>
        </div>

        {/* Authentication */}
        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:border-orange-500"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
