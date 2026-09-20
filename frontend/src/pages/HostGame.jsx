import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import geocodeAddress from "../utils/geocode";
import getTodayInputValue from "../utils/date";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function HostGame() {
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    skillLevel: "",
    courtName: "",
    city: "",
    address: "",
    date: "",
    startTime: "",
    endTime: "",
    maxPlayers: "10",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("Please log in before hosting a game.");
      return;
    }

    const todayValue = getTodayInputValue();
    if (form.date < todayValue) {
      setError("Game date cannot be in the past.");
      return;
    }
    if (form.endTime <= form.startTime) {
      setError("End time must be after start time.");
      return;
    }
    if (form.date === todayValue) {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      if (form.startTime <= currentTime) {
        setError("Start time must be later than the current time.");
        return;
      }
    }

    setSubmitting(true);

    try {
      const location = await geocodeAddress(form).catch(() => null);
      const idToken = await user.getIdToken(true);
      const response = await fetch(`${API_URL}/api/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ ...form, ...(location ? { location } : {}) }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to host the game.");
      }

      setSuccess(`Game "${data.game.title}" was created successfully.`);
      setForm({
        title: "",
        description: "",
        skillLevel: "",
        courtName: "",
        city: "",
        address: "",
        date: "",
        startTime: "",
        endTime: "",
        maxPlayers: "10",
      });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return <main className="min-h-screen bg-gray-50 px-8 py-12">Checking your account...</main>;
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-gray-950">Log in to host a game</h1>
          <p className="mt-3 text-gray-600">
            You need a CourtMate account before you can create a game.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] px-5 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm md:p-10">
        <p className="font-bold uppercase tracking-[0.25em] text-orange-500">
          Bring players together
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-gray-950 md:text-5xl">Host a Game</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
          Add the details so players can find and join your game.
        </p>

        <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="border-b border-gray-100 pb-2 md:col-span-2"><p className="text-lg font-black text-gray-950">Game details</p><p className="mt-1 text-sm text-gray-500">Give your run a clear name and level.</p></div>
            <label className="block md:col-span-2">
              <span className="mb-2 block font-semibold text-gray-800">Game title</span>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Evening Pickup Game"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block font-semibold text-gray-800">Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Tell players what to expect"
                rows="3"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-semibold text-gray-800">Game level</span>
              <select
                name="skillLevel"
                value={form.skillLevel}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
              >
                <option value="">Select level</option>
                <option value="newbie">Newbie</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block font-semibold text-gray-800">Maximum players</span>
              <input
                name="maxPlayers"
                type="number"
                min="2"
                max="100"
                value={form.maxPlayers}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
              />
            </label>

            <div className="border-b border-gray-100 pb-2 pt-3 md:col-span-2"><p className="text-lg font-black text-gray-950">Court location</p><p className="mt-1 text-sm text-gray-500">We’ll use this address to show the location on the map.</p></div>

            <label className="block">
              <span className="mb-2 block font-semibold text-gray-800">Court name</span>
              <input
                name="courtName"
                value={form.courtName}
                onChange={handleChange}
                placeholder="LPU Basketball Court"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
              />
            </label>

            <div className="border-b border-gray-100 pb-2 pt-3 md:col-span-2"><p className="text-lg font-black text-gray-950">Schedule</p><p className="mt-1 text-sm text-gray-500">Choose a time from today onward.</p></div>

            <label className="block">
              <span className="mb-2 block font-semibold text-gray-800">City</span>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Jalandhar"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block font-semibold text-gray-800">Court address</span>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Full address"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-semibold text-gray-800">Date</span>
              <input
                name="date"
                type="date"
                min={getTodayInputValue()}
                value={form.date}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block font-semibold text-gray-800">Start</span>
                <input
                  name="startTime"
                  type="time"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-orange-500"
                />
              </label>
              <label className="block">
                <span className="mb-2 block font-semibold text-gray-800">End</span>
                <input
                  name="endTime"
                  type="time"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-orange-500"
                />
              </label>
            </div>
          </div>

          {error && <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {success && (
            <p className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-orange-500 px-4 py-4 font-bold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating game..." : "Host this game"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default HostGame;
