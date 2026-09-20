import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { updateProfile } from "firebase/auth";

import { auth } from "../config/firebase";
import { useAuth } from "../context/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Profile() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: "", skillLevel: "" });
  const [stats, setStats] = useState({ joinedGames: 0, hostedGames: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken(true);
        const response = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load profile");
        setForm({ name: data.user.name, skillLevel: data.user.skillLevel });
        setStats(data.stats);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSaving(true);
      setMessage("");
      setError("");
      const token = await user.getIdToken(true);
      const response = await fetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to update profile");
      await updateProfile(auth.currentUser, { displayName: form.name.trim() });
      await refreshUser();
      setForm({ name: data.user.name, skillLevel: data.user.skillLevel });
      setMessage("Profile updated successfully.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  if (authLoading) return <main className="min-h-screen bg-gray-50 px-8 py-12">Checking your account...</main>;
  if (!user) {
    return <main className="min-h-screen bg-gray-50 px-8 py-12"><Link to="/login" className="font-semibold text-orange-600">Log in to view your profile</Link></main>;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <p className="font-semibold uppercase tracking-widest text-orange-500">Your account</p>
        <h1 className="mt-3 text-4xl font-bold text-gray-950">My Profile</h1>
        {loading ? <p className="mt-8">Loading profile...</p> : (
          <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.3fr]">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Games joined</p><p className="mt-2 text-3xl font-bold text-gray-950">{stats.joinedGames}</p></div>
              <div className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Games hosted</p><p className="mt-2 text-3xl font-bold text-gray-950">{stats.hostedGames}</p></div>
              <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Email</p><p className="mt-2 break-all font-semibold text-gray-950">{user.email}</p></div>
            </div>
            <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
              <label className="block"><span className="mb-2 block font-semibold text-gray-800">Name</span><input name="name" value={form.name} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500" /></label>
              <label className="mt-5 block"><span className="mb-2 block font-semibold text-gray-800">Skill level</span><select name="skillLevel" value={form.skillLevel} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"><option value="newbie">Newbie</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label>
              {message && <p className="mt-5 rounded-xl bg-green-50 p-3 text-green-700">{message}</p>}
              {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}
              <button type="submit" disabled={saving} className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save changes"}</button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

export default Profile;
