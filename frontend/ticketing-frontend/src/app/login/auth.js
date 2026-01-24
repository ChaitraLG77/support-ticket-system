"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    if (res.ok) {
      alert("Account created. Please login.");
      setIsLogin(true);
      setUsername("");
      setEmail("");
      setPassword("");
    } else {
      alert("Registration failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      alert("Invalid username or password");
      return;
    }

    const token = await res.text(); // JWT returned as String
    localStorage.setItem("token", token);

    router.push("/tickets");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-[380px]">

        <div className="flex mb-6">
          <button
            type="button"
            className={`flex-1 py-2 ${isLogin ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            type="button"
            className={`flex-1 py-2 ${!isLogin ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">

          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              className="w-full border p-2 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}

          {isLogin && (
            <input
              type="text"
              placeholder="Username"
              className="w-full border p-2 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}

          {!isLogin && (
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            {isLogin ? "Login" : "Create Account"}
          </button>

        </form>

      </div>
    </div>
  );
}

