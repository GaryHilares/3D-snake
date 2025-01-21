import { GameView } from "../view";

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
    if (event.code == "KeyC") {
      this.view.resetCameraPosition();
    }
  }
}

export { ViewController };
