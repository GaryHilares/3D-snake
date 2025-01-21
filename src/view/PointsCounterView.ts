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

export { PointsCounterView };
