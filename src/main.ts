import * as THREE from "three";
import { GameController } from "./controller";
import { GameState } from "./model";
import { GameView } from "./view";

function main() {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const gameView = new GameView(window.innerWidth / window.innerHeight);
  const gameState = new GameState([gameView]);
  const gameController = new GameController(gameState);

  window.addEventListener("keydown", (event: KeyboardEvent) => {
    gameController.onKeyPress(event);
  });
  function animate(time: number) {
    gameController.updateGame(time);
    renderer.render(gameView.scene, gameView.camera);
  }
  renderer.setAnimationLoop(animate);
}

main();
