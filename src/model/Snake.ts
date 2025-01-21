import { GameStateObservable } from "./GameStateObservable";
import { Position } from "./Position";
import { ExclusiveRandomPositionGenerator } from "./ExclusiveRandomPositionGenerator";
import { Direction } from "./Direction";
import { Food } from "./Food";

/**
 * @brief Size of a side of the game box. Must be odd.
 */
const GAME_BOX_SIDE = 21;

/**
 * @brief Represents a snake in the snake game.
 */
class Snake {
  /**
   * @invariant body is never empty.
   */
  private observable: GameStateObservable;
  private body: Position[];
  private orientation: Direction;
  private hasRotatedSinceLastMove: boolean;
  private rng: ExclusiveRandomPositionGenerator;

  constructor(
    observable: GameStateObservable,
    rng: ExclusiveRandomPositionGenerator
  ) {
    this.observable = observable;
    this.rng = rng;
    this.body = [new Position(0, 0, 0)];
    this.rng.addOcuppated(this.getHead());
    this.orientation = Direction.X_POSITIVE;
    this.observable.notifySnakeEntered(this.getHead());
    this.hasRotatedSinceLastMove = false;
  }

  private targetBlock(): Position {
    const head = this.getHead();
    switch (this.orientation) {
      case Direction.X_NEGATIVE:
        return new Position(head.getX() - 1, head.getY(), head.getZ());
      case Direction.X_POSITIVE:
        return new Position(head.getX() + 1, head.getY(), head.getZ());
      case Direction.Y_POSITIVE:
        return new Position(head.getX(), head.getY() + 1, head.getZ());
      case Direction.Y_NEGATIVE:
        return new Position(head.getX(), head.getY() - 1, head.getZ());
      case Direction.Z_POSITIVE:
        return new Position(head.getX(), head.getY(), head.getZ() + 1);
      case Direction.Z_NEGATIVE:
        return new Position(head.getX(), head.getY(), head.getZ() - 1);
    }
  }

  /**
   * @brief Checks if the given food will be eaten by the snake in its next
   *        move.
   * @param food Food to check for.
   * @returns True if the given food will be eaten by the snake in the next
   *          move, false otherwise.
   */
  public willEatFoodNext(food: Food): boolean {
    return this.targetBlock().equals(food.getLocation());
  }

  /**
   * @brief Makes the snake move without growing in size.
   */
  public moveAndNotGrow(): void {
    const blockLeft = this.body[this.body.length - 1];
    this.observable.notifySnakeLeft(blockLeft);
    for (let i = this.body.length - 1; i > 0; i--) {
      this.body[i] = this.body[i - 1];
    }
    this.body[0] = this.targetBlock();
    this.observable.notifySnakeEntered(this.body[0]);
    this.hasRotatedSinceLastMove = false;
    if (!this.isHeadOutOfGameBounds() && !this.isHeadCrossingBody()) {
      this.rng.updateOccupated(blockLeft, this.getHead());
    }
  }

  /**
   * @brief Makes the snake move and grow in size.
   */
  public moveAndGrow(): void {
    this.body.unshift(this.targetBlock());
    this.observable.notifySnakeEntered(this.body[0]);
    this.hasRotatedSinceLastMove = false;
  }

  /**
   * @brief Sets the orientation of the snake to the given direction if it is
   *        a legal move (i.e. if the new orientation is not the opposite one).
   */
  public tryToSetDirection(direction: Direction) {
    if (direction != -this.orientation && !this.hasRotatedSinceLastMove) {
      this.orientation = direction;
      this.hasRotatedSinceLastMove = true;
    }
  }

  /**
   * @brief Checks if the head of the snake is crossing the body.
   * @returns True if the head is crossing the body, false otherwise.
   */
  public isHeadCrossingBody(): boolean {
    const head = this.getHead();
    return this.body.some((position, idx) => {
      return idx != 0 && head.equals(position);
    });
  }

  public isHeadOutOfGameBounds(): boolean {
    const half_edge = Math.floor(GAME_BOX_SIDE / 2);
    const head = this.getHead();
    return (
      head.getX() < -half_edge ||
      head.getX() > half_edge ||
      head.getY() < -half_edge ||
      head.getY() > half_edge ||
      head.getZ() < -half_edge ||
      head.getZ() > half_edge
    );
  }

  /**
   * @brief Produces the position of the head of the snake.
   * @returns The position of the head of the snake.
   */
  private getHead(): Position {
    return this.body[0];
  }
}

export { Snake, GAME_BOX_SIDE };
