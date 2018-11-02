/*
 * @Author: 叶威 
 * @Date: 2018-10-31 11:03:45 
 * @Last Modified by: 叶威
 * @Last Modified time: 2018-11-02 17:38:47
 * 
 * 控制关键的逻辑
 * 如: 开始游戏、结束游戏、增加分数、全局事件
 */
import { Stage } from './Stage';
import { OverPanel } from './OverPanel';

const { ccclass, property } = cc._decorator;

@ccclass
export class Game extends cc.Component {
  @property(Stage)
  private stage: Stage = null;
  @property(cc.Label)
  private scoreLabel: cc.Label = null;
  @property(OverPanel)
  private overPanel: OverPanel = null;

  private score: number = 0;

  protected start() {
    this.overPanel.init(this);
    this.overPanel.hide();
    this.startGame();

    this.addListeners();
  }
  /**
   * 开始游戏
   *
   * @memberof Game
   */
  public startGame() {
    this.score = 0;
    this.scoreLabel.string = '0';
    this.stage.init(this); // 初始化舞台组件
  }

  /**
   * 增加分数
   *
   * @param {number} n
   * @memberof Game
   */
  public addScore(n: number) {
    this.score += n;
    this.scoreLabel.string = `${this.score}`;
  }

  /**
   * 结束游戏
   *
   * @memberof Game
   */
  public overGame() {
    this.overPanel.show(this.score);
  }

  /**
   * 重新开始游戏
   *
   * @memberof Game
   */
  public restartGame() {
    cc.director.loadScene('game');
  }

  /**
   * 回到菜单
   *
   * @memberof Game
   */
  public returnMenu() {
    cc.director.loadScene('menu');
  }

  private addListeners() {
    cc.systemEvent.on(
      cc.SystemEvent.EventType.KEY_DOWN,
      (event: cc.Event.EventKeyboard) => {
        if (event.keyCode === cc.macro.KEY.left) {
          this.onBtnOne();
        } else if (event.keyCode === cc.macro.KEY.right) {
          this.onBtnTwo();
        }
      },
      this
    );
  }

  private onBtnOne() {
    this.stage.playerJump(1);
  }

  private onBtnTwo() {
    this.stage.playerJump(2);
  }
}
