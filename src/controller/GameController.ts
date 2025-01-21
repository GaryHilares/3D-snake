import { GameStateable } from "./GameStateable";
import { Direction } from "../model";

/**
 * @brief Represents a game controller that updates a given game state.
 */
class GameController {
  private gameState: GameStateable;
  private lastUpdated: number | null;

  /**
   * @brief Creates a game controller that updates the given game state.
   * @param gameState Game state that this game controller will control.
   */
  constructor(gameState: GameStateable) {
    this.gameState = gameState;
    this.lastUpdated = null;
  }

  /**
   * @brief Updates the game each time that a particular
   *        (implementation-defined) amount of seconds has passed.
   * @param time Time point of reference. Used to calculate deltatime.
   */
  public updateGame(time: number): void {
    if (!this.gameState.isGameover()) {
      const UPDATE_DELAY = 60;
      if (this.lastUpdated == null) {
        this.lastUpdated = time;
      } else if (this.lastUpdated + UPDATE_DELAY < time) {
        this.gameState.goToNextState();
        this.lastUpdated = time;
      }
    }
  }

  /**
   * @brief Checks the given key event, and updates the game accordingly.
   * @details The updates will be as follows:
   *          - The "a" key will make the snake face left.
   *          - The "d" key will make the snake face right.
   *          - The "s" key will make the snake face down.
   *          - The "w" key will make the snake face up.
   *          - The "q" key will make the snake face away.
   *          - The "e" key will make the snake face towards.
   * @param event Key event to read for updates.
   */
  public onKeyPress(event: KeyboardEvent): void {
    if (!this.gameState.isGameover()) {
      switch (event.code) {
        case "KeyA":
          this.gameState.tryToSetSnakeDirection(Direction.X_NEGATIVE);
          break;
        case "KeyD":
          this.gameState.tryToSetSnakeDirection(Direction.X_POSITIVE);
          break;
        case "KeyS":
          this.gameState.tryToSetSnakeDirection(Direction.Y_NEGATIVE);
          break;
        case "KeyW":
          this.gameState.tryToSetSnakeDirection(Direction.Y_POSITIVE);
          break;
        case "KeyQ":
          this.gameState.tryToSetSnakeDirection(Direction.Z_NEGATIVE);
          break;
        case "KeyE":
          this.gameState.tryToSetSnakeDirection(Direction.Z_POSITIVE);
          break;
      }
    }
  }
}

export { GameController };
