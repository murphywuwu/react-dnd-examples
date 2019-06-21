import React from 'react';
import ReactDOM from 'react-dom';
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import './index.css';
// import App from './App';
// import App from './examples-hook/00-chessboard';
// import App from './examples-hook/01-dustbin/copy-or-move';
// import App from './examples-hook/01-dustbin/multiple-targets';
// import App from './examples-hook/01-dustbin/single-target';
// import App from './examples-hook/01-dustbin/single-target-in-iframe';
// import App from './examples-hook/01-dustbin/stress-test';
// import App from './examples-hook/02-drag-around/custom-drag-layer';
// import App from './examples-hook/02-drag-around/naive'
// import App from './examples-hook/03-nesting/drag-sources'
// import App from './examples-hook/03-nesting/drop-targets';
// import App from './examples-hook/04-sortable/cancel-on-drop-outside';
// import App from './examples-hook/04-sortable/simple';
// import App from './examples-hook/05-customize/drop-effects';
// import App from './examples-hook/05-customize/handles-and-previews';
import App from './examples-hook/06-other/drag-source-rerender';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <DndProvider backend={HTML5Backend}>
    <App />
  </DndProvider>,
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
