import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import App from './App'
import ErrorBoundary from './ErrorBoundary'
import * as serviceWorker from './serviceWorker';
import _ from 'lodash'

import { Provider } from "react-redux";
import store from "./store"
import ByPass from './lib/ByPass'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContextProvider } from 'react-dnd'
import {Store, StoreProvider} from './contexts'
//import MouseController from './MouseController'
import SimpleDb from './SimpleDb'

import myData from './data.json' // Used for the demo on github pages

const theStore = !_.isEmpty(myData) ? new Store(myData) : new Store({}, new SimpleDb())

//import KeyController from './KeyController'
//<KeyController>
//</KeyController>
//<MouseController>
//</MouseController>
ReactDOM.render(
  <StoreProvider store={theStore}>
  <Provider store={store}>
    <DragDropContextProvider backend={HTML5Backend}>
        <ByPass if={process.env.NODE_ENV === 'development'}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </ByPass>
    </DragDropContextProvider>
  </Provider>
  </StoreProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
