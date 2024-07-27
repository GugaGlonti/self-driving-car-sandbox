export type Point = { x: number; y: number };

export type Ray = [Point, Point];

export type Parameter = {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  default: number;
};
