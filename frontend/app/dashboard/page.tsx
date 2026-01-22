"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import WidgetCard from "@/components/dashboard/WidgetCard";
import AddTaskModal from "@/components/dashboard/AddTaskModal"; 
import { Loader2, CheckSquare, Brain, Bitcoin } from "lucide-react";

// Types
interface DashboardData {
  greeting: string;
  widgets: {
    tasks: { pending_count: number; recent_tasks: any[] };
  };
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  // Function to refresh data 
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/dashboard/summary");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Handle clicking a checkbox to mark done/undone
  const toggleTask = async (id: string) => {
    // 1. Optimistic Update (Instant visual feedback)
    const originalData = { ...data };
    if (data) {
        setData({
            ...data,
            widgets: {
                ...data.widgets,
                tasks: {
                    ...data.widgets.tasks,
                    recent_tasks: data.widgets.tasks.recent_tasks.map(t => 
                        t.id === id ? { ...t, is_done: !t.is_done } : t
                    )
                }
            }
        });
    }

    // 2. Send to Backend
    try {
        await axios.post(`http://localhost:3000/tasks/${id}`);
        fetchData(); // Refresh to ensure sync
    } catch (err) {
        setData(originalData as DashboardData); // Revert if failed
        alert("Sync failed");
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-green-500 flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-6">
      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
      />

      {/* Top Bar */}
      <header className="flex justify-between items-center mb-8 border-b border-green-900 pb-4">
        <div>
          <h1 className="text-2xl font-bold">{data?.greeting}</h1>
          <p className="text-sm text-green-700">System Online. All metrics nominal.</p>
        </div>
        <div className="flex gap-4">
           {/* Button now opens the Modal */}
           <button 
             onClick={() => setIsModalOpen(true)}
             className="bg-green-900/30 px-4 py-2 rounded hover:bg-green-800 text-sm border border-green-800 transition-all hover:shadow-[0_0_10px_rgba(0,255,0,0.3)]"
           >
             + Quick Add
           </button>
           <div className="text-2xl font-bold border border-green-800 px-4 py-2 rounded">
             {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
           </div>
        </div>
      </header>

      {/* The Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* 1. Tasks Widget (Now Interactive) */}
        <WidgetCard title="Active Protocols (Tasks)" colSpan="lg:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-900/20 p-3 rounded-full">
              <CheckSquare size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{data?.widgets.tasks.pending_count}</p>
              <p className="text-xs uppercase text-green-600">Pending Execution</p>
            </div>
          </div>
          <div className="space-y-2">
            {data?.widgets.tasks.recent_tasks.length === 0 ? (
                <p className="text-gray-600 italic">No active tasks.</p>
            ) : (
                data?.widgets.tasks.recent_tasks.map((task: any) => (
                    <div key={task.id} 
                         onClick={() => toggleTask(task.id)}
                         className={`flex justify-between items-center p-2 rounded border-l-2 cursor-pointer transition-all hover:bg-green-900/20 ${task.is_done ? 'opacity-50 line-through border-gray-600' : 'bg-green-900/10 border-green-600'}`}
                    >
                        <span>{task.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${task.priority === 'high' ? 'bg-red-900 text-red-200' : 'bg-green-900 text-white'}`}>
                            {task.priority || "NORMAL"}
                        </span>
                    </div>
                ))
            )}
          </div>
        </WidgetCard>

        {/* Other widgets (Visual placeholders for now) */}
        <WidgetCard title="Neural State (Journal)" colSpan="row-span-2">
            <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
            <Brain size={48} />
            <p>No entry today</p>
            <button className="text-sm underline hover:text-white">Log State</button>
            </div>
        </WidgetCard>

        <WidgetCard title="Assets">
            <div className="flex items-center gap-3">
                <Bitcoin size={20} />
                <span className="text-xl">$0.00</span>
            </div>
        </WidgetCard>

        <WidgetCard title="Productivity">
             <div className="h-24 flex items-end gap-1">
                  <div className="w-4 bg-green-900 h-[40%]"></div>
                  <div className="w-4 bg-green-800 h-[60%]"></div>
                  <div className="w-4 bg-green-600 h-[80%]"></div>
                  <div className="w-4 bg-green-500 h-[50%]"></div>
             </div>
        </WidgetCard>

        <WidgetCard title="Quick Notes" colSpan="lg:col-span-2">
           <textarea 
              className="w-full h-full bg-transparent border-none outline-none resize-none text-sm font-mono placeholder-green-900" 
              placeholder="Type ephemeral thoughts here..."
           ></textarea>
        </WidgetCard>

      </div>
    </div>
  );
}
