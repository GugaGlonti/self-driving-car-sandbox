const canvas = document.getElementById('canvas')! as HTMLCanvasElement;

// MATH
export const INF = 1e6;

// NEURAL NETWORK
export const HIDDEN_LAYERS = [6];

// CONTROLS
export const UP = 'ArrowUp';
export const DOWN = 'ArrowDown';
export const LEFT = 'ArrowLeft';
export const RIGHT = 'ArrowRight';

// CAR
export const DEFAULT_X = canvas.width / 2;
export const DEFAULT_Y = canvas.height / 2;
export const DEFAULT_WIDTH = 30;
export const DEFAULT_HEIGHT = 50;

export const STEERING_FORCE = 0.03;
export const TOP_SPEED = 3;
export const REVERSE_SPEED = 2;
export const ACCELERATION = 0.035;
export const FRICTION = 0.01;

// CPU CAR
export const CPU_TOP_SPEED = 2;

// CAMERA
export const UPPER_BOUND = 0.2;
export const LOWER_BOUND = 0.8;

// SENSOR
export const RAY_COUNT = 10;
export const RAY_LENGTH = 300;
export const RAY_SPREAD = Math.PI / 2;

// ROAD
export const ROAD_CENTER = canvas.width / 2;
export const ROAD_WIDTH = 600;
export const SHOULDER_WIDTH = 20;
export const ROAD_LEFT = ROAD_CENTER - ROAD_WIDTH / 2;
export const ROAD_RIGHT = ROAD_CENTER + ROAD_WIDTH / 2;
export const LANE_COUNT = 9;
export const VISIBLE_BORDERS = 0;
