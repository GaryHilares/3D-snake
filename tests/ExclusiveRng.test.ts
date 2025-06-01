import { describe } from "@jest/globals";
import {
  ExclusiveRng,
  InvalidRangeError,
  IRandomIntegerGenerator,
  RandomIntegerGenerator,
} from "../src/model/ExclusiveRandomNumberGenerator";

class FakeRandomIntegerGenerator implements IRandomIntegerGenerator {
  private nextInteger: number;

  /**
   * @brief Creates a new instance that generates number of the given list,
   *        treating the list as a cycle.
   * @param numberList List of numbers to generate. Must be non-empty.
   * @throws Error if list is empty.
   */
  public constructor() {
    this.nextInteger = 0;
  }

  /**
   * @brief Generates the next integer in the cycle [0, high[.
   * @param high Higher bound on the integer to generate (exclusive).
   * @param A "random" (actually not random) integer in the range [0, high].
   */
  public generateInt(high: number): number {
    if (this.nextInteger >= high) {
      this.nextInteger = 0;
    }
    return this.nextInteger++;
  }
}

describe("RandomIntegerGenerator", () => {
  describe("generateInt", () => {
    it("should only produce numbers in range", () => {
      const tries = 10;
      const upperBound = 1;
      const generator = new RandomIntegerGenerator();
      for (let i = 0; i < tries; i++) {
        const generatedInteger = generator.generateInt(upperBound);
        expect(generatedInteger).toBeLessThan(upperBound);
      }
    });
  });
});

