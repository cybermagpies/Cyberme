"use client";
import Link from "next/link";
import { ArrowRight, Terminal, Shield, Activity } from "lucide-react";

export default function Hero() {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-between px-8 py-20 max-w-7xl mx-auto min-h-[85vh]">

      {/* Left Column: The Copy */}
      <div className="md:w-1/2 space-y-8 z-10">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white tracking-tighter">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-700">Operating System</span> <br />
          For Your Life.
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed font-light">
          Stop juggling apps. Manage your <strong>Task Protocols</strong>, track <strong>Crypto Assets</strong>, and log your <strong>Neural State</strong> in one unified, hacker-grade terminal.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
          <Link href="/auth?mode=register">
            <button className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-black text-lg font-bold py-4 px-8 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] flex justify-center items-center gap-2">
              Initialize System <ArrowRight size={20} />
            </button>
          </Link>

          <Link href="/about">
             <button className="w-full sm:w-auto text-gray-300 hover:text-white font-mono text-sm flex items-center gap-2 group">
               View System Architecture <span className="group-hover:translate-x-1 transition-transform">→</span>
             </button>
          </Link>
        </div>

        <div className="flex items-center gap-6 pt-8 text-green-900/60 font-mono text-xs uppercase tracking-widest">
           <span className="flex items-center gap-2"><Shield size={14} /> End-to-End Encrypted</span>
           <span className="flex items-center gap-2"><Activity size={14} /> 99.9% Uptime</span>
        </div>
      </div>

      {/* Right Column: The Cyber Globe */}
      <div className="md:w-1/2 flex justify-center items-center relative mb-12 md:mb-0">
        <div className="absolute w-[400px] h-[400px] bg-green-500/10 blur-[120px] rounded-full"></div>

        <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] border border-green-500/20 rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
           <div className="absolute w-[70%] h-[70%] border border-dashed border-green-500/30 rounded-full"></div>
           <div className="absolute w-[110%] h-[40%] border border-green-500/10 rounded-[100%] rotate-45"></div>
           <div className="absolute w-[110%] h-[40%] border border-green-500/10 rounded-[100%] -rotate-45"></div>

           <div className="w-32 h-32 bg-green-900/20 backdrop-blur-md rounded-full flex items-center justify-center border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)] z-20">
              <Terminal size={48} className="text-green-400" />
           </div>

           <div className="absolute top-10 right-20 bg-black border border-green-800 p-2 rounded-lg shadow-lg animate-bounce">
              <div className="text-xs text-green-500 font-mono">TASKS: 5</div>
           </div>
           <div className="absolute bottom-20 left-10 bg-black border border-green-800 p-2 rounded-lg shadow-lg animate-pulse">
              <div className="text-xs text-green-500 font-mono">BTC: +2.4%</div>
           </div>
        </div>
      </div>
    </div>
  );
}
