import * as THREE from "three";
import { Position } from "../model";
import { PointsCounterView } from "./PointsCounterView";

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

export { CustomOrbitControls };
