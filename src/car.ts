import Controls from './controls.js';
import Sensor from './sensor.js';

import { Controlable } from './utils/ControlPanel.js';
import { Parameter, Point } from './utils/types.js';

export default class Car implements Controlable {
  private x = window.innerWidth / 2;
  private y = 600; // doesn't matter
  private width = 30;
  private height = 50;

  private angle = 0;
  private steeringForce = 0.03;
  private speed = 0;
  private topSpeed = 3;
  private reverseSpeed = 2;
  private acceleration = 0.035;
  private friction = 0.01;

  private correction = 0.2;
  private correctionThreshold = 0.01;

  private controls: Controls;
  private sensor = new Sensor(this);

  constructor(controls: Controls) {
    this.controls = controls;
  }

  public getPosition() {
    return { x: this.x, y: this.y };
  }

  public getAngle() {
    return this.angle;
  }

  public update(borders: [Point, Point][]) {
    this.move();
    this.sensor.update(borders);
    // this.straightenOut();
  }

  private straightenOut() {
    if (this.speed <= 1) {
      return;
    }

    const factor = this.speed / this.topSpeed;
    const totalCorrection = this.steeringForce * this.correction * factor;

    if (this.angle > 0) this.angle -= totalCorrection;
    if (this.angle < 0) this.angle += totalCorrection;

    if (Math.abs(this.angle) < this.correctionThreshold) this.angle = 0;
  }

  private move() {
    this.drive();
    this.turn();
    this.updatePosition();
    this.snapToAngle();
  }

  private updatePosition() {
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  private drive() {
    if (this.controls.forward) this.speed += this.acceleration;
    if (this.controls.reverse) this.speed -= this.acceleration;

    if (this.speed > this.topSpeed) this.speed = this.topSpeed;
    if (this.speed < -this.reverseSpeed) this.speed = -this.reverseSpeed;

    if (this.isNotMoving()) {
      if (this.speed > 0) this.speed -= this.friction;
      if (this.speed < 0) this.speed += this.friction;
    }
  }

  private turn() {
    if (this.isNotMoving()) {
      if (Math.abs(this.speed) < this.friction) this.speed = 0;
    }

    if (this.speed > 0) {
      if (this.controls.left) this.angle += this.steeringForce;
      if (this.controls.right) this.angle -= this.steeringForce;
    }

    if (this.angle > Math.PI) this.angle -= Math.PI * 2;
    if (this.angle < -Math.PI) this.angle += Math.PI * 2;
  }

  private snapToAngle() {
    if (this.isNotSteering()) {
      const snap = Math.PI / 18;
      const snapAngle = Math.round(this.angle / snap) * snap;
      this.angle += (snapAngle - this.angle) * this.steeringForce;
    }
  }

  private isNotSteering() {
    return !this.controls.left && !this.controls.right;
  }

  private isNotMoving() {
    return !this.controls.forward && !this.controls.reverse;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.restore();

    this.sensor.draw(ctx);
  }

  // CONTROL PANEL
  public getParameters(): Parameter[] {
    return [
      {
        name: 'steeringForce',
        value: this.steeringForce,
        min: 0,
        max: 0.1,
        step: 0.001,
        default: 0.03,
      },
      {
        name: 'topSpeed',
        value: this.topSpeed,
        min: 0,
        max: 100,
        step: 0.2,
        default: 3,
      },
      {
        name: 'reverseSpeed',
        value: this.reverseSpeed,
        min: 0,
        max: 10,
        step: 0.1,
        default: 2,
      },
      {
        name: 'acceleration',
        value: this.acceleration,
        min: 0,
        max: 1,
        step: 0.001,
        default: 0.035,
      },
      {
        name: 'friction',
        value: this.friction,
        min: 0,
        max: 1,
        step: 0.001,
        default: 0.01,
      },
      {
        name: 'correction',
        value: this.correction,
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.2,
      },
      {
        name: 'correctionThreshold',
        value: this.correctionThreshold,
        min: 0,
        max: 0.1,
        step: 0.001,
        default: 0.01,
      },
    ];
  }

  public setParameter(param: string, value: number) {
    // @ts-ignore
    this[param] = value;
  }

  public getParameter(param: string) {
    // @ts-ignore
    return this[param];
  }
}
