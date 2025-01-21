class GameoverView {
  private static menuDomId = "gameover-menu";
  private static localRunDomId = "gameover-menu--local-run-counter";
  private static globalRunDomId = "gameover-menu--global-run-counter";
  private static scoreDomId = "gameover-menu--score";
  private static highscoreDomId = "gameover-menu--highscore";
  private static globalHighscoreDomId = "gameover-menu--global-highscore";

  public static display(
    localRunCount: number,
    globalRunCount: number,
    score: number,
    highscore: number,
    globalHighscore: number
  ): void {
    const $ = document.getElementById.bind(document);
    $(this.menuDomId)!.style.visibility = "visible";
    $(this.localRunDomId)!.textContent = localRunCount.toString();
    $(this.globalRunDomId)!.textContent = globalRunCount.toString();
    $(this.scoreDomId)!.textContent = score.toString();
    $(this.highscoreDomId)!.textContent = highscore.toString();
    $(this.globalHighscoreDomId)!.textContent = globalHighscore.toString();
  }

  public static hide(): void {
    document.getElementById(this.menuDomId)!.style.visibility = "hidden";
  }
}

export { GameoverView };
