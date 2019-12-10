# mlz-hookstore
使用hooks实现的极简数据管理方案

## 安装
```js
npm install @mlz/hookstore --save
```
## API

#### createStore(config:CreateStoreConfig)
创建一个store
```js
import { createStore } from '@mlz/hookstore';
createStore({
  namespace: 'demoStore',
  state: {
    num:0,
  },
  action: {
    addNum(this:IDEMOStore, num) {
      this.state.num += num;
    },
  },
})
```

#### connect(Component, mapStateToProps)
组件连接store
```js
export default connect(Index, ({ demoStore }:IStoreConfigs) => {
  return {
    num: demoStore.state.num,
    addNum: demoStore.action.addNum,
  };
});

```

#### getStore(namespace?:string)
获取当前store
```js
const store = getStore();
```


## 最简demo
可在项目中运行`npm run start`查看完整实例

1. 创建demo store
```js
export const DEMOSTORE = 'demoStore';

// 定义demeStore的state
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
```
2. 在入口文件中初始化store
```js
import { storeConfigs } from './store/index';
import { createStore, getStore } from '../src/index';

createStore.init(storeConfigs);
```

3. 组件中使用store
```js
import * as React from 'react';
import { connect } from '../../src/index';
import { IDemoAction } from '../store/demo';
import { IStoreConfigs } from '../store/index';
interface IDemoProps extends IDemoAction {
  num:number;
}

const Index:React.SFC<IDemoProps> = (props) => {
  const { num, addNum, minNum } = props;
  return (
    <div>
      <h1>This is a demo.</h1>
      <div>
        <span>{num}</span>
        <button onClick={() => {addNum(1); }}>+</button>
        <button onClick={() => {minNum(1); }}>-</button>
      </div>
    </div>
  );
};

export default connect(Index, ({ demoStore }:IStoreConfigs) => {
  return {
    num: demoStore.state.num,
    addNum: demoStore.action.addNum,
    minNum: demoStore.action.minNum,
  };
});
```