import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ImprovedApp from './ImprovedApp';
import * as serviceWorker from './serviceWorker';

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContextProvider } from 'react-dnd'

import Firebase from './Firebase'
let db = new Firebase()

ReactDOM.render(
  <DragDropContextProvider backend={HTML5Backend}>
    <ImprovedApp db={db}/>
  </DragDropContextProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
