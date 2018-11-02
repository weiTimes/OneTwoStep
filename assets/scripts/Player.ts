const { ccclass, property } = cc._decorator;

@ccclass
export class Player extends cc.Component {
  @property({ type: cc.AudioClip })
  private oneStepAudio: cc.AudioClip = null;
  @property({ type: cc.AudioClip })
  private twoStepAudio: cc.AudioClip = null;
  @property({ type: cc.AudioClip })
  private dieAudio: cc.AudioClip = null;

  private stepDistance: number; // 一步跳跃距离
  private jumpHeight: number; // 跳跃高度
  private jumpDuration: number; // 跳跃持续时间
  private fallDuration: number; // 坠落持续时间
  private fallHeight: number; // 坠落高度
  public index: number;
  public canJump: boolean; // 此事是否能跳跃

  public init(
    stepDistance: number,
    jumpHeight: number,
    jumpDuration: number,
    fallDuration: number,
    fallHeight: number
  ) {
    this.stepDistance = stepDistance;
    this.jumpHeight = jumpHeight;
    this.jumpDuration = jumpDuration;
    this.fallDuration = fallDuration;
    this.fallHeight = fallHeight;
    this.canJump = true;
    this.index = 0;
  }

  public jump(step: number) {
    this.canJump = false;
    this.index += step;
    let jumpAction = cc.jumpBy(
      this.jumpDuration,
      cc.v2(step * this.stepDistance, 0),
      this.jumpHeight,
      1
    );
    let finishAction = cc.callFunc(() => {
      this.canJump = true;
    });
    this.node.runAction(cc.sequence(jumpAction, finishAction));

    // 添加声音
    if (step === 1) {
      cc.audioEngine.play(this.oneStepAudio, false, 1);
    } else if (step === 2) {
      cc.audioEngine.play(this.twoStepAudio, false, 1);
    }
  }

  public die() {
    this.canJump = false;
    let dieAction = cc.moveBy(this.fallDuration, cc.v2(0, -this.fallHeight));
    this.node.runAction(dieAction);

    cc.audioEngine.play(this.dieAudio, false, 1);
  }
}
