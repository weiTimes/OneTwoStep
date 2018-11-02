import { Game } from './Game';

const { ccclass, property } = cc._decorator;

@ccclass
export class OverPanel extends cc.Component {
  @property(cc.Label)
  private scoreLabel: cc.Label = null;

  private game: Game;

  public init(game: Game) {
    this.game = game;
  }

  private onBtnRestart() {
    this.game.restartGame();
  }

  private onBtnReturnMenu() {
    this.game.returnMenu();
  }

  public show(score: number) {
    this.node.active = true;
    this.scoreLabel.string = `${score}`;
  }

  public hide() {
    this.node.active = false;
  }
}
