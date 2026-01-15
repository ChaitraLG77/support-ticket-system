"use client";
import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await apiRequest("/tickets", "GET", null, {
        username,
        password,
      });
      alert("Login successful");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        className="border p-2 w-full mb-4"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2"
        onClick={login}
      >
        Login
      </button>
    </div>
  );
}
