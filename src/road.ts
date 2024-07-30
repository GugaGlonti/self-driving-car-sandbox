import { drawLine, linspace } from './utils/utilFunctions.js';
import {
  INF,
  LANE_COUNT,
  ROAD_LEFT,
  ROAD_RIGHT,
  SHOULDER_WIDTH,
  VISIBLE_BORDERS,
} from './utils/constants.js';
import { Controlable } from './utils/ControlPanel.js';
import { Colidable, Line, Parameter } from './utils/types.js';

export default class Road implements Controlable, Colidable {
  private left = ROAD_LEFT;
  private right = ROAD_RIGHT;
  private shoulderWidth = SHOULDER_WIDTH;

  private top = -INF;
  private bottom = INF;

  private visibleBorders = false;

  private laneCount: number;

  private topleft = { x: this.left, y: this.top };
  private topright = { x: this.right, y: this.top };
  private bottomleft = { x: this.left, y: this.bottom };
  private bottomright = { x: this.right, y: this.bottom };

  private borders: Line[] = [
    [this.topleft, this.bottomleft],
    [this.topright, this.bottomright],
  ];

  constructor(laneCount = LANE_COUNT) {
    this.laneCount = laneCount;
  }
  public getHitbox(): Line[] {
    return this.borders;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'gray';
    ctx.fillRect(
      this.left - this.shoulderWidth,
      this.top,
      this.right - this.left + this.shoulderWidth * 2,
      this.bottom - this.top,
    );

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;

    linspace(this.left, this.right, this.laneCount).forEach((x, i) => {
      this.chooseLine(ctx, i);
      drawLine(ctx, { x, y: this.top }, { x, y: this.bottom });
    });

    if (this.visibleBorders) {
      this.borders.forEach(([start, end]) => {
        drawLine(ctx, start, end, 'red');
      });
    }
  }

  private updateBorders(): void {
    this.topleft = { x: this.left, y: this.top };
    this.topright = { x: this.right, y: this.top };
    this.bottomleft = { x: this.left, y: this.bottom };
    this.bottomright = { x: this.right, y: this.bottom };

    this.borders = [
      [this.topleft, this.bottomleft],
      [this.topright, this.bottomright],
    ];
  }

  public getLaneCenter(lane: number): number {
    return (
      linspace(this.left, this.right, this.laneCount)[lane % this.laneCount] +
      (this.right - this.left) / (2 * this.laneCount)
    );
  }

  public getLaneCount(): number {
    return this.laneCount;
  }

  private chooseLine(ctx: CanvasRenderingContext2D, i: number): void {
    if (i === 0 || i === this.laneCount) {
      ctx.setLineDash([]);
    } else {
      ctx.setLineDash([45, 75]);
    }
  }

  // CONTROL PANEL
  public getParameters(): Parameter[] {
    return [
      {
        name: 'left',
        value: this.left,
        min: 0,
        max: window.innerWidth,
        step: 10,
        default: ROAD_LEFT,
      },
      {
        name: 'right',
        value: this.right,
        min: 0,
        max: window.innerWidth,
        step: 10,
        default: ROAD_RIGHT,
      },
      {
        name: 'laneCount',
        value: this.laneCount,
        min: 1,
        max: 10,
        step: 1,
        default: LANE_COUNT,
      },
      {
        name: 'visibleBorders',
        value: this.visibleBorders ? 1 : 0,
        min: 0,
        max: 1,
        step: 1,
        default: VISIBLE_BORDERS,
      },
    ];
  }

  public setParameter(param: string, value: number): void {
    if (param === 'left' || param === 'right') {
      const timeout = setTimeout(() => {
        this.updateBorders();
        clearTimeout(timeout);
      }, 10);
    }

    // @ts-ignore
    this[param] = value;
  }

  public getParameter(param: string): any {
    // @ts-ignore
    return this[param];
  }
}
