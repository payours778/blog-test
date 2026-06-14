"use client";

import { useState, useEffect } from "react";

export function FooterInfo() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-3xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-sm overflow-hidden">
      <div className="p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="px-6 py-2 rounded-2xl bg-slate-900 dark:bg-black text-white font-mono text-xl">
            {currentTime}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            <span className="text-green-500 mr-1">●</span>
            系统已稳定运行：<span className="font-bold text-indigo-600 dark:text-indigo-400">65天</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/30 dark:bg-white/5">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            Next.js 15
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/30 dark:bg-white/5">
            <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            React 19
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/30 dark:bg-white/5">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Tailwind 4
          </div>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          赣ICP备 20260240号
        </div>
      </div>
    </div>
  );
}
