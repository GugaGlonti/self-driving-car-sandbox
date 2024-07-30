import Car from './Car.js';
import NeuralNetwork from './NeuralNetwork.js';

export default class IO {
  public static save(car: Car): void {
    const nn = car.getNeuralNetwork();
    localStorage.setItem('nn', JSON.stringify(nn));
  }

  public static discard(): void {
    localStorage.removeItem('nn');
  }
}
