import * as THREE from "three";
import { Position, GameStateObserver, GAME_BOX_SIDE } from "./model";

/**
 * @brief Represents a view of the amount of points owned by the player.
 */
class PointsCounterView {
  private static menuDomId = "point-counter";
  private static counterDomId = "point-counter--points";

  /**
   * @brief Sets whether the view should be displayed or not.
   * @param shouldShow True if the menu should be shown, false otherwise.
   */
  public static setShowing(shouldShow: boolean): void {
    document.getElementById(PointsCounterView.menuDomId)!.style.visibility =
      shouldShow ? "visible" : "hidden";
  }

  /**
   * @brief Sets the amount of points displayed on this view.
   * @param points Amount of points to be displayed.
   */
  public static setPointCount(points: number): void {
    document.getElementById(PointsCounterView.counterDomId)!.textContent =
      points.toString();
  }
}

/**
 * @brief Represents controls to make rotate the camera around a position.
 */
class CustomOrbitControls {
  private camera: THREE.Camera;
  private focus: Position;
  private theta: number;
  private phi: number;
  private distance: number;

  /**
   * @brief Creates a new CustomOrbitControls that control the given camera.
   * @param camera The camera to be controller by these controls.
   */
  constructor(camera: THREE.Camera) {
    this.camera = camera;
    this.focus = new Position(0, 0, 0);
    this.resetCameraPosition();
    PointsCounterView.setShowing(true);
  }

  /**
   * @brief Changes the position that the camera is orbiting around.
   * @param newFocus New position to orbit around.
   */
  public changeFocus(newFocus: Position): void {
    this.focus = newFocus;
    this.adjustCamera();
  }

  /**
   * @brief Changes the angle from which the camera is looking by the given
   *        amounts, clamping the azimuthal angle to [0, Math.PI].
   * @param thetaOffset Amount to add to the polar angle.
   * @param phiOffset Amount to add to the azimuthal angle.
   */
  public changeAngle(thetaOffset: number, phiOffset: number): void {
    const MIN_PHI = 0;
    const MAX_PHI = Math.PI;
    this.theta = this.theta + thetaOffset;
    this.phi = Math.min(MAX_PHI, Math.max(MIN_PHI, this.phi + phiOffset));
    this.adjustCamera();
  }

  /**
   * @brief Changes the distance from the camera to the focused object by the
   *        given amount. Clamps the distance to [5, 20].
   * @param distanceOffset Amount to add to the distance.
   */
  public changeDistance(distanceOffset: number): void {
    const MIN_DISTANCE = 5;
    const MAX_DISTANCE = 20;
    this.distance = Math.min(
      MAX_DISTANCE,
      Math.max(MIN_DISTANCE, this.distance + distanceOffset)
    );
    this.adjustCamera();
  }

  /**
   * @brief Resets the values associated to the angle and distance of the
   *        camera to its original values.
   */
  public resetCameraPosition(): void {
    this.theta = 0;
    this.phi = Math.PI / 2;
    this.distance = 10;
    this.adjustCamera();
  }

  /**
   * @brief Adjusts the position of the Three.js camera object to match the
   *        angle, distance and focus stored by the controls.
   */
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
  private snakeMaterial: THREE.Material;
  private foodMaterial: THREE.Material;
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
    this.snakeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    this.foodMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
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
    this.controls.changeAngle(thetaOffset, phiOffset);
  }

  /**
   * @brief Changes the distance from the camera to the focused object by the
   *        given amount. Clamps the distance to [5, 20].
   * @param distanceOffset Amount to add to the distance.
   */
  public changeDistance(distanceOffset: number): void {
    this.controls.changeDistance(distanceOffset);
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
}

export { GameView };
