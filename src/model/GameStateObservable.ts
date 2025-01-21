import type { GameStateObserver } from "./GameStateObserver";
import { Position } from "./Position";

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
    highscore: number,
    globalHighscore: number
  ): void {
    console.log(globalHighscore);
    for (let observer of this.observers) {
      observer.gameover(
        localRunCount,
        globalRunCount,
        score,
        highscore,
        globalHighscore
      );
    }
  }
}

export { GameStateObservable };
