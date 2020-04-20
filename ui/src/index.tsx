import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import * as serviceWorker from './serviceWorker';
import App from './App';

import './index.css';

const url = process.env.REACT_APP_SOCKET_SERVER_URL || '';
const socket = io(url);

ReactDOM.render(
  <React.StrictMode>
    <App socket={socket} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
