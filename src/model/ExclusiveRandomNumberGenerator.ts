class InvalidRangeError extends Error {}

/**
 * @brief Represents a random integer generator.
 */
interface IRandomIntegerGenerator {
  /**
   * @brief Generates a random integer up to given integer, exclusive.
   * @param low Lower bound on the number to be generated.
   * @param high Upper bound on the number to be generated.
   * @returns A random integer in the range [low, high].
   */
  generateInt(high: number): number;
}

/**
 * Random integer generator that uses a uniform distribution.
 */
class RandomIntegerGenerator implements IRandomIntegerGenerator {
  /**
   * @brief Generates a random integer up to given number, exclusive, following
   *        a uniform distribution.
   * @param high Upper bound on the number to be generated (exclusive).
   * @return A random integer in the range [0, high[.
   */
  public generateInt(high: number): number {
    return Math.floor(Math.random() * high);
  }
}

class ExclusiveRng {
  private low: number;
  private high: number;
  private excluded: number[];
  private generator: IRandomIntegerGenerator;

  /**
   * @brief Creates a new ExclusiveRandomNumberGenerator.
   * @param low The lower bound of the range of integers to generate.
   * @param high The upper bound of the range of integers to generate.
   * @param excluded A list of integers.
   * @throws InvalidRangeError If any number in excluded is not in range.
   */
  constructor(
    low: number,
    high: number,
    excluded: number[],
    generator: IRandomIntegerGenerator = new RandomIntegerGenerator()
  ) {
    if (
      !(low <= high) ||
      excluded.some((num: number) => !(low <= num && num <= high))
    ) {
      throw new InvalidRangeError();
    }
    this.low = low;
    this.high = high;
    this.excluded = excluded.sort((a: number, b: number) => a - b);
    this.generator = generator;
  }

  /**
   * @brief Generates a random integer in [low, high], except for excluded
   *        integers.
   * @return A uniformly random generated random integer in [low, high] which is
   *         not a excluded integer.
   * @throws InvalidRangeError if no number has probability of appearing.
   */
  generateRandomNumber(): number {
    /**
     * @invariant numberIdx is the number that would result if
     *            this.excluded[0..i] (right-exclusive) was
     *            considered.
     */
    const validNumberTotal = this.high - this.low + 1 - this.excluded.length;
    let numberIdx = this.generator.generateInt(validNumberTotal) + this.low;
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
   * @param newExcluded The new excluded integer to add. Must not be already
   *        excluded and must be within the valid range.
   * @throws InvalidRangeError if given integer is already excluded or outside
   *         the valid range.
   */
  public addExcluded(newExcluded: number): void {
    if (
      !(this.low <= newExcluded && newExcluded <= this.high) ||
      this.excluded.includes(newExcluded)
    ) {
      throw new InvalidRangeError();
    }
    /**
     * @invariant this.excluded[..i-1] is sorted.
     * @invariant this.excluded[i..] is sorted.
     * @invariant this.excluded[i+1] is greater than all of
     *            this.excluded[..i-1].
     */
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
   * @param oldExcluded The excluded integer to replace. Must be excluded.
   * @param newExcluded The new excluded integer. Must not be excluded yet
   *        and must be inside the valid range.
   * @throws InvalidRangeError if new excluded integer is already excluded (and
   *         it is not the integer to be removed) or outside the valid range,
   *         or if old excluded integer was not actually excluded.
   */
  public updateExcluded(oldExcluded: number, newExcluded: number): void {
    if (!(this.low <= newExcluded && newExcluded <= this.high)) {
      throw new InvalidRangeError();
    }
    if (oldExcluded == newExcluded) {
      return;
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

export {
  ExclusiveRng,
  InvalidRangeError,
  IRandomIntegerGenerator,
  RandomIntegerGenerator,
};
