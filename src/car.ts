import Controls from './controls.js';

import { ROAD_WIDTH } from './utils/constants.js';

export default class Car {
  private x = ROAD_WIDTH / 2;
  private y = 600;
  private width = 30;
  private height = 50;

  private angle = 0;
  private steeringForce = 0.03;
  private speed = 0;
  private topSpeed = 3;
  private reverseSpeed = 2;
  private acceleration = 0.035;
  private friction = 0.01;

  private controls: Controls;

  constructor(controls: Controls) {
    this.controls = controls;
  }

  public update() {
    this.move();
  }

  private move() {
    if (this.controls.forward) this.speed += this.acceleration;
    if (this.controls.reverse) this.speed -= this.acceleration;

    if (this.speed > this.topSpeed) this.speed = this.topSpeed;
    if (this.speed < -this.reverseSpeed) this.speed = -this.reverseSpeed;

    if (this.speed > 0) this.speed -= this.friction;
    if (this.speed < 0) this.speed += this.friction;

    if (Math.abs(this.speed) < this.friction) this.speed = 0;

    if (this.controls.left) this.angle += this.steeringForce * (this.speed / this.topSpeed);
    if (this.controls.right) this.angle -= this.steeringForce * (this.speed / this.topSpeed);

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.restore();
  }
}
