export const DEMOSTORE = 'demoStore';

// 定义小store的state
export interface IDemoState {
  num:number;
}

export interface IDemoAction {
  addNum:(num:number) => void;
  minNum:(num:number) => void;
}
export interface IDEMOStore {
  namespace:typeof DEMOSTORE;
  state:IDemoState;
  action:IDemoAction;
}

export const demoStore:IDEMOStore = {
  namespace: DEMOSTORE,
  state: {
    num:0,
  },
  action: {
    addNum(this:IDEMOStore, num) {
      this.state.num += num;
    },
    minNum(this:IDEMOStore, num) {
      this.state.num -= num;
    },
  },
};