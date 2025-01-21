import { Direction } from "../model";

/**
 * @brief Interface for a class that behaves like a 3D snake game state.
 */
interface GameStateable {
  /**
   * @brief Goes to the next state of the game.
   */
  goToNextState(): void;

  /**
   * @brief Checks if the game is over.
   * @returns True if the game is over, false otherwise.
   */
  isGameover(): boolean;

  /**
   * Changes the orientation of the snake to the given direction.
   * @param direction Direction to set the snake orientation to.
   */
  tryToSetSnakeDirection(direction: Direction): void;
}

export { GameStateable };
