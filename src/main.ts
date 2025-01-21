import * as THREE from "three";
import { GameController, ViewController } from "./controller";
import { GameState } from "./model";
import { GameView, MainMenuView, ControlsView } from "./view";

/**
 * @brief Entrypoint of the program. Runs the 3D snake game.
 */
function main() {
  document
    .getElementById("controls-menu--go-back")!
    .addEventListener("click", () => {
      MainMenuView.setShowing(true);
      ControlsView.setShowing(false);
    });
  document
    .getElementById("main-menu--controls-button")!
    .addEventListener("click", () => {
      MainMenuView.setShowing(false);
      ControlsView.setShowing(true);
    });

  document
    .getElementById("main-menu--play-button")!
    .addEventListener("click", () => {
      MainMenuView.setShowing(false);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);
      let viewController;
      let gameView;
      let gameState;
      let gameController;
      function resetGame() {
        gameView = new GameView(window.innerWidth / window.innerHeight);
        gameState = new GameState([gameView]);
        gameController = new GameController(gameState);
        viewController = new ViewController(gameView);
      }
      resetGame();
      document
        .getElementById("gameover-menu--play-again")!
        .addEventListener("click", resetGame);
      window.addEventListener("keydown", (event: KeyboardEvent) => {
        viewController.onKeyPress(event);
        gameController.onKeyPress(event);
        if (event.code === "KeyR") {
          resetGame();
        }
      });
      window.addEventListener("mousedown", () => {
        viewController.onMouseDown();
      });
      window.addEventListener("mouseup", () => {
        viewController.onMouseUp();
      });
      window.addEventListener("mousemove", (event: MouseEvent) => {
        viewController.onMouseMove(event);
      });
      window.addEventListener("wheel", (event: WheelEvent) => {
        viewController.onWheel(event);
      });
      window.addEventListener("resize", (event: Event) => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        gameView.setAspect(window.innerWidth / window.innerHeight);
      });
      function animate(time: number) {
        gameController.updateGame(time);
        gameView.renderOn(renderer);
      }
      renderer.setAnimationLoop(animate);
    });
}

main();
