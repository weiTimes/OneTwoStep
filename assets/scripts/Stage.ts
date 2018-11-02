import { Player } from './Player';
import { Block } from './Block';
import { Game } from './Game';

const { ccclass, property } = cc._decorator;

@ccclass
export class Stage extends cc.Component {
  @property(cc.Integer)
  private stepDistance: number = 200;
  @property(cc.Integer)
  private jumpHeight: number = 100;
  @property(cc.Float)
  private jumpDuration: number = 0.3;
  @property(cc.Integer)
  private fallHeight: number = 500;
  @property(cc.Float)
  private fallDuration: number = 0.3;
  @property(cc.Float)
  private initStayDuration: number = 2; // 初始停留时间
  @property(cc.Float)
  private minStayDuration: number = 0.3; // 最小停留时间，不能再快了的那个点，不然玩家就反应不过来了
  @property(cc.Float)
  private speed: number = 0.1;

  @property(Player)
  private player: Player = null;

  @property(cc.Prefab)
  private blockPrefab: cc.Prefab = null; // 编辑器属性引用

  private game: Game = null;

  private lastBlock = true; // 记录上一次是否添加了Block
  private lastBlockX = 0; // 记录上一次添加Block的x坐标
  private blockList: Array<Block>; // 记录添加的Block列表
  private stayDuration: number; // 停留时间

  public init(game: Game) {
    this.game = game;
    this.stayDuration = this.initStayDuration;
    this.player.init(
      this.stepDistance,
      this.jumpHeight,
      this.jumpDuration,
      this.fallDuration,
      this.fallHeight
    );

    this.blockList = [];
    this.addBlock(cc.v2(0, -177)); // 初始化第一个块
    // 随机添加5个区块(包含空)
    for (let i = 0; i < 5; i++) {
      this.randomAddBlock();
    }
  }

  public playerJump(step: number) {
    if (this.player.canJump) {
      this.player.jump(step);
      this.moveStage(step); // 移动场景(player && block)，随机生成一个区块
      let isDead = !this.hasBlock(this.player.index); // 跳到的下一个位置不是区块则表示死亡
      if (isDead) {
        cc.log('die');
        // 这时还在空中，要等到落到地面在执行死亡动画
        this.scheduleOnce(() => {
          this.player.die();
          this.game.overGame();
        }, this.jumpDuration);
      } else {
        let blockIndex = this.player.index; // 保存当前player的index
        this.blockList[blockIndex].init(
          this.fallDuration,
          this.fallHeight,
          this.stayDuration,
          () => {
            // 区块下落结束时player还在上面则死亡
            // player 的index在回调函数之后调用会更改(玩家执行跳跃动作)
            if (this.player.index === blockIndex) {
              this.player.die();
              this.game.overGame();
            }
          }
        );
        this.game.addScore(step === 1 ? 1 : 3); // 跳一步得一份，跳两步得三分
      }
      if (this.player.index % 10 === 0) {
        // 增加难度
        this.addSpeed();
      }
    }
  }

  public addSpeed() {
    this.stayDuration -= this.speed;
    if (this.stayDuration <= this.minStayDuration) {
      this.stayDuration = this.minStayDuration;
    }
    cc.log(this.stayDuration);
  }

  private moveStage(step: number) {
    let moveAction = cc.moveBy(
      this.jumpDuration,
      cc.v2(-this.stepDistance * step),
      0
    );
    this.node.runAction(moveAction);
    for (let i = 0; i < step; i++) {
      this.randomAddBlock();
    }
  }

  private addBlock(position: cc.Vec2) {
    let blockNode = cc.instantiate(this.blockPrefab);
    this.node.addChild(blockNode);
    blockNode.position = position;
    this.blockList.push(blockNode.getComponent(Block));
    this.lastBlock = true;
  }

  private randomAddBlock() {
    // 如果上回添加的是块，则有二分之一概率创建块；如果上回添加的不是块，则创建一个块
    if (!this.lastBlock || Math.random() > 0.5) {
      this.addBlock(cc.v2(this.lastBlockX + this.stepDistance, -177));
    } else {
      this.addBlank();
    }

    this.lastBlockX = this.lastBlockX + this.stepDistance;
  }

  private addBlank() {
    this.blockList.push(null);
    this.lastBlock = false;
  }

  private hasBlock(index: number) {
    return this.blockList[index] !== null;
  }
}
