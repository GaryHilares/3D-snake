class InvalidRangeError {}

class ExclusiveRng {
  private low: number;
  private high: number;
  private excluded: number[];

  /**
   * @brief Creates a new ExclusiveRandomNumberGenerator.
   * @param low The lower bound of the range of integers to generate.
   * @param high The upper bound of the range of integers to generate.
   * @param excluded A list of integers.
   * @throws InvalidRangeError If any number in excluded is not in range.
   */
  constructor(low: number, high: number, excluded: number[]) {
    if (
      !(low <= high) ||
      excluded.some((num: number) => !(low <= num && num <= high))
    ) {
      throw new InvalidRangeError();
    }
    this.low = low;
    this.high = high;
    this.excluded = excluded.sort((a: number, b: number) => {
      return a - b;
    });
  }

  /**
   * @brief Generates a random integer in [low, high], except for excluded
   *        integers.
   * @return A uniformly random generated random integer in [low, high] which is
   *         not a excluded integer.
   * @throws InvalidRangeError if no number has probability of appearing.
   */
  generateRandomNumber(): number {
    const validNumberCount = this.high - this.low + 1 - this.excluded.length;
    /**
     * @invariant numberIdx is the number that would result if
     *            this.excluded[0..i] (right-exclusive) was
     *            considered.
     */
    let numberIdx = this.low + Math.floor(Math.random() * validNumberCount);
    for (let i = 0; i < this.excluded.length; i++) {
      if (this.excluded[i] <= numberIdx) {
        numberIdx++;
      }
    }
    if (numberIdx > this.high) {
      throw new InvalidRangeError();
    }
    return numberIdx;
  }

  /**
   * @brief Adds a new excluded integer.
   * @param newExcluded The new excluded integer to add.
   */
  public addExcluded(newExcluded: number): void {
    if (
      !(this.low <= newExcluded && newExcluded <= this.high) ||
      this.excluded.includes(newExcluded)
    ) {
      throw new InvalidRangeError();
    }
    this.excluded.push(newExcluded);
    for (let i = this.excluded.length - 2; i >= 0; i--) {
      if (this.excluded[i + 1] < this.excluded[i]) {
        const tmp = this.excluded[i];
        this.excluded[i] = this.excluded[i + 1];
        this.excluded[i + 1] = tmp;
      } else {
        break;
      }
    }
  }

  /**
   * @brief Replaces a excluded integer with a new one.
   * @param oldExcluded The excluded integer to replace.
   * @param newExcluded The new excluded integer.
   */
  public updateExcluded(oldExcluded: number, newExcluded: number): void {
    if (!(this.low <= newExcluded && newExcluded <= this.high)) {
      throw new InvalidRangeError();
    }
    let oldIdx = -1;
    for (let i = 0; i < this.excluded.length; i++) {
      if (this.excluded[i] === oldExcluded) {
        oldIdx = i;
      }
      if (this.excluded[i] === newExcluded) {
        throw new InvalidRangeError();
      }
    }
    if (oldIdx === -1) {
      throw new InvalidRangeError();
    }
    for (let i = oldIdx; i >= 1; i--) {
      this.excluded[i] = this.excluded[i - 1];
    }
    this.excluded[0] = newExcluded;
    for (let i = 1; i < this.excluded.length; i++) {
      if (this.excluded[i - 1] > this.excluded[i]) {
        const tmp = this.excluded[i];
        this.excluded[i] = this.excluded[i - 1];
        this.excluded[i - 1] = tmp;
      }
    }
  }
}

export { ExclusiveRng, InvalidRangeError };
