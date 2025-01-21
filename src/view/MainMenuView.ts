class MainMenuView {
  private static mainMenuDomId = "main-menu";

  public static setShowing(shouldShow: boolean): void {
    document.getElementById(this.mainMenuDomId)!.style.visibility = shouldShow
      ? "visible"
      : "hidden";
  }
}

export { MainMenuView };
