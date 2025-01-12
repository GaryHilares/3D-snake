import { Direction } from "./model";
import { GameView } from "./view";

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
  gameOver(): boolean;

  /**
   * Changes the orientation of the snake to the given direction.
   * @param direction Direction to set the snake orientation to.
   */
  setSnakeDirection(direction: Direction): void;
}

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
    if (!this.gameState.gameOver()) {
      const UPDATE_DELAY = 250;
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
    if (!this.gameState.gameOver()) {
      switch (event.key) {
        case "a":
          this.gameState.setSnakeDirection(Direction.X_NEGATIVE);
          break;
        case "d":
          this.gameState.setSnakeDirection(Direction.X_POSITIVE);
          break;
        case "s":
          this.gameState.setSnakeDirection(Direction.Y_NEGATIVE);
          break;
        case "w":
          this.gameState.setSnakeDirection(Direction.Y_POSITIVE);
          break;
        case "q":
          this.gameState.setSnakeDirection(Direction.Z_NEGATIVE);
          break;
        case "e":
          this.gameState.setSnakeDirection(Direction.Z_POSITIVE);
          break;
      }
    }
  }
}

/**
 * @brief Represents a controller for adjusting the view.
 */
class ViewController {
  private view: GameView;
  private isMouseDown: boolean;

  /**
   * Creates a new ViewController that controls the given view.
   * @param view View to be controlled.
   */
  constructor(view: GameView) {
    this.view = view;
    this.isMouseDown = false;
  }

  /**
   * @brief Keeps track that the mouse is down.
   */
  public onMouseDown(): void {
    this.isMouseDown = true;
  }

  /**
   * @brief Keeps track that the mouse is up.
   */
  public onMouseUp(): void {
    this.isMouseDown = false;
  }

  /**
   * @brief Moves the angle of the camera when the mouse is moved while down.
   * @param event Mouse event associated with the mouse movement.
   */
  public onMouseMove(event: MouseEvent): void {
    if (this.isMouseDown) {
      this.view.changeAngle(event.movementX / 300, -event.movementY / 300);
    }
  }

  /**
   * @brief Zooms the camera in or out based on the movement of the wheel.
   * @param event Wheel event associated with the wheel movement.
   */
  public onWheel(event: WheelEvent): void {
    this.view.changeDistance(event.deltaY / 300);
  }

  /**
   * @brief Resets the camera position when the key "c" is pressed.
   * @param event Keyboard event associated with the key press.
   */
  public onKeyPress(event: KeyboardEvent): void {
    if (event.key == "c") {
      this.view.resetCameraPosition();
    }
  }
}

export { GameController, ViewController };
