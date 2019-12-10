import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './components/Counter';
import { storeConfigs } from './store/index';
import { createStore, getStore } from '../src/index';
import 'antd/dist/antd.css';
createStore.init(storeConfigs);
createStore.isLogger();

console.log('store is', getStore());

ReactDOM.render(<Counter/>, document.getElementById('root'));