
export interface CarState {
  x: number;
  y: number;
  angle: number;
  speed: number;
  width: number;
  height: number;
}

export interface Enemy {
  id: number;
  x: number;
  y: number;
  speed: number;
  width: number;
  height: number;
  color: string;
}

export interface CollectibleLetter {
  id: number;
  x: number;
  y: number;
  letter: string;
  size: number;
}

export interface Keys {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

export interface Point {
  x: number;
  y: number;
}
