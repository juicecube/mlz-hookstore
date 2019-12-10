
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