describe("ExclusiveRng", () => {
  describe("generateRandomNumber", () => {
    it("should be able to generate all integers if none excluded", () => {
      const low = 3;
      const high = 5;
      const fakeGenerator = new FakeRandomIntegerGenerator();
      const exclusiveRng = new ExclusiveRng(low, high, [], fakeGenerator);
      const generatedIntegers: number[] = [];
      const tries = high - low + 1;
      for (let i = 0; i < tries; i++) {
        generatedIntegers.push(exclusiveRng.generateRandomNumber());
      }
      expect(generatedIntegers).toContain(3);
      expect(generatedIntegers).toContain(4);
      expect(generatedIntegers).toContain(5);
    });

    it("should not generate integers outside range", () => {
      const low = 3;
      const high = 5;
      const fakeGenerator = new FakeRandomIntegerGenerator();
      const exclusiveRng = new ExclusiveRng(low, high, [], fakeGenerator);
      const generatedIntegers: number[] = [];
      const tries = high - low + 1;
      for (let i = 0; i < tries; i++) {
        generatedIntegers.push(exclusiveRng.generateRandomNumber());
      }
      for (const element of generatedIntegers) {
        expect([3, 4, 5]).toContain(element);
      }
    });

    it("should not generate excluded integers inside range", () => {
      const low = 3;
      const high = 7;
      const fakeGenerator = new FakeRandomIntegerGenerator();
      const exclusiveRng = new ExclusiveRng(
        low,
        high,
        [3, 5, 7],
        fakeGenerator
      );
      const generatedIntegers: number[] = [];
      const tries = high - low + 1;
      for (let i = 0; i < tries; i++) {
        generatedIntegers.push(exclusiveRng.generateRandomNumber());
      }
      for (const element of generatedIntegers) {
        expect([4, 6]).toContain(element);
      }
    });

    it("should throw if excluded number outside range", () => {
      const low = 3;
      const high = 6;
      const fakeGenerator = new FakeRandomIntegerGenerator();
      expect(() => {
        new ExclusiveRng(low, high, [3, 5, 7], fakeGenerator);
      }).toThrow(InvalidRangeError);
    });

    it("should throw if no numbers to generate", () => {
      const low = 3;
      const high = 5;
      const fakeGenerator = new FakeRandomIntegerGenerator();
      const exclusiveRng = new ExclusiveRng(
        low,
        high,
        [3, 4, 5],
        fakeGenerator
      );
      expect(() => {
        exclusiveRng.generateRandomNumber();
      }).toThrow(InvalidRangeError);
    });
  });

  describe("addExcluded", () => {
    it("should not produce just added excluded integer", () => {
      const low = 4;
      const high = 6;
      const fakeGenerator = new FakeRandomIntegerGenerator();
      const exclusiveRng = new ExclusiveRng(low, high, [], fakeGenerator);
      const generatedIntegers: number[] = [];
      const tries = high - low + 1;
      exclusiveRng.addExcluded(5);
      for (let i = 0; i < tries; i++) {
        generatedIntegers.push(exclusiveRng.generateRandomNumber());
      }
      expect(generatedIntegers).not.toContain(5);
    });

    it("should correctly add excluded integer to existing list", () => {
      const low = 3;
      const high = 10;
      const fakeGenerator = new FakeRandomIntegerGenerator();
      const exclusiveRng = new ExclusiveRng(
        low,
        high,
        [3, 7, 10],
        fakeGenerator
      );
      const generatedIntegers: number[] = [];
      const tries = high - low + 1;
      exclusiveRng.addExcluded(8);
      for (let i = 0; i < tries; i++) {
        generatedIntegers.push(exclusiveRng.generateRandomNumber());
      }
      for (const element of generatedIntegers) {
        expect([4, 5, 6, 9]).toContain(element);
      }
    });

    it("should throw if given excluded integer is already excluded", () => {
      const low = 4;
      const high = 6;
      const fakeGenerator = new FakeRandomIntegerGenerator();
      const exclusiveRng = new ExclusiveRng(low, high, [5], fakeGenerator);
      expect(() => {
        exclusiveRng.addExcluded(5);
      }).toThrow(InvalidRangeError);
    });

    it("should throw if given excluded integer is not in valid range", () => {
      const low = 4;
      const high = 6;
      const fakeGenerator = new FakeRandomIntegerGenerator();
      const exclusiveRng = new ExclusiveRng(low, high, [], fakeGenerator);
      expect(() => {
        exclusiveRng.addExcluded(7);
      }).toThrow(InvalidRangeError);
    });
  });

  describe("updateExcluded", () => {
    it("should be able to produce the old excluded integer and not the new one", () => {
      const low = 4;
      const high = 6;
      const fakeGenerator = new FakeRandomIntegerGenerator();
      const exclusiveRng = new ExclusiveRng(low, high, [5], fakeGenerator);
      exclusiveRng.updateExcluded(5, 6);
      const generatedIntegers: number[] = [];
      const tries = high - low + 1;
      for (let i = 0; i < tries; i++) {
        generatedIntegers.push(exclusiveRng.generateRandomNumber());
      }
      expect(generatedIntegers).toContain(5);
      expect(generatedIntegers).not.toContain(6);
    });

    it("should correctly operate on existing excluded integer list", () => {
      const low = 3;
      const high = 9;
      const fakeGenerator = new FakeRandomIntegerGenerator();
      const exclusiveRng = new ExclusiveRng(
        low,
        high,
        [3, 4, 5, 6, 7, 9],
        fakeGenerator
      );
      exclusiveRng.updateExcluded(5, 8);
      const generatedIntegers: number[] = [];
      const tries = high - low + 1;
      for (let i = 0; i < tries; i++) {
        generatedIntegers.push(exclusiveRng.generateRandomNumber());
      }
      expect(generatedIntegers).toContain(5);
      expect(generatedIntegers).not.toContain(8);
    });

    it("should throw if old excluded integer not excluded", () => {
      const low = 3;
      const high = 7;
      const fakeGenerator = new FakeRandomIntegerGenerator();
      const exclusiveRng = new ExclusiveRng(low, high, [], fakeGenerator);
      expect(() => {
        exclusiveRng.updateExcluded(5, 6);
      }).toThrow(InvalidRangeError);
    });

    it("should throw if new excluded integer was excluded", () => {
      const low = 3;
      const high = 7;
      const fakeGenerator = new FakeRandomIntegerGenerator();
      const exclusiveRng = new ExclusiveRng(low, high, [5, 6], fakeGenerator);
      expect(() => {
        exclusiveRng.updateExcluded(5, 6);
      }).toThrow(InvalidRangeError);
    });

    it("should throw if new excluded integer is outside range", () => {
      const low = 3;
      const high = 6;
      const fakeGenerator = new FakeRandomIntegerGenerator();
      const exclusiveRng = new ExclusiveRng(low, high, [5], fakeGenerator);
      expect(() => {
        exclusiveRng.updateExcluded(5, 8);
      }).toThrow(InvalidRangeError);
    });

    it("should not throw if old excluded integer is replaced with itself", () => {
      const low = 3;
      const high = 7;
      const fakeGenerator = new FakeRandomIntegerGenerator();
      const exclusiveRng = new ExclusiveRng(low, high, [5], fakeGenerator);
      expect(() => {
        exclusiveRng.updateExcluded(5, 5);
      }).not.toThrow(InvalidRangeError);
    });
  });
});
