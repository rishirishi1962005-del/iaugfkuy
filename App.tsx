
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Simulator from './components/Simulator';
import HUD from './components/HUD';
import { WORDS } from './constants';

const App: React.FC = () => {
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  
  const [targetWord, setTargetWord] = useState("");
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [showBonus, setShowBonus] = useState(false);

  const prevDistanceRef = useRef(0);

  const startNewRace = useCallback(() => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(word);
    setCollectedLetters([]);
    setRestartKey(prev => prev + 1);
    setIsGameOver(false);
    setSpeed(0);
    setDistance(0);
    setScore(0);
    prevDistanceRef.current = 0;
  }, []);

  useEffect(() => {
    startNewRace();
  }, [startNewRace]);

  const handleRestart = useCallback(() => {
    startNewRace();
  }, [startNewRace]);

  const handleCollision = useCallback(() => {
    setIsGameOver(true);
  }, []);

  const handleDistanceChange = useCallback((newDist: number) => {
    const delta = newDist - prevDistanceRef.current;
    if (delta > 0) {
      setScore(prev => prev + delta);
    }
    prevDistanceRef.current = newDist;
    setDistance(newDist);
  }, []);

  const handleLetterCollect = useCallback((letter: string) => {
    setCollectedLetters(prev => {
      const nextIndex = prev.length;
      if (nextIndex < targetWord.length && letter === targetWord[nextIndex]) {
        return [...prev, letter];
      }
      return prev;
    });
  }, [targetWord]);

  // Unified effect for word completion and cycling
  useEffect(() => {
    if (targetWord && collectedLetters.length === targetWord.length) {
      // 1. Reward the player: Double the score
      setScore(prev => prev * 2);
      
      // 2. Visual fanfare
      setShowBonus(true);
      
      // 3. Cycle to next word after a short celebration
      const cycleTimeout = setTimeout(() => {
        setShowBonus(false);
        const nextWordIndex = Math.floor(Math.random() * WORDS.length);
        setTargetWord(WORDS[nextWordIndex]);
        setCollectedLetters([]);
      }, 1500);

      return () => clearTimeout(cycleTimeout);
    }
  }, [collectedLetters, targetWord]);

  return (
    <div className="relative w-screen h-screen bg-neutral-900 overflow-hidden select-none">
      <Simulator 
        key={restartKey}
        targetWord={targetWord}
        collectedCount={collectedLetters.length}
        onSpeedChange={setSpeed} 
        onDistanceChange={handleDistanceChange}
        onCollision={handleCollision}
        onLetterCollect={handleLetterCollect}
        isGameOver={isGameOver}
      />
      
      <HUD 
        speed={speed} 
        distance={distance}
        score={score}
        isGameOver={isGameOver} 
        onRestart={handleRestart} 
        targetWord={targetWord}
        collectedLetters={collectedLetters}
        showBonus={showBonus}
      />

      {!isGameOver && (
        <div className="absolute bottom-6 left-6 text-white/50 text-sm bg-black/40 p-4 rounded-lg backdrop-blur-sm pointer-events-none">
          <p>W / ↑ : Increase Speed</p>
          <p>S / ↓ : Brake</p>
          <p>A / D / ← / → : Change Lanes</p>
          <div className="mt-2 text-yellow-400 font-bold uppercase tracking-tighter flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></span>
            Multiplier Ready: Double Score on Completion!
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
