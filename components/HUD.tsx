
import React from 'react';

interface HUDProps {
  speed: number;
  distance: number;
  isGameOver: boolean;
  onRestart: () => void;
}

const HUD: React.FC<HUDProps> = ({ speed, distance, isGameOver, onRestart }) => {
  return (
    <>
      {/* Metrics Overlay */}
      <div className="absolute top-8 right-8 flex flex-col items-end gap-4 pointer-events-none">
        {/* Speedometer */}
        <div className="bg-black/70 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-3xl shadow-2xl flex flex-col items-end">
          <div className="text-white/40 text-xs font-black uppercase tracking-[0.2em] mb-1">Velocity</div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-white tabular-nums tracking-tighter">{speed}</span>
            <span className="text-xl font-bold text-red-500">KM/H</span>
          </div>
        </div>

        {/* Distance */}
        <div className="bg-black/70 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-2xl shadow-xl flex flex-col items-end">
          <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Distance</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white tabular-nums">{distance.toLocaleString()}</span>
            <span className="text-sm font-bold text-white/40 italic">M</span>
          </div>
        </div>
        
        {/* Speed Indicator Bar */}
        <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-red-500 transition-all duration-150"
            style={{ width: `${Math.min((speed / 180) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl transition-all duration-700">
          <div className="text-center p-12 max-w-lg w-full">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-red-500/30 blur-3xl rounded-full"></div>
              <div className="relative w-28 h-28 bg-red-600 rounded-3xl rotate-12 flex items-center justify-center mx-auto border-4 border-white/20 shadow-2xl">
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
              </div>
            </div>
            
            <h2 className="text-7xl font-black text-white mb-4 italic uppercase tracking-tighter leading-none">FATAL CRASH</h2>
            <p className="text-white/60 text-xl mb-10 font-medium leading-relaxed">
              Your journey ended after <span className="text-white font-bold">{distance} meters</span>. 
              The highway is unforgiving.
            </p>
            
            <button 
              onClick={onRestart}
              className="group relative inline-flex items-center justify-center px-12 py-5 bg-white text-black font-black text-2xl rounded-2xl overflow-hidden transition-all hover:bg-red-600 hover:text-white hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                RETRY RACE
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Brand Title */}
      <div className="absolute top-8 left-8 flex items-center gap-5 pointer-events-none">
        <div className="bg-red-600 w-12 h-12 rounded-xl flex items-center justify-center -rotate-6 shadow-2xl border-b-4 border-red-800">
          <span className="text-white font-black text-2xl italic">N</span>
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase flex items-baseline gap-1">
          Nitro<span className="text-red-600">Sim</span>
          <span className="text-[10px] text-white/30 tracking-widest ml-2 border border-white/20 px-2 py-0.5 rounded italic">V2 HIGHWAY</span>
        </h1>
      </div>
    </>
  );
};

export default HUD;
