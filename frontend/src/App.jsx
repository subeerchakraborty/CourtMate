import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Games from "./pages/Games";
import HostGame from "./pages/HostGame";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyGames from "./pages/MyGames";
import GameDetails from "./pages/GameDetails";
import EditGame from "./pages/EditGame";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/games" element={<Games />} />
      <Route path="/games/:gameId" element={<GameDetails />} />
      <Route path="/games/:gameId/edit" element={<EditGame />} />
      <Route path="/host" element={<HostGame />} />
      <Route path="/my-games" element={<MyGames />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
