/**
 * @brief Size of a side of the game box. Must be odd.
 */
const GAME_BOX_SIDE = 21;

/**
 * @brief Represents an observer that can observe a game state observable.
 */
interface GameStateObserver {
  /**
   * @brief Handles the event where the snake left the given position.
   * @param position The position that the snake left.
   */
  snakeLeft(position: Position): void;

  /**
   * @brief Handles the event where the snake entered the given position.
   * @param position The position that the snake entered.
   */
  snakeEntered(position: Position): void;

  /**
   * Handles the event where the food left the given position.
   * @param position The position that the food left.
   */
  foodLeft(position: Position): void;

  /**
   * @brief Handles the event where the food entered the given position.
   * @param position The position that the food entered.
   */
  foodEntered(position: Position): void;

  /**
   * @brief Handles the event where the amount of points changes.
   * @param newPoints New amount of points owned by the player.
   */
  pointsChanged(newPoints: number): void;

  gameover(
    localRunCount: number,
    globalRunCount: number,
    score: number,
    highscore: number
  ): void;
}

/**
 * @brief Represents an observable that notifies about changes in game state.
 */
class GameStateObservable {
  observers: GameStateObserver[];

  /**
   * @brief Creates a new game state observable.
   * @param observers Observers to initialize this game state observable with.
   */
  constructor(observers: GameStateObserver[]) {
    this.observers = observers;
  }

  /**
   * @brief Notifies observers that the snake left the given position.
   * @param position Position that the snake left.
   */
  public notifySnakeLeft(position: Position): void {
    for (let observer of this.observers) {
      observer.snakeLeft(position);
    }
  }

  /**
   * @brief Notifies observers that the snake entered the given position.
   * @param position Position that the snake entered.
   */
  public notifySnakeEntered(position: Position): void {
    for (let observer of this.observers) {
      observer.snakeEntered(position);
    }
  }

  /**
   * @brief Notifies observers that the food left the given position.
   * @param position Position that the food left.
   */
  public notifyFoodLeft(position: Position): void {
    for (let observer of this.observers) {
      observer.foodLeft(position);
    }
  }

  /**
   * @brief Notifies observers that the food entered the given position.
   * @param position Position that the food left.
   */
  public notifyFoodEntered(position: Position): void {
    for (let observer of this.observers) {
      observer.foodEntered(position);
    }
  }

  /**
   * @brief Notifies observers that the amount of points has changed.
   * @param newPoints New amount of points.
   */
  public notifyPointsChanged(newPoints: number): void {
    for (let observer of this.observers) {
      observer.pointsChanged(newPoints);
    }
  }

  public notifyGameover(
    localRunCount: number,
    globalRunCount: number,
    score: number,
    highscore: number
  ): void {
    for (let observer of this.observers) {
      observer.gameover(localRunCount, globalRunCount, score, highscore);
    }
  }
}

/**
 * @brief Represents a 3D coordinate.
 */
class Position {
  private x: number;
  private y: number;
  private z: number;

  /**
   * @brief Creates a new position with the given coordinates.
   * @param x x-coordinate of the position.
   * @param y y-coordinate of the position.
   * @param z z-coordinate of the position.
   */
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * @brief Produces the x-coordinate of this position.
   * @returns x-coordinate of this position.
   */
  getX(): number {
    return this.x;
  }

  /**
   * @brief Produces the y-coordinate of this position.
   * @returns y-coordinate of this position.
   */
  getY(): number {
    return this.y;
  }

  /**
   * @brief Produces the z-coordinate of this position.
   * @returns z-coordinate of this position.
   */
  getZ(): number {
    return this.z;
  }

  /**
   * Checks if this position is equal to the given one.
   * @param pos The other position to compare.
   * @returns True if both positions are equal, false otherwise.
   */
  equals(pos: Position): boolean {
    return this.x === pos.x && this.y === pos.y && this.z === pos.z;
  }

  /**
   * @brief Produces a string representation of this position different to that
   *        produced by toString.
   * @returns A string representation of this position.
   */
  toStringCustom(): string {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}

/**
 * @brief Represents a 3D direction. For all directions d, -d is the opposite
 *        direction.
 */
enum Direction {
  X_POSITIVE = 1,
  X_NEGATIVE = -1,
  Y_POSITIVE = 2,
  Y_NEGATIVE = -2,
  Z_POSITIVE = 3,
  Z_NEGATIVE = -3,
}

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

  constructor(observable: GameStateObservable) {
    this.observable = observable;
    this.body = [new Position(0, 0, 0)];
    this.orientation = Direction.X_POSITIVE;
    this.observable.notifySnakeEntered(this.getHead());
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
    this.observable.notifySnakeLeft(this.body[this.body.length - 1]);
    for (let i = this.body.length - 1; i > 0; i--) {
      this.body[i] = this.body[i - 1];
    }
    this.body[0] = this.targetBlock();
    this.observable.notifySnakeEntered(this.body[0]);
  }

