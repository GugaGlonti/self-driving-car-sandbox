import Controls from './Controls.js';
import NeuralNetwork from './NeuralNetwork.js';
import Sensor from './Sensor.js';
import { ACCELERATION, CPU_TOP_SPEED, DEFAULT_HEIGHT, DEFAULT_WIDTH, DEFAULT_X, DEFAULT_Y, FRICTION, REVERSE_SPEED, STEERING_FORCE, TOP_SPEED } from './utils/constants.js';

import { Controlable } from './utils/ControlPanel.js';
import { Colidable, ControlType, Line, Parameter, Point, Polygon } from './utils/types.js';
import { polysIntersect } from './utils/utilFunctions.js';

export default class Car implements Controlable, Colidable {
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

  private polygon: Polygon = this.createPolygon();
  private damaged = false;

  private controls: Controls;
  private sensor: Sensor | undefined;
  private neuralNetwork: NeuralNetwork | undefined;

  // prettier-ignore
  constructor(
    x: number = DEFAULT_X,
    y: number = DEFAULT_Y,
    width: number = DEFAULT_WIDTH,
    height: number = DEFAULT_HEIGHT,
    controlType: ControlType = "CPU"
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.controls = new Controls(controlType);

    switch (controlType) {
      case 'AI':
        this.sensor = new Sensor(this);
        this.neuralNetwork = new NeuralNetwork([
          this.sensor.getRayCount(),
          6,
          4
        ])
      case 'Player':
        this.sensor = new Sensor(this);
        break;
      case 'CPU':
        this.sensor = undefined;
        this.topSpeed = CPU_TOP_SPEED;
        this.y = -100;
        break;
    }
  }

  public update(...hitbox: Line[]): void {
    if (!this.damaged) {
      this.move();
    }

    this.polygon = this.createPolygon();
    this.damaged = this.assessDamage(hitbox);

    if (this.sensor && this.neuralNetwork) {
      this.sensor.update(hitbox);
      const outputs = this.neuralNetwork.feedForward(this.sensor.getReadings());
      this.controls.setControls(outputs);
      console.log(outputs);
    }
  }

  private assessDamage(hitbox: Line[]): boolean {
    if (this.damaged) {
      return true;
    }

    for (let i = 0; i < hitbox.length; i++) {
      if (polysIntersect(this.polygon, hitbox[i])) {
        return true;
      }
    }
    return false;
  }

  private createPolygon(): Polygon {
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

  private polygonToLines(polygon: Polygon): Line[] {
    return polygon.map((point, i) => {
      return [point, polygon[(i + 1) % polygon.length]];
    }) as Line[];
  }

  private move(): void {
    this.drive();
    this.turn();
    this.updatePosition();
    this.snapToAngle();
  }

  private updatePosition(): void {
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  private drive(): void {
    if (this.controls.forward) this.speed += this.acceleration;
    if (this.controls.reverse) this.speed -= this.acceleration;

    if (this.speed > this.topSpeed) this.speed = this.topSpeed;
    if (this.speed < -this.reverseSpeed) this.speed = -this.reverseSpeed;

    if (this.isNotMoving()) {
      if (this.speed > 0) this.speed -= this.friction;
      if (this.speed < 0) this.speed += this.friction;
    }
  }

  private turn(): void {
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

  private snapToAngle(): void {
    if (this.isNotSteering()) {
      const snap = Math.PI / 18;
      const snapAngle = Math.round(this.angle / snap) * snap;
      this.angle += (snapAngle - this.angle) * this.steeringForce;
    }
  }

  private isNotSteering(): boolean {
    return !this.controls.left && !this.controls.right;
  }

  private isNotMoving(): boolean {
    return !this.controls.forward && !this.controls.reverse;
  }

  public getPosition(): Point {
    return { x: this.x, y: this.y };
  }

  public getAngle(): number {
    return this.angle;
  }

  public getHitbox(): Line[] {
    return this.polygonToLines(this.polygon);
  }

  public draw(ctx: CanvasRenderingContext2D): void {
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

    if (this.sensor) {
      this.sensor.draw(ctx);
    }
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

  public setParameter(param: string, value: number): void {
    // @ts-ignore
    this[param] = value;
  }

  public getParameter(param: string): any {
    // @ts-ignore
    return this[param];
  }
}
