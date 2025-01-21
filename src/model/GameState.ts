import type { GameStateObserver } from "./GameStateObserver";
import { GameStateObservable } from "./GameStateObservable";
import { ExclusiveRandomPositionGenerator } from "./ExclusiveRandomPositionGenerator";
import { Direction } from "./Direction";
import { Food } from "./Food";
import { Snake, GAME_BOX_SIDE } from "./Snake";

/**
 * @brief Represents a game state in the snake game.
 */
class GameState {
  private observable: GameStateObservable;
  private snake: Snake;
  private foods: Food[];
  private points: number;
  private gameover: boolean;
  private rng: ExclusiveRandomPositionGenerator;

  /**
   * @brief Creates a new game state, with the given observers.
   * @param observers Observers that will observe this game state.
   */
  constructor(observers: GameStateObserver[] = []) {
    const FOOD_AMOUNT = 10;
    this.rng = new ExclusiveRandomPositionGenerator((GAME_BOX_SIDE - 1) / 2);
    this.observable = new GameStateObservable(observers);
    this.snake = new Snake(this.observable, this.rng);
    this.foods = [];
    this.points = 0;
    this.gameover = false;
    for (let i = 0; i < FOOD_AMOUNT; i++) {
      this.replaceFood();
    }
    this.observable.notifyPointsChanged(this.points);
  }

  /**
   * @brief Proceeds to the next state.
   */
  public goToNextState(): void {
    const consumedFoodIndex = this.indexOfFoodToBeEaten();
    if (consumedFoodIndex == -1) {
      this.snake.moveAndNotGrow();
    } else {
      this.replaceFood(consumedFoodIndex);
      this.snake.moveAndGrow();
      this.increasePoints();
    }
    if (this.isNowGameOver()) {
      this.gameover = true;
      const storedHighscore = window.localStorage.getItem("highscore");
      const oldHighscore = storedHighscore ? parseInt(storedHighscore) : 0;
      const highscore = Math.max(this.points, oldHighscore);
      const storedRun = window.localStorage.getItem("localRun");
      const oldRun = storedRun ? parseInt(storedRun) : 0;
      const run = oldRun + 1;
      window.localStorage.setItem("highscore", highscore.toString());
      window.localStorage.setItem("localRun", run.toString());
      fetch("https://3-d-snake-api.vercel.app/submit-run", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score: this.points }),
      })
        .then((response) => response.json())
        .then((response: { runCount: number; highscore: number }) => {
          console.log(response);
          this.observable.notifyGameover(
            run,
            response.runCount,
            this.points,
            highscore,
            response.highscore
          );
        })
        .catch(() => {
          this.observable.notifyGameover(run, NaN, this.points, highscore, NaN);
        });
    }
  }

  /**
   * @brief Sets the snake to face a new direction.
   * @param direction The new direction for the snake.
   */
  public tryToSetSnakeDirection(direction: Direction) {
    this.snake.tryToSetDirection(direction);
  }

  public isGameover(): boolean {
    return this.gameover;
  }

  /**
   * @brief Checks whether the game is over (i.e. whether the snake has eaten
   *        itself).
   * @returns True if the game is over, false otherwise.
   */
  private isNowGameOver() {
    return (
      this.snake.isHeadCrossingBody() || this.snake.isHeadOutOfGameBounds()
    );
  }

  /**
   * @brief Increases the amount of points and notifies observers about it.
   */
  private increasePoints(): void {
    this.points++;
    this.observable.notifyPointsChanged(this.points);
  }

  /**
   * @brief Replaces a piece of food with a new one, then notifies observers.
   * @param idx Index of food to replace, or -1 if no piece of food should be
   *        replaced (but a new one should still be added).
   */
  private replaceFood(idx: number = -1): void {
    if (idx != -1) {
      this.observable.notifyFoodLeft(this.foods[idx].getLocation());
    }
    const newFood = this.createRandomFood();
    if (idx != -1) {
      this.rng.addOcuppated(newFood.getLocation());
      this.foods[idx] = newFood;
    } else {
      this.rng.addOcuppated(newFood.getLocation());
      this.foods.push(newFood);
    }
    this.observable.notifyFoodEntered(newFood.getLocation());
  }

  /**
   * @brief Finds the index of the food that will be eaten by the snake next.
   * @returns Index of the food that will be eaten by the snake, or -1 if none.
   */
  private indexOfFoodToBeEaten(): number {
    return this.foods.findIndex((food) => {
      return this.snake.willEatFoodNext(food);
    });
  }

  /**
   * @brief Produces a piece of food with given index.
   * @returns A new piece of food at random position.
   */
  private createRandomFood(): Food {
    const pos = this.rng.generate();
    return new Food(pos);
  }
}

export { GameState };
