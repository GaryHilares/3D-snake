import { Position } from "./Position";

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
    highscore: number,
    globalHighscore: number
  ): void;
}

export { GameStateObserver };
