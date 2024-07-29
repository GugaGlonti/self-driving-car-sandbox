import NetworkLayer from './NetworkLayer.js';

export default class NeuralNetwork {
  private layers: NetworkLayer[] = [];

  constructor(neuronCounts: number[]) {
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.layers.push(new NetworkLayer(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  public feedForward(inputs: number[]) {
    let outputs = this.layers[0].feedForward(inputs);

    for (let i = 1; i < this.layers.length; i++) {
      outputs = this.layers[i].feedForward(outputs);
    }

    return outputs;
  }

  public getLayers() {
    return this.layers;
  }
}
