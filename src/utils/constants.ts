// MATH
export const INF = 1e6;

// CONTROLS
export const UP = 'ArrowUp';
export const DOWN = 'ArrowDown';
export const LEFT = 'ArrowLeft';
export const RIGHT = 'ArrowRight';

// CAR
export const DEFAULT_X = window.innerWidth / 2;
export const DEFAULT_Y = 600;
export const DEFAULT_WIDTH = 30;
export const DEFAULT_HEIGHT = 50;

export const STEERING_FORCE = 0.03;
export const TOP_SPEED = 3;
export const REVERSE_SPEED = 2;
export const ACCELERATION = 0.035;
export const FRICTION = 0.01;

// CAMERA
export const UPPER_BOUND = 0.2;
export const LOWER_BOUND = 0.8;

// SENSOR
export const RAY_COUNT = 3;
export const RAY_LENGTH = 100;
export const RAY_SPREAD = Math.PI / 4;

// ROAD
export const ROAD_CENTER = window.innerWidth / 2;
export const ROAD_WIDTH = 200;
export const SHOULDER_WIDTH = 10;
export const ROAD_LEFT = ROAD_CENTER - ROAD_WIDTH / 2 - SHOULDER_WIDTH;
export const ROAD_RIGHT = ROAD_CENTER + ROAD_WIDTH / 2 + SHOULDER_WIDTH;
export const LANE_COUNT = 3;
export const VISIBLE_BORDERS = 0;
