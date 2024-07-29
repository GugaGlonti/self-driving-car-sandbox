import { Controlable } from './ControlPanel.js';
import { DistancePoint, Parameter, Point, Polygon } from './types.js';

/**
 * Generate a linearly spaced array of numbers
 * @param a start
 * @param b end
 * @param n number of points
 * @returns array of n points linearly spaced between a and b
 */
export function linspace(a: number, b: number, n: number): number[] {
  const step = (b - a) / n;
  const result = [];
  for (let i = 0; i <= n; i++) {
    result.push(a + step * i);
  }
  return result;
}

/**
 * Linear interpolation
 * @param a start
 * @param b end
 * @param t interpolation factor
 * @returns interpolated value
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Draw a line on the canvas
 * @param ctx canvas context
 * @param start start point
 * @param end end point
 * @param color line color
 * @returns void
 */
export function drawLine(ctx: CanvasRenderingContext2D, start: Point, end: Point, color = 'white'): void {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

/**
 * Get the intersection point of two lines
 * @param A start of line 1
 * @param B end of line 1
 * @param C start of line 2
 * @param D end of line 2
 * @returns intersection point
 */
export function getIntersection(A: Point, B: Point, C: Point, D: Point): DistancePoint | undefined {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }
}

/**
 * Check if two polygons intersect
 * @param  poly1 first polygon
 * @param poly2 second polygon
 * @returns true if polygons intersect
 */
export function polysIntersect(P1: Polygon, P2: Polygon): boolean {
  for (let i = 0; i < P1.length; i++) {
    for (let j = 0; j < P2.length; j++) {
      // prettier-ignore
      if (getIntersection(
        P1[i],
        P1[(i + 1) % P1.length],
        P2[j],
        P2[(j + 1) % P2.length])
      ) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Calls a function for each pair of elements in two arrays
 * @param arr1 first array
 * @param arr2 second array
 * @param callback function to call
 * @returns void
 * @example
 * forEachOfBoth([1, 2], [3, 4], (a, b) => console.log(a + b));
 */
export function forEachOfBoth(arr1: any[], arr2: any[], callback: (a: any, b: any) => any) {
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      callback(arr1[i], arr2[j]);
    }
  }
}

/**
 * Maps a function to each pair of elements in two arrays
 * @param arr1 first array
 * @param arr2 second array
 * @param callback function to call
 * @returns array of results
 * @example
 * mapEachOfBoth([1, 2], [3, 4], (a, b) => a + b);
 */
export function mapEachOfBoth(arr1: any[], arr2: any[], callback: (a: any, b: any) => any) {
  const result = [];
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      result.push(callback(arr1[i], arr2[j]));
    }
  }
  return result;
}
