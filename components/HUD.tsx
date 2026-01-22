
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
        {/* Score Display */}
        <div className={`bg-black/80 backdrop-blur-xl border-2 transition-all duration-300 px-8 py-4 rounded-3xl shadow-2xl flex flex-col items-end transform scale-110 origin-right ${showBonus ? 'border-yellow-400 scale-125 shadow-yellow-500/50' : 'border-white/10'}`}>
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

      {/* Word Completion Bonus Overlay */}
      {showBonus && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40 bg-yellow-500/10 animate-pulse transition-opacity duration-300">
          <div className="bg-yellow-400 text-black px-16 py-8 rounded-[3rem] font-black text-7xl italic uppercase tracking-tighter shadow-[0_0_100px_rgba(255,215,0,1)] border-8 border-white animate-bounce">
            SCORE X2!
          </div>
          <div className="mt-8 text-white font-black text-3xl uppercase tracking-[0.5em] drop-shadow-2xl">
            Word Complete
          </div>
        </div>
      )}

      {/* Word Progress HUD */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
        <div className={`bg-black/70 backdrop-blur-lg border-b-4 transition-all duration-500 p-5 rounded-3xl shadow-2xl flex flex-col items-center min-w-[340px] ${isWordComplete ? 'border-yellow-400 scale-105 shadow-yellow-500/20' : 'border-white/10'}`}>
          <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-3">Target Word</div>
          <div className="flex gap-2">
            {targetWord.split('').map((char, i) => (
              <div 
                key={i}
                className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-black transition-all duration-300 ${
                  i < collectedLetters.length 
                  ? 'bg-yellow-400 border-yellow-200 text-black shadow-[0_0_20px_rgba(255,215,0,0.3)]' 
                  : 'bg-white/5 border-white/10 text-white/20'
                }`}
              >
                {char}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-800 p-12 rounded-[3rem] border-4 border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col items-center max-w-lg w-full">
            <h2 className="text-red-600 text-6xl font-black italic uppercase tracking-tighter mb-2">Crashed</h2>
            <div className="w-full h-1 bg-white/5 mb-8" />
            
            <div className="flex flex-col items-center gap-2 mb-10">
              <span className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold">Final Score</span>
              <span className="text-7xl font-black text-white">{Math.floor(score).toLocaleString()}</span>
            </div>

            <button 
              onClick={onRestart}
              className="bg-white text-black hover:bg-yellow-400 font-black px-12 py-5 rounded-2xl text-xl uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl pointer-events-auto"
            >
              Race Again
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Fixed: Added missing default export
export default HUD;