  /**
   * @brief Makes the snake move and grow in size.
   */
  public moveAndGrow(): void {
    this.body.unshift(this.targetBlock());
    this.observable.notifySnakeEntered(this.body[0]);
  }

  /**
   * @brief Sets the orientation of the snake to the given direction if it is
   *        a legal move (i.e. if the new orientation is not the opposite one).
   */
  public tryToSetDirection(direction: Direction) {
    if (direction != -this.orientation) {
      this.orientation = direction;
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

/**
 * @brief Represents a piece of food in the snake game.
 */
class Food {
  private location: Position;

  /**
   * @brief Creates a new piece of food with the given position.
   * @param location The position to create the food at.
   */
  constructor(location: Position) {
    this.location = location;
  }

  /**
   * @brief Produces the location where the food is located.
   * @returns Position where the food is located.
   */
  public getLocation(): Position {
    return this.location;
  }
}

/**
 * @brief Represents a game state in the snake game.
 */
class GameState {
  private observable: GameStateObservable;
  private snake: Snake;
  private foods: Food[];
  private points: number;
  private gameover: boolean;

  /**
   * @brief Creates a new game state, with the given observers.
   * @param observers Observers that will observe this game state.
   */
  constructor(observers: GameStateObserver[] = []) {
    const FOOD_AMOUNT = 10;
    this.observable = new GameStateObservable(observers);
    this.snake = new Snake(this.observable);
    this.foods = [];
    this.points = 0;
    this.gameover = false;
    for (let i = 0; i < FOOD_AMOUNT; i++) {
      this.replaceFood();
    }
    this.observable.notifyPointsChanged(this.points);
  }

  /**
   * @brief Proceeds to the next state.
   */
  public goToNextState(): void {
    const consumedFoodIndex = this.indexOfFoodToBeEaten();
    if (consumedFoodIndex == -1) {
      this.snake.moveAndNotGrow();
    } else {
      this.replaceFood(consumedFoodIndex);
      this.snake.moveAndGrow();
      this.increasePoints();
    }
    if (this.isNowGameOver()) {
      this.gameover = true;
      const storedHighscore = window.localStorage.getItem("highscore");
      const oldHighscore = storedHighscore ? parseInt(storedHighscore) : 0;
      const highscore = Math.max(this.points, oldHighscore);
      const storedRun = window.localStorage.getItem("localRun");
      const oldRun = storedRun ? parseInt(storedRun) : 0;
      const run = oldRun + 1;
      window.localStorage.setItem("highscore", highscore.toString());
      window.localStorage.setItem("localRun", run.toString());
      this.observable.notifyGameover(run, NaN, this.points, highscore);
    }
  }

  /**
   * @brief Sets the snake to face a new direction.
   * @param direction The new direction for the snake.
   */
  public tryToSetSnakeDirection(direction: Direction) {
    this.snake.tryToSetDirection(direction);
  }

  public isGameover(): boolean {
    return this.gameover;
  }

  /**
   * @brief Checks whether the game is over (i.e. whether the snake has eaten
   *        itself).
   * @returns True if the game is over, false otherwise.
   */
  private isNowGameOver() {
    return (
      this.snake.isHeadCrossingBody() || this.snake.isHeadOutOfGameBounds()
    );
  }

  /**
   * @brief Increases the amount of points and notifies observers about it.
   */
  private increasePoints(): void {
    this.points++;
    this.observable.notifyPointsChanged(this.points);
  }

  /**
   * @brief Replaces a piece of food with a new one, then notifies observers.
   * @param idx Index of food to replace, or -1 if no piece of food should be
   *        replaced (but a new one should still be added).
   */
  private replaceFood(idx: number = -1): void {
    if (idx != -1) {
      this.observable.notifyFoodLeft(this.foods[idx].getLocation());
    }
    const newFood = this.createRandomFood();
    if (idx != -1) {
      this.foods[idx] = newFood;
    } else {
      this.foods.push(newFood);
    }
    this.observable.notifyFoodEntered(newFood.getLocation());
  }

  /**
   * @brief Finds the index of the food that will be eaten by the snake next.
   * @returns Index of the food that will be eaten by the snake, or -1 if none.
   */
  private indexOfFoodToBeEaten(): number {
    return this.foods.findIndex((food) => {
      return this.snake.willEatFoodNext(food);
    });
  }

  /**
   * @brief Produces a piece of food with given index.
   * @returns A new piece of food at random position.
   */
  private createRandomFood(): Food {
    const x = Math.floor(
      GAME_BOX_SIDE * Math.random() - Math.floor(GAME_BOX_SIDE / 2)
    );
    const y = Math.floor(
      GAME_BOX_SIDE * Math.random() - Math.floor(GAME_BOX_SIDE / 2)
    );
    const z = Math.floor(
      GAME_BOX_SIDE * Math.random() - Math.floor(GAME_BOX_SIDE / 2)
    );
    const pos = new Position(x, y, z);
    return new Food(pos);
  }
}

export {
  Position,
  Direction,
  Food,
  Snake,
  GameState,
  GameStateObserver,
  GAME_BOX_SIDE,
};
