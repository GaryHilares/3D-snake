import * as THREE from "three";
import { GameController, ViewController } from "./controller";
import { GameState } from "./model";
import { GameView } from "./view";

/**
 * @brief Entrypoint of the program. Runs the 3D snake game.
 */
function main() {
  const gameView = new GameView(window.innerWidth / window.innerHeight);
  const gameState = new GameState([gameView]);
  const gameController = new GameController(gameState);
  const viewController = new ViewController(gameView);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  window.addEventListener("keydown", (event: KeyboardEvent) => {
    viewController.onKeyPress(event);
    gameController.onKeyPress(event);
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
