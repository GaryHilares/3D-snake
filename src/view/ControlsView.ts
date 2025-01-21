class ControlsView {
  private static controlsMenuDomId = "controls-menu";

  public static setShowing(shouldShow: boolean): void {
    document.getElementById(this.controlsMenuDomId)!.style.visibility =
      shouldShow ? "visible" : "hidden";
  }
}

export { ControlsView };
