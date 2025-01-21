import * as THREE from "three";
import { Position, GameStateObserver, GAME_BOX_SIDE } from "../model";
import { PointsCounterView } from "./PointsCounterView";
import { GameoverView } from "./GameoverView";
import { CustomOrbitControls } from "./CustomOrbitControls";

/**
 * @brief Represents a 3D view of the game state that uses Three.js.
 */
class GameView implements GameStateObserver {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private geometry: THREE.BoxGeometry;
  private snakeMaterial: THREE.Material;
  private foodMaterial: THREE.Material;
  private meshes: { [pos: string]: THREE.Mesh };
  private controls: CustomOrbitControls;
  private mouseEnabled: boolean;

  /**
   * Creates a new 3D game view.
   * @param aspect Aspect ratio that the camera should use.
   */
  constructor(aspect: number) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.snakeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    this.foodMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    this.meshes = {};
    this.camera.position.z = 5;
    this.controls = new CustomOrbitControls(this.camera);
    const borderShape = new THREE.BoxGeometry(
      GAME_BOX_SIDE,
      GAME_BOX_SIDE,
      GAME_BOX_SIDE
    );
    const borderGeometry = new THREE.EdgesGeometry(borderShape);
    const borderMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 3,
    });
    const border = new THREE.LineSegments(borderGeometry, borderMaterial);
    this.scene.add(border);
    this.mouseEnabled = true;

    const lightIntensity = 100;
    const lightDecay = 1.1;
    const bottomLight = new THREE.PointLight(
      0xffffff,
      lightIntensity,
      0,
      lightDecay
    );
    bottomLight.position.set(
      -Math.floor(GAME_BOX_SIDE / 2) - 3,
      -Math.floor(GAME_BOX_SIDE / 2) - 3,
      -Math.floor(GAME_BOX_SIDE / 2) - 3
    );
    this.scene.add(bottomLight);
    const topLight = new THREE.PointLight(
      0xffffff,
      lightIntensity,
      0,
      lightDecay
    );
    topLight.position.set(
      Math.floor(GAME_BOX_SIDE / 2) + 3,
      Math.floor(GAME_BOX_SIDE / 2) + 3,
      Math.floor(GAME_BOX_SIDE / 2) + 3
    );
    this.scene.add(topLight);
    GameoverView.hide();
  }

  public setAspect(aspect: number) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
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
   *        Refocuses the camera on the head of the snake.
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

  /**
   * @brief Changes the angle from which the camera is looking by the given
   *        amounts, clamping the azimuthal angle to [0, Math.PI].
   * @param thetaOffset Amount to add to the polar angle.
   * @param phiOffset Amount to add to the azimuthal angle.
   */
  public changeAngle(thetaOffset: number, phiOffset: number): void {
    if (this.mouseEnabled) {
      this.controls.changeAngle(thetaOffset, phiOffset);
    }
  }

  /**
   * @brief Changes the distance from the camera to the focused object by the
   *        given amount. Clamps the distance to [5, 20].
   * @param distanceOffset Amount to add to the distance.
   */
  public changeDistance(distanceOffset: number): void {
    if (this.mouseEnabled) {
      this.controls.changeDistance(distanceOffset);
    }
  }

  /**
   * @brief Resets the values associated to the angle and distance of the
   *        camera to its original values.
   */
  public resetCameraPosition(): void {
    this.controls.resetCameraPosition();
  }

  /**
   * @brief Updates the point counter view when the amount of points changes.
   * @param newPoints New amount of point owned by the player.
   */
  public pointsChanged(newPoints: number): void {
    PointsCounterView.setPointCount(newPoints);
  }

  public gameover(
    localRunCount: number,
    globalRunCount: number,
    score: number,
    highscore: number,
    globalHighscore: number
  ): void {
    this.mouseEnabled = false;
    PointsCounterView.setShowing(false);
    GameoverView.display(
      localRunCount,
      globalRunCount,
      score,
      highscore,
      globalHighscore
    );
    setInterval(() => {
      this.controls.changeAngle(0.001, -0.001);
    }, 1);
  }
}

export { GameView };
