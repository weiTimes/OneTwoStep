const { ccclass, property } = cc._decorator;

@ccclass
export class Menu extends cc.Component {
  private onBtnStart() {
    cc.director.loadScene('game');
  }
}
