import { DOWN, LEFT, RIGHT, UP } from './utils/constants.js';
import { ControlType } from './utils/types.js';

export default class Controls {
  public forward = false;
  public left = false;
  public right = false;
  public reverse = false;

  constructor(controlType: ControlType) {
    switch (controlType) {
      case 'Player':
        this.addKeyListeners();
        break;
      case 'CPU':
        this.forward = true;
        break;
      case 'AI':
        break;
    }
  }

  public setControls(controls: number[]) {
    [this.forward, this.left, this.right, this.reverse] = controls.map(c => (!!c ? true : false));
  }

  private addKeyListeners(): void {
    document.addEventListener('keydown', event => {
      switch (event.key) {
        case UP:
          this.forward = true;
          break;
        case LEFT:
          this.left = true;
          break;
        case RIGHT:
          this.right = true;
          break;
        case DOWN:
          this.reverse = true;
          break;
      }
    });

    document.addEventListener('keyup', event => {
      switch (event.key) {
        case UP:
          this.forward = false;
          break;
        case LEFT:
          this.left = false;
          break;
        case RIGHT:
          this.right = false;
          break;
        case DOWN:
          this.reverse = false;
          break;
      }
    });
  }
}
