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

  public copy(): NeuralNetwork {
    const nn = new NeuralNetwork([]);
    nn.layers = this.layers.map(layer => layer.copy());
    return nn;
  }

  public getLayers() {
    return this.layers;
  }

  public static mutate(nn: NeuralNetwork, mutationRate: number): void {
    nn.layers.forEach(layer => {
      layer.mutate(mutationRate);
    });
  }

  public setLayers(layers: NetworkLayer[]) {
    this.layers = layers;
  }

  public static fromJSON(json: string): NeuralNetwork {
    const obj = JSON.parse(json);
    const nn = new NeuralNetwork(obj.layers.length);
    nn.setLayers(
      obj.layers.map((layer: any) => {
        return NetworkLayer.fromJSON(layer);
      })
    );
    return nn;
  }
}
