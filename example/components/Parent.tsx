import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { createStore, connect, getStore } from '../../src/index';
import Wrapper from './wrapper';

export function sleep(time:number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('async data');
    }, time);
  });
}

createStore.isLogger();
createStore.createStores([
  {
    namespace: 'moduleA',
    state: {
      count: 0,
      asyncData: '',
      effectData: 'init effectData',
      otherData: 'init',
    },
    action: {
      addCount() {
        this.state.count++;
      },
      minusCount() {
        this.state.count--;
      },
      changedOtherData() {
        this.state.otherData = 'cool';
      },
      async fetch () {
        const res = await sleep(3000);
        this.state.asyncData = res;
      },
      setEffectData() {
        this.state.effectData = 'changed';
      },
      setModuleB() {
        console.log('moduleB.state.data', getStore('moduleB').state.data);
        getStore('moduleB').action.setState();
      },
    },
  },
  {
    namespace: 'moduleB',
    state: {
      data: 'muduleB-Data',
    },
    action: {
      setState() {
        this.state.data = 'changed';
      },
    },
  },
]);

export default function Parent() {
  return (
    <div style={{
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Wrapper>
        <h2>同级组件测试</h2>
        <A />
        <hr/>
        <B />
      </Wrapper>
      <Wrapper>
        <h2>父子组件测试</h2>
        <ParentA />
      </Wrapper>
    </div>
  );
}

function AStore(props:any) {
  return (
    <div>
      A组件<br/>
      <span data-testid="A.count">count: {props.count}</span><br/>
      <span data-testid="A.asyncData">asyncData: {props.asyncData}</span><br/>
      <Button data-testid="A.addCount" onClick={() => {props.addCount(); }}>+++</Button><br/>
      <Button data-testid="A.minusCount" onClick={() => {props.minusCount(); }}>---</Button><br/>
      <Button onClick={() => {props.changedOtherData(); }}>改变state.other</Button><br/>
      <Button data-testid="A.fetch" onClick={() => {props.fetch(); }} loading={props.fetchLoading}>异步</Button><br/>
      <Button data-testid="A.setModuleB" onClick={() => {props.setModuleB(); }}>通过moduleA的方法获取moduleB的值设置muduleB的值</Button><br/>
    </div>
  );
}
const A = connect(AStore, ({ moduleA }:any) => ({
  count: moduleA.state.count,
  asyncData: moduleA.state.asyncData,
  addCount: moduleA.action.addCount,
  minusCount: moduleA.action.minusCount,
  changedOtherData: moduleA.action.changedOtherData,
  fetch: moduleA.action.fetch,
  setModuleB: moduleA.action.setModuleB,
  fetchLoading: moduleA.action.fetch.loading,
}));

function BStore(props:any) {
  // console.log('B组件 render')
  return (
    <div>
      B组件<br/>
      <span data-testid="B.count">count: {props.count}</span><br/>
      <span data-testid="B.moduleB.data">moduleB.data: {props.data}</span><br/>
    </div>
  );
}
const B = connect(BStore, ({ moduleA, moduleB }:any) => ({
  count: moduleA.state.count,
  data: moduleB.state.data,
}));

function ParentStore(props:any) {
  const [pass, setPass] = useState(123);

  return (
    <div>
      <hr/>
      <h2>父组件</h2>
      <span>count: {props.count}</span>
      <Button data-testid="ParentStore.changedPass" onClick={() => {
        setPass(Math.random());
      }}>改变传入子组件的值</Button>

      <hr/>
      <h2>子组件</h2>
      <Child pass={pass}/>
    </div>
  );
}
const ParentA = connect(ParentStore, ({ moduleA }:any) => ({
  count: moduleA.state.count,
}));

interface PropsType {
  pass:number;
  count:number;
  effectData:string;
  addCount:() => void;
  setEffectData:() => void;
}
function ChildStore(props:PropsType) {
  useEffect(() => {
    props.setEffectData();
  }, []);

  return (
    <div>
      <div data-testid="ChildStore.pass">props.pass: {props.pass}</div>
      <div>props.count: {props.count}</div>
      <div data-testid="ChildStore.effectData">props.effectData: {props.effectData}</div>
    </div>
  );
}
const Child = connect<PropsType>(ChildStore, ({ moduleA }:any) => ({
  count: moduleA.state.count,
  effectData: moduleA.state.effectData,
  addCount: moduleA.action.addCount,
  setEffectData: moduleA.action.setEffectData,
}));