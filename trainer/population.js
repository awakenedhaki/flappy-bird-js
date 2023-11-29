/**
 * Represents a population of birds controlled by neural networks.
 * @class Population
 * @todo Create new generation onces all birds are culled.
 */
class Population {
  /**
   * Constructs a Population object.
   * @constructor
   * @param {number} size - The size of the population.
   * @param {NNBird[]} birds - The initial set of birds in the population (optional).
   */
  constructor(size, birds) {
    // Constants
    this.N_INPUT_NODES = 5;
    this.N_HIDDEN_NODES = 8;
    this.N_OUTPUT_NODES = 2;

    // Parameters
    this.size = size || 5;
    this.activeBirds = birds || this.initializePopulation();
    this.inactiveBirds = [];
  }

  /**
   * Initializes the population with a set of birds.
   * @method Population#initializePopulation
   * @returns {NNBird[]} - The array of initialized birds in the population.
   */
  initializePopulation() {
    const birds = [];
    for (let i = 0; i < this.size; i++) {
      birds[i] = new NNBird(
        this.N_INPUT_NODES,
        this.N_HIDDEN_NODES,
        this.N_OUTPUT_NODES
      );
    }
    return birds;
  }

  static proliferate(birds) {
    let weights = birds.map((bird) => {
      return bird.fitness;
    });

    let nextGeneration = [];
    for (let i = 0; i < birds.length; i++) {
      nextGeneration[i] = weightedRandomSelection(birds, weights).copy();
      nextGeneration[i].mutate(MUTATION_RATE);
    }

    return new Population(birds.length, nextGeneration);
  }

  /**
   * Calculates the fitness of each bird in the population.
   * @method Population#calculateFitness
   */
  calculateFitness() {
    let totalScore = 0;
    for (let i = 0; i < this.inactiveBirds.length; i++) {
      totalScore += this.inactiveBirds[i].score;
    }

    for (let i = 0; i < this.inactiveBirds.length; i++) {
      const bird = this.inactiveBirds[i];
      bird.fitness = bird.score / totalScore;
    }
  }

  /**
   * Moves a bird from active to inactive in the population.
   * @method Population#cull
   * @param {number} index - The index of the bird to be moved to the inactive list.
   */
  cull(index) {
    this.inactiveBirds.push(...this.activeBirds.splice(index, 1));
  }

  /**
   * Executes a provided callback function for each active bird in the population.
   * @method Population#forEach
   * @param {Function} callback - The callback function to be executed for each active bird.
   */
  forEach(callback) {
    this.activeBirds.forEach(callback);
  }

  /**
   * Makes predictions for each active bird in the population based on the given pipe.
   * @method Population#predict
   * @param {Pipe} pipe - The pipe object for inputs.
   */
  predict(pipe) {
    this.activeBirds.forEach((bird) => bird.predict(pipe));
  }

  /**
   * Disposes the neural network brains of inactive birds in the population.
   * @method Population#dispose
   */
  dispose() {
    this.inactiveBirds.forEach((bird) => bird.brain.dispose());
  }

  /**
   * Updates each active bird in the population.
   * @method Population#update
   */
  update() {
    this.activeBirds.forEach((bird) => bird.update());
  }

  /**
   * Displays each active bird in the population.
   * @method Population#show
   */
  show() {
    this.activeBirds.forEach((bird) => bird.show());
  }
}
