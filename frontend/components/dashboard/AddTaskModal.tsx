"use client";
import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTaskModal({ isOpen, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Calls your Backend API
      await axios.post("http://localhost:3000/tasks", {
        title,
        priority: "normal" 
      });
      setTitle("");
      onSuccess(); // Triggers a refresh of the dashboard
      onClose();
    } catch (err) {
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-black border border-green-500 p-6 rounded-lg w-96 shadow-[0_0_20px_rgba(0,255,0,0.2)]">
        <div className="flex justify-between mb-4">
          <h2 className="text-green-400 font-mono text-xl font-bold">NEW PROTOCOL</h2>
          <button onClick={onClose}><X className="text-green-700 hover:text-red-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            autoFocus
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task execution name..."
            className="w-full bg-green-900/10 border border-green-800 text-green-100 p-2 rounded focus:outline-none focus:border-green-500 font-mono"
          />
          <button 
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-600 text-black font-bold py-2 rounded transition-colors"
          >
            {loading ? "UPLOADING..." : "INITIATE"}
          </button>
        </form>
      </div>
    </div>
  );
}
