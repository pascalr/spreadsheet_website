import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import App from './App'
import ErrorBoundary from './ErrorBoundary'
import * as serviceWorker from './serviceWorker';

import { Provider } from "react-redux";
import store from "./store"
import ByPass from './lib/ByPass'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContextProvider } from 'react-dnd'

ReactDOM.render(
  <Provider store={store}>
    <DragDropContextProvider backend={HTML5Backend}>
      {/*<Router>*/}
        <ByPass if={process.env.NODE_ENV === 'development'}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </ByPass>
        {/*</Router>*/}
    </DragDropContextProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
