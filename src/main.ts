import * as THREE from "three";
import { GameController, ViewController } from "./controller";
import { GameState } from "./model";
import { GameView } from "./view";

/**
 * @brief Entrypoint of the program. Runs the 3D snake game.
 */
function main() {
  let gameView = new GameView(window.innerWidth / window.innerHeight);
  let gameState = new GameState([gameView]);
  let gameController = new GameController(gameState);
  let viewController = new ViewController(gameView);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  function resetGame() {
    gameView = new GameView(window.innerWidth / window.innerHeight);
    gameState = new GameState([gameView]);
    gameController = new GameController(gameState);
    viewController = new ViewController(gameView);
  }
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
}

main();
