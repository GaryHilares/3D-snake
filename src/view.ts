import * as THREE from "three";
import { Position, GameStateObserver } from "./model";

/**
 * @brief Represents a 3D view of the game state that uses Three.js.
 */
class GameView implements GameStateObserver {
  camera: THREE.Camera;
  scene: THREE.Scene;
  geometry: THREE.BoxGeometry;
  snakeMaterial: THREE.MeshBasicMaterial;
  foodMaterial: THREE.MeshBasicMaterial;
  meshes: { [pos: string]: THREE.Mesh };

  /**
   * Creates a new 3D game view.
   * @param aspect Aspect ratio that the camera should use.
   */
  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);
    this.scene = new THREE.Scene();
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.snakeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.foodMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.meshes = {};
    this.camera.position.z = 5;
  }

  /**
   * @brief Removes the snake body from the view when it leaves a square.
   * @param position Position that the snake left.
   */
  snakeLeft(position: Position): void {
    this.scene.remove(this.meshes[position.toStringCustom()]);
    delete this.meshes[position.toStringCustom()];
  }

  /**
   * @brief Adds the snake body to the view when it enters a new square.
   * @param position Position that the snake entered.
   */
  snakeEntered(position: Position): void {
    const newSnake = new THREE.Mesh(this.geometry, this.snakeMaterial);
    this.meshes[position.toStringCustom()] = newSnake;
    newSnake.position.x = position.getX();
    newSnake.position.y = position.getY();
    newSnake.position.z = position.getZ();
    this.scene.add(newSnake);
    this.camera.position.x = position.getX();
    this.camera.position.y = position.getY();
    this.camera.position.z = position.getZ() + 10;
  }

  /**
   * @brief Removes the piece of food to the view when it leaves a square.
   * @param position Position that the food left.
   */
  foodLeft(position: Position): void {
    console.log(this.meshes, position);
    this.scene.remove(this.meshes[position.toStringCustom()]);
    delete this.meshes[position.toStringCustom()];
  }

  /**
   * @brief Adds the piece of food to the view when it enters a new square.
   * @param position Position that the food entered.
   */
  foodEntered(position: Position): void {
    const newFood = new THREE.Mesh(this.geometry, this.foodMaterial);
    this.meshes[position.toStringCustom()] = newFood;
    newFood.position.x = position.getX();
    newFood.position.y = position.getY();
    newFood.position.z = position.getZ();
    this.scene.add(newFood);
  }
}

export { GameView };
