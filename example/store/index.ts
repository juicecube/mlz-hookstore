import { demoStore, IDEMOStore } from './demo';

// stores的type定义
export interface IStoreConfigs {
  demoStore:IDEMOStore;
}

// 导出所有子store的配置
export const storeConfigs = [
  demoStore,
];