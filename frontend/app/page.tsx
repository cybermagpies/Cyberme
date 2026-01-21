"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen, Brain, Terminal, Save } from "lucide-react";

// Data Model
interface Log {
  id: string;
  date: string;
  entry_type: string;
  mood: string;
  content: string;
}

export default function Home() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("Neutral");
  const [type, setType] = useState("Journal");

  // 1. Fetch Logs
  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:3000/logs");
      setLogs(res.data);
    } catch (err) {
      console.error("Backend offline?", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 2. Submit Log
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    try {
      await axios.post("http://127.0.0.1:3000/logs", {
        date: new Date().toISOString().split("T")[0], 
        entry_type: type,
        mood: mood,
        content: content,
      });
      setContent("");
      fetchLogs();
    } catch (err) {
      alert("Failed to save. Is backend running?");
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8">
      {/* Header */}
      <header className="flex items-center gap-4 mb-12 border-b border-green-800 pb-4">
        <Terminal className="w-8 h-8" />
        <h1 className="text-3xl font-bold tracking-widest">CYBERME V1.0</h1>
        <div className="ml-auto flex gap-4 text-sm text-green-800">
          <span>SYSTEM: ONLINE</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Input */}
        <section className="col-span-1 md:col-span-2 border border-green-800 p-6 rounded bg-gray-900/50">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5" /> NEW ENTRY
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <select value={type} onChange={(e) => setType(e.target.value)} className="bg-black border border-green-700 p-2 rounded">
                <option>Journal</option><option>Idea</option><option>Work</option><option>Dream</option>
              </select>
              <select value={mood} onChange={(e) => setMood(e.target.value)} className="bg-black border border-green-700 p-2 rounded">
                <option>Neutral</option><option>Focused</option><option>Anxious</option><option>Victorious</option>
              </select>
            </div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full h-40 bg-black border border-green-700 p-4 rounded" placeholder="Input stream..." />
            <button type="submit" className="flex items-center gap-2 bg-green-900/30 border border-green-600 px-6 py-2 rounded"><Save className="w-4 h-4" /> SAVE</button>
          </form>
        </section>

        {/* List */}
        <section className="border border-green-800 p-6 rounded bg-gray-900/50">
          <h2 className="text-xl mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5" /> RECENT LOGS</h2>
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="border-b border-green-900 pb-2">
                <div className="flex justify-between text-xs text-green-700 mb-1">
                  <span>{log.date}</span><span className="uppercase">[{log.entry_type}]</span>
                </div>
                <p className="text-sm opacity-90">{log.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
