import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

import { auth } from "../config/firebase";
import { useAuth } from "../context/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getSignupErrorMessage(error) {
  const messages = {
    "auth/email-already-in-use": "An account already exists with this email.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password should be at least 6 characters.",
  };

  return messages[error.code] || "Unable to create your account. Please try again.";
}

function Register() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    skillLevel: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (!form.name.trim() || !form.skillLevel) {
      setError("Name and skill level are required.");
      return;
    }

    setLoading(true);

    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );

      await updateProfile(credentials.user, {
        displayName: form.name.trim(),
      });
      await refreshUser();

      const idToken = await credentials.user.getIdToken(true);
      console.log(`[Signup] Sending profile request to ${API_URL}/api/users/profile`);
      console.log(
        `[Signup] Firebase token shape: length=${idToken.length}, segments=${idToken.split(".").length}`,
      );
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          skillLevel: form.skillLevel,
        }),
      });

      const data = await response.json();

      console.log(`[Signup] Profile response status: ${response.status}`);

      if (!response.ok) {
        const errorCode = data.code ? ` (${data.code})` : "";
        throw new Error(
          `${data.message || "Unable to save your profile."}${errorCode}`,
        );
      }

      navigate("/");
    } catch (signupError) {
      setError(
        signupError.code ? getSignupErrorMessage(signupError) : signupError.message,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
          Join CourtMate
        </p>
        <h1 className="mt-3 text-3xl font-bold text-gray-950">Create your account</h1>
        <p className="mt-2 text-gray-600">
          Tell us a little about yourself so we can help you find the right games.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block font-semibold text-gray-800">Name</span>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-semibold text-gray-800">Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-semibold text-gray-800">Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              minLength={6}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-semibold text-gray-800">Skill level</span>
            <select
              name="skillLevel"
              value={form.skillLevel}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-orange-500"
            >
              <option value="">Select your level</option>
              <option value="newbie">Newbie</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-700">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
