import * as THREE from "three";
import { Position, GameStateObserver } from "./model";

class CustomOrbitControls {
  private camera: THREE.Object3D;
  private focus: Position;
  private theta: number;
  private phi: number;
  private distance: number;

  constructor(camera: THREE.Object3D) {
    this.camera = camera;
    this.focus = new Position(0, 0, 0);
    this.resetCameraAngle();
  }

  public changeFocus(newFocus: Position): void {
    this.focus = newFocus;
    this.adjustCamera();
  }

  public changeAngle(thetaOffset: number, phiOffset: number): void {
    const MIN_PHI = 0;
    const MAX_PHI = Math.PI;
    this.theta = this.theta + thetaOffset;
    this.phi = Math.min(MAX_PHI, Math.max(MIN_PHI, this.phi + phiOffset));
    this.adjustCamera();
  }

  public changeDistance(distanceOffset: number): void {
    const MIN_DISTANCE = 5;
    const MAX_DISTANCE = 20;
    this.distance = Math.min(
      MAX_DISTANCE,
      Math.max(MIN_DISTANCE, this.distance + distanceOffset)
    );
    this.adjustCamera();
  }

  public resetCameraAngle(): void {
    this.theta = 0;
    this.phi = Math.PI / 2;
    this.distance = 10;
    this.adjustCamera();
  }

  private adjustCamera(): void {
    const angle = new THREE.Euler(
      -Math.PI / 2 + this.phi,
      this.theta,
      0,
      "ZYX"
    );
    this.camera.position.x =
      this.focus.getX() +
      this.distance * Math.sin(this.theta) * Math.sin(this.phi);
    this.camera.position.y =
      this.focus.getY() + this.distance * Math.cos(this.phi);
    this.camera.position.z =
      this.focus.getZ() +
      this.distance * Math.cos(this.theta) * Math.sin(this.phi);
    this.camera.setRotationFromEuler(angle);
  }
}

/**
 * @brief Represents a 3D view of the game state that uses Three.js.
 */
class GameView implements GameStateObserver {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private geometry: THREE.BoxGeometry;
  private snakeMaterial: THREE.MeshBasicMaterial;
  private foodMaterial: THREE.MeshBasicMaterial;
  private meshes: { [pos: string]: THREE.Mesh };
  private controls: CustomOrbitControls;

  /**
   * Creates a new 3D game view.
   * @param aspect Aspect ratio that the camera should use.
   */
  constructor(aspect: number) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.snakeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.foodMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.meshes = {};
    this.camera.position.z = 5;
    this.controls = new CustomOrbitControls(this.camera);
  }

  /**
   * @brief Removes the snake body from the view when it leaves a square.
   * @param position Position that the snake left.
   */
  public snakeLeft(position: Position): void {
    this.scene.remove(this.meshes[position.toStringCustom()]);
    delete this.meshes[position.toStringCustom()];
  }

  /**
   * @brief Adds the snake body to the view when it enters a new square.
   * @param position Position that the snake entered.
   */
  public snakeEntered(position: Position): void {
    const newSnake = new THREE.Mesh(this.geometry, this.snakeMaterial);
    this.meshes[position.toStringCustom()] = newSnake;
    newSnake.position.x = position.getX();
    newSnake.position.y = position.getY();
    newSnake.position.z = position.getZ();
    this.scene.add(newSnake);
    this.controls.changeFocus(position);
  }

  /**
   * @brief Removes the piece of food to the view when it leaves a square.
   * @param position Position that the food left.
   */
  public foodLeft(position: Position): void {
    this.scene.remove(this.meshes[position.toStringCustom()]);
    delete this.meshes[position.toStringCustom()];
  }

  /**
   * @brief Adds the piece of food to the view when it enters a new square.
   * @param position Position that the food entered.
   */
  public foodEntered(position: Position): void {
    const newFood = new THREE.Mesh(this.geometry, this.foodMaterial);
    this.meshes[position.toStringCustom()] = newFood;
    newFood.position.x = position.getX();
    newFood.position.y = position.getY();
    newFood.position.z = position.getZ();
    this.scene.add(newFood);
  }

  /**
   * @brief Renders the view onto the given renderer.
   * @param renderer Renderer to render scene onto.
   */
  public renderOn(renderer: THREE.WebGLRenderer): void {
    renderer.render(this.scene, this.camera);
  }

  public changeAngle(thetaOffset: number, phiOffset: number): void {
    this.controls.changeAngle(thetaOffset, phiOffset);
  }

  public changeDistance(distanceOffset: number): void {
    this.controls.changeDistance(distanceOffset);
  }

  public resetCameraAngle(): void {
    this.controls.resetCameraAngle();
  }
}

export { GameView };
