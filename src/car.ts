import Controls from './controls.js';
import Sensor from './sensor.js';
import { ACCELERATION, DEFAULT_HEIGHT, DEFAULT_WIDTH, DEFAULT_X, DEFAULT_Y, FRICTION, REVERSE_SPEED, STEERING_FORCE, TOP_SPEED } from './utils/constants.js';

import { Controlable } from './utils/ControlPanel.js';
import { Line, Parameter, Polygon } from './utils/types.js';
import { polysIntersect } from './utils/utilFunctions.js';

export default class Car implements Controlable {
  private x: number;
  private y: number;
  private width: number;
  private height: number;

  private angle = 0;
  private steeringForce = STEERING_FORCE;
  private speed = 0;
  private topSpeed = TOP_SPEED;
  private reverseSpeed = REVERSE_SPEED;
  private acceleration = ACCELERATION;
  private friction = FRICTION;

  private controls: Controls;
  private sensor: Sensor = new Sensor(this);

  private polygon: Polygon = this.createPolygon();
  private damaged = false;

  // prettier-ignore
  constructor(
    x: number = DEFAULT_X,
    y: number = DEFAULT_Y,
    width: number = DEFAULT_WIDTH,
    height: number = DEFAULT_HEIGHT,
    isPlayer: boolean = false
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.controls = new Controls(isPlayer);
  }

  public getPosition() {
    return { x: this.x, y: this.y };
  }

  public getAngle() {
    return this.angle;
  }

  public update(borders: Line[]) {
    if (!this.damaged) {
      this.move();
    }

    this.polygon = this.createPolygon();
    this.damaged = this.assessDamage(borders);
    this.sensor.update(borders);
  }

  private assessDamage(borders: Line[]) {
    for (let i = 0; i < borders.length; i++) {
      if (polysIntersect(this.polygon, borders[i])) {
        return true;
      }
    }
    return false;
  }

  private createPolygon() {
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    const { x, y } = this.getPosition();
    let angle = this.getAngle();

    return [
      {
        x: x - Math.sin(angle - alpha) * rad,
        y: y - Math.cos(angle - alpha) * rad,
      },
      {
        x: x - Math.sin(angle + alpha) * rad,
        y: y - Math.cos(angle + alpha) * rad,
      },
      {
        x: x - Math.sin(angle + Math.PI - alpha) * rad,
        y: y - Math.cos(angle + Math.PI - alpha) * rad,
      },
      {
        x: x - Math.sin(angle + Math.PI + alpha) * rad,
        y: y - Math.cos(angle + Math.PI + alpha) * rad,
      },
    ];
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

    if (this.speed < 0) {
      if (this.controls.left) this.angle -= this.steeringForce;
      if (this.controls.right) this.angle += this.steeringForce;
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
    if (this.damaged) ctx.fillStyle = 'red';
    else ctx.fillStyle = 'white';

    try {
      ctx.beginPath();
      const { x, y } = this.polygon.pop()!;
      ctx.moveTo(x, y);
      this.polygon.forEach(point => ctx.lineTo(point.x, point.y));
      ctx.fill();
    } catch (error) {
      console.error('Error drawing car', error);
    }

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
        default: STEERING_FORCE,
      },
      {
        name: 'topSpeed',
        value: this.topSpeed,
        min: 0,
        max: 100,
        step: 0.2,
        default: TOP_SPEED,
      },
      {
        name: 'reverseSpeed',
        value: this.reverseSpeed,
        min: 0,
        max: 10,
        step: 0.1,
        default: REVERSE_SPEED,
      },
      {
        name: 'acceleration',
        value: this.acceleration,
        min: 0,
        max: 1,
        step: 0.001,
        default: ACCELERATION,
      },
      {
        name: 'friction',
        value: this.friction,
        min: 0,
        max: 1,
        step: 0.001,
        default: FRICTION,
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
