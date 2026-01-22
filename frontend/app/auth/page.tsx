"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "login"; // 'login' or 'register'

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    const endpoint = mode === "register" ? "/register" : "/login";

    try {
      // Send request to backend
      await axios.post(`http://localhost:3000${endpoint}`, {
        username,
        password
      });

      // If successful, go to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      if (err.response) {
         // Show specific error (e.g., "Incorrect credentials")
         setError(err.response.data); 
      } else {
         setError("Connection failed. Is backend running?");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 flex flex-col items-center justify-center font-mono">
      <div className="border border-green-800 p-8 rounded w-96">
        <h2 className="text-2xl mb-6 uppercase border-b border-green-900 pb-2">
            {mode === "register" ? "New User" : "System Access"}
        </h2>

        <div className="flex flex-col gap-4">
            <input 
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="bg-black border border-green-700 p-2 text-white outline-none focus:border-green-400"
            />
            <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-black border border-green-700 p-2 text-white outline-none focus:border-green-400"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button 
                onClick={handleSubmit}
                className="bg-green-700 text-black font-bold py-2 hover:bg-green-500 transition"
            >
                {mode === "register" ? "CREATE ID" : "ENTER"}
            </button>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}
