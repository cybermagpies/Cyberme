"use client";
import { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";

interface WidgetProps {
  title: string;
  children: ReactNode;
  colSpan?: string; // e.g., "col-span-1" or "col-span-2"
}

export default function WidgetCard({ title, children, colSpan = "col-span-1" }: WidgetProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-black border border-green-900/50 rounded-lg overflow-hidden flex flex-col ${colSpan} transition-all hover:border-green-500/50`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-green-900/10 border-b border-green-900/30">
        <h3 className="text-green-500 font-mono text-sm uppercase tracking-wider font-bold">
          {title}
        </h3>
        <div className="flex gap-2">
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-green-700 hover:text-green-400">
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {/* Body */}
      {!isCollapsed && (
        <div className="p-4 flex-1 overflow-auto min-h-[150px]">
          {children}
        </div>
      )}
    </div>
  );
}
