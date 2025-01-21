import { Position } from "./Position";

/**
 * @brief Represents a piece of food in the snake game.
 */
class Food {
  private location: Position;

  /**
   * @brief Creates a new piece of food with the given position.
   * @param location The position to create the food at.
   */
  constructor(location: Position) {
    this.location = location;
  }

  /**
   * @brief Produces the location where the food is located.
   * @returns Position where the food is located.
   */
  public getLocation(): Position {
    return this.location;
  }
}

export { Food };
