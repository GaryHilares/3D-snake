/**
 * @brief Represents a 3D coordinate.
 */
class Position {
  private x: number;
  private y: number;
  private z: number;

  /**
   * @brief Creates a new position with the given coordinates.
   * @param x x-coordinate of the position.
   * @param y y-coordinate of the position.
   * @param z z-coordinate of the position.
   */
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * @brief Produces the x-coordinate of this position.
   * @returns x-coordinate of this position.
   */
  getX(): number {
    return this.x;
  }

  /**
   * @brief Produces the y-coordinate of this position.
   * @returns y-coordinate of this position.
   */
  getY(): number {
    return this.y;
  }

  /**
   * @brief Produces the z-coordinate of this position.
   * @returns z-coordinate of this position.
   */
  getZ(): number {
    return this.z;
  }

  /**
   * Checks if this position is equal to the given one.
   * @param pos The other position to compare.
   * @returns True if both positions are equal, false otherwise.
   */
  equals(pos: Position): boolean {
    return this.x === pos.x && this.y === pos.y && this.z === pos.z;
  }

  /**
   * @brief Produces a string representation of this position different to that
   *        produced by toString.
   * @returns A string representation of this position.
   */
  toStringCustom(): string {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}

export { Position };
