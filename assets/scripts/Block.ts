const { ccclass, property } = cc._decorator;

@ccclass
export class Block extends cc.Component {
  public init(
    fallDuration: number,
    fallHeight: number,
    destroyTime: number,
    destroyCb: Function
  ) {
    // 一次性定时函数; 延迟destroyTime时间执行下落动作
    this.scheduleOnce(() => {
      let fallAction = cc.moveBy(fallDuration, cc.v2(0, -fallHeight)); // 下沉动作
      this.node.runAction(fallAction);
      destroyCb();
    }, destroyTime);
  }
}
