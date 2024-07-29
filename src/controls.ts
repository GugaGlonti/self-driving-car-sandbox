import { DOWN, LEFT, RIGHT, UP } from './utils/constants.js';
import { ControlType } from './utils/types.js';

export default class Controls {
  public forward = false;
  public reverse = false;
  public left = false;
  public right = false;

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

  private addKeyListeners(): void {
    document.addEventListener('keydown', event => {
      switch (event.key) {
        case UP:
          this.forward = true;
          break;
        case DOWN:
          this.reverse = true;
          break;
        case LEFT:
          this.left = true;
          break;
        case RIGHT:
          this.right = true;
          break;
      }
    });

    document.addEventListener('keyup', event => {
      switch (event.key) {
        case UP:
          this.forward = false;
          break;
        case DOWN:
          this.reverse = false;
          break;
        case LEFT:
          this.left = false;
          break;
        case RIGHT:
          this.right = false;
          break;
      }
    });
  }
}
