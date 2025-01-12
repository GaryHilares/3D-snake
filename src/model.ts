/**
 * @brief Represents an observer that can observe a game state observable.
 */
interface GameStateObserver {
  /**
   * Handles the case where the snake left the given position.
   * @param position The position that the snake left.
   */
  snakeLeft(position: Position): void;

  /**
   * Handles the case where the snake entered the given position.
   * @param position The position that the snake entered.
   */
  snakeEntered(position: Position): void;

  /**
   * Handles the case where the food left the given position.
   * @param position The position that the food left.
   */
  foodLeft(position: Position): void;

  /**
   * Handles the case where the food entered the given position.
   * @param position The position that the food entered.
   */
  foodEntered(position: Position): void;
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
}

/**
 * @brief Represents a 3D coordinate.
 */
class Position {
  private x: number;
  private y: number;
  private z: number;

  /**
   * Creates a new position with the given coordinates.
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
   * Produces the x-coordinate of this position.
   * @returns x-coordinate of this position.
   */
  getX(): number {
    return this.x;
  }

  /**
   * Produces the y-coordinate of this position.
   * @returns y-coordinate of this position.
   */
  getY(): number {
    return this.y;
  }

  /**
   * Produces the z-coordinate of this position.
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

  toStringCustom(): string {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}

/**
 * @brief Represents a 3D direction.
 */
enum Direction {
  X_POSITIVE,
  X_NEGATIVE,
  Y_POSITIVE,
  Y_NEGATIVE,
  Z_POSITIVE,
  Z_NEGATIVE,
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

  public willEatFoodNext(food: Food): boolean {
    return this.targetBlock().equals(food.getLocation());
  }

  public moveAndNotGrow(): void {
    this.observable.notifySnakeLeft(this.body[this.body.length - 1]);
    for (let i = this.body.length - 1; i > 0; i--) {
      this.body[i] = this.body[i - 1];
    }
    this.body[0] = this.targetBlock();
    this.observable.notifySnakeEntered(this.body[0]);
  }

  public moveAndGrow(): void {
    this.body.unshift(this.targetBlock());
    this.observable.notifySnakeEntered(this.body[0]);
  }

  public setDirection(direction: Direction) {
    this.orientation = direction;
  }

  public isHeadCrossingBody(): boolean {
    const head = this.getHead();
    return this.body.some((position, idx) => {
      return idx != 0 && head.equals(position);
    });
  }

  private getHead() {
    return this.body[0];
  }
}

/**
 * @brief Represents a piece of food in the snake game.
 */
class Food {
  private location: Position;

  constructor(location: Position) {
    this.location = location;
  }

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

  /**
   * @brief Creates a new game state, with the given observers.
   * @param observers Observers that will observe this game state.
   */
  constructor(observers: GameStateObserver[] = []) {
    const FOOD_AMOUNT = 10;
    this.observable = new GameStateObservable(observers);
    this.snake = new Snake(this.observable);
    this.foods = [];
    for (let i = 0; i < FOOD_AMOUNT; i++) {
      this.replaceFood();
    }
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
    }
  }

  /**
   * @brief Sets the snake to face a new direction.
   * @param direction The new direction for the snake.
   */
  public setSnakeDirection(direction: Direction) {
    this.snake.setDirection(direction);
  }

  /**
   * @brief Checks whether the game is over (i.e. whether the snake has eaten
   *        itself).
   * @returns True if the game is over, false otherwise.
   */
  public gameOver() {
    return this.snake.isHeadCrossingBody();
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
    const SPAWN_CUBE_SIDE = 10;
    const x = Math.floor(SPAWN_CUBE_SIDE * Math.random());
    const y = Math.floor(SPAWN_CUBE_SIDE * Math.random());
    const z = Math.floor(SPAWN_CUBE_SIDE * Math.random());
    const pos = new Position(x, y, z);
    return new Food(pos);
  }
}

export { Position, Direction, Food, Snake, GameState, GameStateObserver };
