
import React, { useState, useCallback } from 'react';
import Simulator from './components/Simulator';
import HUD from './components/HUD';

const App: React.FC = () => {
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

  const handleRestart = useCallback(() => {
    setRestartKey(prev => prev + 1);
    setIsGameOver(false);
    setSpeed(0);
    setDistance(0);
  }, []);

  const handleCollision = useCallback(() => {
    setIsGameOver(true);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-neutral-900 overflow-hidden select-none">
      <Simulator 
        key={restartKey}
        onSpeedChange={setSpeed} 
        onDistanceChange={setDistance}
        onCollision={handleCollision}
        isGameOver={isGameOver}
      />
      
      <HUD 
        speed={speed} 
        distance={distance}
        isGameOver={isGameOver} 
        onRestart={handleRestart} 
      />

      {!isGameOver && (
        <div className="absolute bottom-6 left-6 text-white/50 text-sm bg-black/40 p-4 rounded-lg backdrop-blur-sm pointer-events-none">
          <p>W / ↑ : Increase Speed</p>
          <p>S / ↓ : Brake</p>
          <p>A / D / ← / → : Change Lanes</p>
        </div>
      )}
    </div>
  );
};

export default App;
