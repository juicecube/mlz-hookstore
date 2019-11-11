import { QueueType } from './type';

const queue:QueueType = {};

export const dispatch = (namespace:string, state:number) => {
  // 如果queue已存在namespace
  if (!queue[namespace]) { return; }
  // queue只会针对对应的namespace里的触发setState(即组件更新)
  queue[namespace].forEach((setState:(state:number) => void) => setState(state));
};

export const subScribe = (namespace:string, setState:React.Dispatch<any>) => {
  if (!queue[namespace]) { queue[namespace] = []; }
  queue[namespace].push(setState);
};

export const unSubScribe = (namespace:string, setState:React.Dispatch<any>) => {
  if (!queue[namespace]) { return; }

  // 获取函数的reference
  const positionIndex:number = queue[namespace].indexOf(setState);
  const noIndex = -1;
  if (positionIndex !== noIndex) { queue[namespace].splice(positionIndex, 1); }
};