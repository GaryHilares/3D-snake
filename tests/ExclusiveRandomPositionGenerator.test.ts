import { describe, it } from "@jest/globals";
import { ExclusiveRandomPositionGenerator } from "../src/model/ExclusiveRandomPositionGenerator";
import {
  ExclusiveRng,
  IExclusiveRng,
  InvalidRangeError,
} from "../src/model/ExclusiveRandomNumberGenerator";
import { Position } from "../src/model/Position";

class FakeExclusiveRng implements IExclusiveRng {
  private nextGenerated: number;
  private low: number;
  private high: number;
  private excluded: number[];

  constructor(high: number, excluded: number[]) {
    this.nextGenerated = 0;
    this.high = high;
    this.excluded = excluded;
  }

  addExcluded(newExcluded: number): void {
    this.excluded.push(newExcluded);
  }

  generateRandomNumber(): number {
    const maxTries = this.high - this.low + 1;
    for (let i = 0; i < maxTries; i++) {
      const generated = this.nextGenerated;
      this.nextGenerated = (this.nextGenerated + 1) % this.high;
      if (!this.excluded.includes(generated)) {
        return generated;
      }
    }
    throw new InvalidRangeError();
  }

  updateExcluded(oldExcluded: number, newExcluded: number): void {
    if (
      !this.excluded.includes(oldExcluded) ||
      (oldExcluded !== newExcluded && this.excluded.includes(newExcluded))
    ) {
      throw new InvalidRangeError();
    }
    this.excluded.map((excludedNum) =>
      excludedNum === oldExcluded ? newExcluded : excludedNum
    );
  }
}

function inRange(num: number, low: number, high: number) {
  return low <= num && num <= high;
}

function inBox(pos: Position, minCorner: Position, maxCorner: Position) {
  return (
    inRange(pos.getX(), minCorner.getX(), maxCorner.getX()) &&
    inRange(pos.getY(), minCorner.getY(), maxCorner.getY()) &&
    inRange(pos.getZ(), minCorner.getZ(), maxCorner.getZ())
  );
}

describe("ExclusiveRandomPositionGenerator", () => {
  describe("generate", () => {
    it("should generate all posible positions in range", () => {
      const minX = -1;
      const maxX = 1;
      const minY = -1;
      const maxY = 1;
      const minZ = -1;
      const maxZ = 3;
      const positionTotal =
        (maxX - minX + 1) * (maxY - minY + 1) * (maxZ - minZ + 1);
      const minCorner = new Position(minX, minY, minZ);
      const maxCorner = new Position(maxX, maxY, maxZ);
      const exclusiveRng = new FakeExclusiveRng(positionTotal, []);
      const generator = new ExclusiveRandomPositionGenerator(
        minCorner,
        maxCorner,
        exclusiveRng
      );
      const generatedPos: Position[] = [];
      for (let i = 0; i < positionTotal; i++) {
        generatedPos.push(generator.generate());
      }
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          for (let z = minZ; z <= maxZ; z++) {
            expect(generatedPos).toContainEqual(new Position(x, y, z));
          }
        }
      }
    });
    it("should not generate positions occupated or outside range", () => {
      const minX = -1;
      const maxX = 1;
      const minY = -1;
      const maxY = 1;
      const minZ = -1;
      const maxZ = 3;
      const positionTotal =
        (maxX - minX + 1) * (maxY - minY + 1) * (maxZ - minZ + 1);
      const generated: Position[] = [];
      const exclusiveRng = new FakeExclusiveRng(positionTotal, [
        0,
        positionTotal - 1,
      ]);
      const minCorner = new Position(minX, minY, minZ);
      const maxCorner = new Position(maxX, maxY, maxZ);
      const generator = new ExclusiveRandomPositionGenerator(
        minCorner,
        maxCorner,
        exclusiveRng
      );
      for (let i = 0; i < positionTotal; i++) {
        generated.push(generator.generate());
      }
      for (const pos of generated) {
        expect(inBox(pos, minCorner, maxCorner)).toBeTruthy();
        expect([minCorner, maxCorner]).not.toContainEqual(pos);
      }
    });
    it("should throw if no possible positions can appear", () => {
      const minX = 1;
      const maxX = 1;
      const minY = 1;
      const maxY = 1;
      const minZ = 1;
      const maxZ = 2;
      const positionTotal =
        (maxX - minX + 1) * (maxY - minY + 1) * (maxZ - minZ + 1);
      const exclusiveRng = new FakeExclusiveRng(positionTotal, [0, 1]);
      const minCorner = new Position(minX, minY, minZ);
      const maxCorner = new Position(maxX, maxY, maxZ);
      const generator = new ExclusiveRandomPositionGenerator(
        minCorner,
        maxCorner,
        exclusiveRng
      );
      expect(() => {
        generator.generate();
      }).toThrow(InvalidRangeError);
    });
  });
  describe("updateOccupated", () => {
    it("should generate old occupated position and not generate new one", () => {});
    it("should throw if old occupated position was not actually occupated", () => {});
    it("should throw if new occupated position is already occupated", () => {});
    it("should throw if new occupated position is outside range", () => {});
    it("should not throw if old occupated position is the same as new occupated position", () => {});
  });
  describe("addOccupated", () => {
    it("should not generate new occupated position", () => {});
    it("should throw if new occupated position is already occupated", () => {});
    it("should throw if new occupated position is outside range", () => {});
  });
});
