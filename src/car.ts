import Controls from './controls.js';

const CAR_DEFAULTS = { X: 100, Y: 100, WIDTH: 50, HEIGHT: 50, SPEED: 0, TOP_SPEED: 10, ACCELERATION: 0.1, FRICTION: 0.01 };

export default class Car {
  private x: number = CAR_DEFAULTS.X;
  private y: number = CAR_DEFAULTS.Y;
  private width: number = CAR_DEFAULTS.WIDTH;
  private height: number = CAR_DEFAULTS.HEIGHT;

  private speed: number = CAR_DEFAULTS.SPEED;
  private topSpeed: number = CAR_DEFAULTS.TOP_SPEED;
  private acceleration: number = CAR_DEFAULTS.ACCELERATION;
  private friction: number = CAR_DEFAULTS.FRICTION;

  private controls: Controls;

  constructor(controls: Controls) {
    this.controls = controls;
  }

  update() {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.fill();
  }
}
