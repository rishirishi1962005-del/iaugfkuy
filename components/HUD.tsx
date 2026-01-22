
import React from 'react';

interface HUDProps {
  speed: number;
  distance: number;
  score: number;
  isGameOver: boolean;
  onRestart: () => void;
  targetWord: string;
  collectedLetters: string[];
  showBonus: boolean;
}

const HUD: React.FC<HUDProps> = ({ 
  speed, 
  distance, 
  score,
  isGameOver, 
  onRestart, 
  targetWord, 
  collectedLetters,
  showBonus
}) => {
  const isWordComplete = targetWord && collectedLetters.length === targetWord.length;

  return (
    <>
      {/* Metrics Overlay */}
      <div className="absolute top-8 right-8 flex flex-col items-end gap-4 pointer-events-none">
        {/* Score Display (Primary) */}
        <div className="bg-black/80 backdrop-blur-xl border-2 border-yellow-500/30 px-8 py-4 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col items-end transform transition-transform duration-300 scale-110 origin-right">
          <div className="text-yellow-500 text-xs font-black uppercase tracking-[0.3em] mb-1">Total Score</div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-white tabular-nums tracking-tighter drop-shadow-lg">
              {Math.floor(score).toLocaleString()}
            </span>
            <span className="text-xl font-bold text-yellow-500 italic">PTS</span>
          </div>
        </div>

        {/* Speedometer */}
        <div className="bg-black/70 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-2xl shadow-2xl flex flex-col items-end">
          <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Velocity</div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white tabular-nums tracking-tighter">{speed}</span>
            <span className="text-sm font-bold text-red-500">KM/H</span>
          </div>
        </div>

        {/* Distance */}
        <div className="bg-black/70 backdrop-blur-xl border border-white/10 px-8 py-2 rounded-xl shadow-xl flex flex-col items-end">
          <div className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">Travelled</div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white tabular-nums">{distance.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-white/40 italic">M</span>
          </div>
        </div>
      </div>

      {/* Bonus Popup */}
      {showBonus && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="bg-yellow-500 text-black px-12 py-6 rounded-3xl font-black text-6xl italic uppercase tracking-tighter shadow-[0_0_100px_rgba(234,179,8,0.6)] animate-bounce border-4 border-white">
            Score x2!
          </div>
        </div>
      )}

      {/* Word Progress HUD */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
        <div className="bg-black/70 backdrop-blur-lg border-b-4 border-yellow-600 p-5 rounded-3xl shadow-2xl flex flex-col items-center min-w-[320px]">
          <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Collection Target</div>
          <div className="flex gap-3">
            {targetWord.split('').map((char, idx) => {
              const isCollected = idx < collectedLetters.length;
              return (
                <div 
                  key={idx}
                  className={`w-12 h-16 rounded-2xl border-2 flex items-center justify-center text-4xl font-black transition-all duration-500 ${
                    isCollected 
                      ? "bg-yellow-400 border-yellow-200 text-black scale-110 rotate-3 shadow-[0_10px_20px_rgba(255,215,0,0.5)]" 
                      : "bg-white/5 border-white/10 text-white/10"
                  }`}
                >
                  {isCollected ? char : ""}
                </div>
              );
            })}
          </div>
          {isWordComplete && (
            <div className="mt-4 text-yellow-400 font-black text-sm uppercase tracking-widest animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              Perfect Sequence
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
            </div>
          )}
        </div>
      </div>

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl transition-all duration-700">
          <div className="text-center p-12 max-w-lg w-full bg-neutral-900/40 border border-white/10 rounded-[4rem] shadow-3xl">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full"></div>
              <div className="relative w-32 h-32 bg-red-600 rounded-[2.5rem] rotate-12 flex items-center justify-center mx-auto border-4 border-white/10 shadow-2xl">
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
              </div>
            </div>
            
            <h2 className="text-6xl font-black text-white mb-2 italic uppercase tracking-tighter leading-none">RACE ENDED</h2>
            <div className="mb-10 mt-6 flex flex-col gap-2">
              <p className="text-white/40 text-lg uppercase font-bold tracking-widest">Final Score</p>
              <p className="text-7xl font-black text-yellow-500 tabular-nums">{Math.floor(score).toLocaleString()}</p>
              <p className="text-white/40 text-sm italic">{distance.toLocaleString()} meters covered</p>
            </div>
            
            <button 
              onClick={onRestart}
              className="group relative inline-flex items-center justify-center w-full px-12 py-6 bg-white text-black font-black text-2xl rounded-[2rem] overflow-hidden transition-all hover:bg-yellow-500 hover:text-black hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                START NEW SESSION
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Brand Title */}
      <div className="absolute top-8 left-8 flex items-center gap-5 pointer-events-none">
        <div className="bg-red-600 w-14 h-14 rounded-2xl flex items-center justify-center -rotate-6 shadow-2xl border-b-4 border-red-800">
          <span className="text-white font-black text-3xl italic">N</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
            Nitro<span className="text-red-600">Sim</span>
          </h1>
          <span className="text-[10px] text-white/30 tracking-[0.5em] font-black uppercase mt-1">Arcade Edition</span>
        </div>
      </div>
    </>
  );
};

export default HUD;
