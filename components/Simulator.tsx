
import React, { useEffect, useRef } from 'react';
import { PHYSICS, COLORS, ROAD_WIDTH, LANES } from '../constants';
import { CarState, Keys, Enemy, CollectibleLetter } from '../types';

interface SimulatorProps {
  onSpeedChange: (speed: number) => void;
  onDistanceChange: (dist: number) => void;
  onCollision: () => void;
  onLetterCollect: (letter: string) => void;
  isGameOver: boolean;
  targetWord: string;
  collectedCount: number;
}

const Simulator: React.FC<SimulatorProps> = ({ 
  onSpeedChange, 
  onDistanceChange,
  onCollision, 
  onLetterCollect,
  isGameOver,
  targetWord,
  collectedCount
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const carRef = useRef<CarState>({
    x: 0,
    y: 0,
    angle: 0,
    speed: PHYSICS.MIN_SPEED,
    width: 45,
    height: 80,
  });

  const enemiesRef = useRef<Enemy[]>([]);
  const lettersRef = useRef<CollectibleLetter[]>([]);
  const roadOffsetRef = useRef(0);
  const distanceRef = useRef(0);
  const shakeTimerRef = useRef(0);
  const nextIdRef = useRef(0);
  const lastSpawnDistanceRef = useRef(0);
  const lastLetterSpawnDistanceRef = useRef(0);

  const keysRef = useRef<Keys>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      switch (e.key) {
        case 'w': case 'ArrowUp': keysRef.current.forward = true; break;
        case 's': case 'ArrowDown': keysRef.current.backward = true; break;
        case 'a': case 'ArrowLeft': keysRef.current.left = true; break;
        case 'd': case 'ArrowRight': keysRef.current.right = true; break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'w': case 'ArrowUp': keysRef.current.forward = false; break;
        case 's': case 'ArrowDown': keysRef.current.backward = false; break;
        case 'a': case 'ArrowLeft': keysRef.current.left = false; break;
        case 'd': case 'ArrowRight': keysRef.current.right = false; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isGameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      carRef.current.y = canvas.height * 0.75;
      carRef.current.x = canvas.width / 2;
    };
    window.addEventListener('resize', resize);
    resize();

    const spawnEnemyWave = () => {
      const currentDist = distanceRef.current;
      const spawnCooldown = 120; 
      
      if (currentDist - lastSpawnDistanceRef.current < spawnCooldown) return;
      
      if (Math.random() < 0.15) {
        lastSpawnDistanceRef.current = currentDist;
        
        const laneWidth = ROAD_WIDTH / LANES;
        const roadLeft = canvas.width / 2 - ROAD_WIDTH / 2;
        
        const rand = Math.random();
        let patternCount = 1;
        if (rand > 0.6) patternCount = 2;
        if (rand > 0.9 && currentDist > 1000) patternCount = 3;

        const availableLanes = Array.from({ length: LANES }, (_, i) => i);
        for (let i = availableLanes.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [availableLanes[i], availableLanes[j]] = [availableLanes[j], availableLanes[i]];
        }

        const selectedLanes = availableLanes.slice(0, patternCount);

        selectedLanes.forEach(laneIndex => {
          const x = roadLeft + (laneIndex * laneWidth) + laneWidth / 2;
          const isOverlap = enemiesRef.current.some(e => 
            e.y < 150 && Math.abs(e.x - x) < 10
          ) || lettersRef.current.some(l => 
            l.y < 150 && Math.abs(l.x - x) < 10
          );

          if (!isOverlap) {
            const speed = PHYSICS.ENEMY_MIN_SPEED + Math.random() * (PHYSICS.ENEMY_MAX_SPEED - PHYSICS.ENEMY_MIN_SPEED);
            enemiesRef.current.push({
              id: nextIdRef.current++,
              x,
              y: -150,
              speed,
              width: 45,
              height: 80,
              color: COLORS.ENEMIES[Math.floor(Math.random() * COLORS.ENEMIES.length)]
            });
          }
        });
      }
    };

    const spawnLetter = () => {
      const currentDist = distanceRef.current;
      const spawnCooldown = 80;
      
      if (currentDist - lastLetterSpawnDistanceRef.current < spawnCooldown) return;

      if (Math.random() < PHYSICS.LETTER_SPAWN_CHANCE) {
        lastLetterSpawnDistanceRef.current = currentDist;
        
        const laneWidth = ROAD_WIDTH / LANES;
        const roadLeft = canvas.width / 2 - ROAD_WIDTH / 2;
        const laneIndex = Math.floor(Math.random() * LANES);
        const x = roadLeft + (laneIndex * laneWidth) + laneWidth / 2;

        const isOverlap = enemiesRef.current.some(e => 
          e.y < 150 && Math.abs(e.x - x) < 50
        ) || lettersRef.current.some(l => 
          l.y < 150 && Math.abs(l.x - x) < 10
        );

        if (!isOverlap) {
          // 80% chance for the next required letter, 20% for a random one
          let letterToSpawn = "";
          if (Math.random() < 0.8 && collectedCount < targetWord.length) {
            letterToSpawn = targetWord[collectedCount];
          } else {
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            letterToSpawn = alphabet[Math.floor(Math.random() * alphabet.length)];
          }

          lettersRef.current.push({
            id: nextIdRef.current++,
            x,
            y: -150,
            letter: letterToSpawn,
            size: 40
          });
        }
      }
    };

    const checkCollision = (car: CarState, obj: { x: number, y: number, width?: number, height?: number, size?: number }) => {
      const px = 8;
      const py = 12;
      const objWidth = obj.width || obj.size || 0;
      const objHeight = obj.height || obj.size || 0;
      
      return (
        car.x - car.width / 2 + px < obj.x + objWidth / 2 - px &&
        car.x + car.width / 2 - px > obj.x - objWidth / 2 + px &&
        car.y - car.height / 2 + py < obj.y + objHeight / 2 - py &&
        car.y + car.height / 2 - py > obj.y - objHeight / 2 + py
      );
    };

    const update = () => {
      if (isGameOver) return;

      const car = carRef.current;
      const keys = keysRef.current;

      if (keys.forward) car.speed += PHYSICS.ACCELERATION;
      if (keys.backward) car.speed -= PHYSICS.BRAKE;
      
      car.speed -= PHYSICS.FRICTION;
      if (car.speed < PHYSICS.MIN_SPEED) car.speed = PHYSICS.MIN_SPEED;
      if (car.speed > PHYSICS.MAX_SPEED) car.speed = PHYSICS.MAX_SPEED;

      let targetAngle = 0;
      if (keys.left) {
        car.x -= PHYSICS.LATERAL_SPEED;
        targetAngle = -PHYSICS.TILT_ANGLE;
      }
      if (keys.right) {
        car.x += PHYSICS.LATERAL_SPEED;
        targetAngle = PHYSICS.TILT_ANGLE;
      }
      
      car.angle += (targetAngle - car.angle) * 0.25;

      const roadLeft = canvas.width / 2 - ROAD_WIDTH / 2;
      const roadRight = canvas.width / 2 + ROAD_WIDTH / 2;
      if (car.x - car.width / 2 < roadLeft) car.x = roadLeft + car.width / 2;
      if (car.x + car.width / 2 > roadRight) car.x = roadRight - car.width / 2;

      roadOffsetRef.current = (roadOffsetRef.current + car.speed) % 100;
      distanceRef.current += car.speed / 10;

      // Update Enemies
      enemiesRef.current.forEach(enemy => {
        enemy.y += (car.speed - enemy.speed);
        if (checkCollision(car, enemy)) {
          shakeTimerRef.current = 25;
          onCollision();
        }
      });
      enemiesRef.current = enemiesRef.current.filter(e => e.y < canvas.height + 200 && e.y > -1000);

      // Update Letters
      lettersRef.current.forEach(letter => {
        letter.y += (car.speed - 2); // Letters move slightly slower than minimum road speed
        if (checkCollision(car, letter)) {
          onLetterCollect(letter.letter);
          letter.y = canvas.height + 500; // Instantly remove
        }
      });
      lettersRef.current = lettersRef.current.filter(l => l.y < canvas.height + 200 && l.y > -1000);

      spawnEnemyWave();
      spawnLetter();
      
      onSpeedChange(Math.round(car.speed * 12));
      onDistanceChange(Math.floor(distanceRef.current));
    };

    const drawLetter = (letter: CollectibleLetter) => {
      ctx.save();
      ctx.translate(letter.x, letter.y);
      
      // Outer glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = COLORS.LETTER_BG;
      
      // Circle background
      ctx.fillStyle = COLORS.LETTER_BG;
      ctx.beginPath();
      ctx.arc(0, 0, letter.size / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Letter text
      ctx.shadowBlur = 0;
      ctx.fillStyle = COLORS.LETTER_TEXT;
      ctx.font = `bold ${letter.size * 0.7}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(letter.letter, 0, 0);
      
      ctx.restore();
    };

    const drawCar = (x: number, y: number, angle: number, width: number, height: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.roundRect(-width/2 + 6, -height/2 + 6, width, height, 8);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(-width/2, -height/2, width, height, 10);
      ctx.fill();
      ctx.fillStyle = COLORS.CAR_DETAIL;
      ctx.beginPath();
      ctx.roundRect(-width/2 + 6, -height/2 + 18, width - 12, 22, 4);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(-width/2 + 8, height/2 - 22, width - 16, 12, 2);
      ctx.fill();
      ctx.fillStyle = '#fffde7'; 
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fffde7';
      ctx.fillRect(-width/2 + 5, -height/2 + 2, 10, 5);
      ctx.fillRect(width/2 - 15, -height/2 + 2, 10, 5);
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#f44336';
      ctx.fillStyle = '#f44336';
      ctx.fillRect(-width/2 + 5, height/2 - 7, 10, 5);
      ctx.fillRect(width/2 - 15, height/2 - 7, 10, 5);
      ctx.shadowBlur = 0;
      ctx.restore();
    };

    const render = () => {
      ctx.save();
      if (shakeTimerRef.current > 0) {
        ctx.translate((Math.random() - 0.5) * 25, (Math.random() - 0.5) * 25);
        shakeTimerRef.current--;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = COLORS.GRASS;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const roadLeft = canvas.width / 2 - ROAD_WIDTH / 2;
      ctx.fillStyle = '#444';
      ctx.fillRect(roadLeft - 20, 0, ROAD_WIDTH + 40, canvas.height);
      ctx.fillStyle = COLORS.ROAD;
      ctx.fillRect(roadLeft, 0, ROAD_WIDTH, canvas.height);
      ctx.strokeStyle = COLORS.LINE;
      ctx.lineWidth = 4;
      ctx.setLineDash([45, 55]);
      ctx.lineDashOffset = -roadOffsetRef.current * 2.5;
      const laneWidth = ROAD_WIDTH / LANES;
      for (let i = 1; i < LANES; i++) {
        ctx.beginPath();
        ctx.moveTo(roadLeft + i * laneWidth, 0);
        ctx.lineTo(roadLeft + i * laneWidth, canvas.height);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(roadLeft, 0);
      ctx.lineTo(roadLeft, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(roadLeft + ROAD_WIDTH, 0);
      ctx.lineTo(roadLeft + ROAD_WIDTH, canvas.height);
      ctx.stroke();

      // Render Collectibles
      lettersRef.current.forEach(drawLetter);

      // Render Vehicles
      enemiesRef.current.forEach(enemy => {
        drawCar(enemy.x, enemy.y, 0, enemy.width, enemy.height, isGameOver ? '#222' : enemy.color);
      });

      const p = carRef.current;
      drawCar(p.x, p.y, p.angle, p.width, p.height, isGameOver ? '#333' : COLORS.PLAYER);

      if (isGameOver && shakeTimerRef.current > 5) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.restore();
    };

    let frameId: number;
    const loop = () => {
      update();
      render();
      frameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [onSpeedChange, onDistanceChange, onCollision, onLetterCollect, isGameOver, targetWord, collectedCount]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default Simulator;
