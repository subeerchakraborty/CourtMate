import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import geocodeAddress from "../utils/geocode";
import getTodayInputValue from "../utils/date";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function EditGame() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadGame() {
      try {
        const response = await fetch(`${API_URL}/api/games/${gameId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load game");
        setForm({ ...data.game, date: data.game.date.slice(0, 10) });
      } catch (loadError) {
        setError(loadError.message);
      }
    }
    loadGame();
  }, [gameId]);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const todayValue = getTodayInputValue();
      if (form.date < todayValue) throw new Error("Game date cannot be in the past.");
      if (form.endTime <= form.startTime) throw new Error("End time must be after start time.");
      if (form.date === todayValue) {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        if (form.startTime <= currentTime) throw new Error("Start time must be later than the current time.");
      }
      setSaving(true);
      const location = await geocodeAddress(form).catch(() => null);
      const token = await user.getIdToken(true);
      const response = await fetch(`${API_URL}/api/games/${gameId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, ...(location ? { location } : {}) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to update the game");
      navigate(`/games/${gameId}`);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || !form) return <main className="min-h-screen bg-gray-50 px-8 py-12">{error || "Loading game..."}</main>;
  if (!user) return <main className="min-h-screen bg-gray-50 px-8 py-12"><Link to="/login">Log in to edit this game</Link></main>;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-950">Edit Game</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[["title", "Game title"], ["courtName", "Court name"], ["city", "City"], ["address", "Court address"], ["date", "Date"], ["startTime", "Start time"], ["endTime", "End time"], ["maxPlayers", "Maximum players"]].map(([name, label]) => (
            <label key={name} className="block">
              <span className="mb-2 block font-semibold text-gray-800">{label}</span>
              <input name={name} type={name === "date" ? "date" : name.includes("Time") ? "time" : name === "maxPlayers" ? "number" : "text"} min={name === "date" ? getTodayInputValue() : undefined} value={form[name] || ""} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500" />
            </label>
          ))}
          <label className="block">
            <span className="mb-2 block font-semibold text-gray-800">Game level</span>
            <select name="skillLevel" value={form.skillLevel} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3">
              <option value="newbie">Newbie</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block font-semibold text-gray-800">Description</span>
            <textarea name="description" value={form.description || ""} onChange={handleChange} rows="4" className="w-full rounded-xl border border-gray-200 px-4 py-3" />
          </label>
        </div>
        {error && <p className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
        <button type="submit" disabled={saving} className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save changes"}</button>
      </form>
    </main>
  );
}

export default EditGame;
