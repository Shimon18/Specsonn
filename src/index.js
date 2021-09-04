import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './global.js';
import './_apiSettings/_api-productGets';
import './_apiSettings/_api-signIn';
import './_apiSettings/_api-userDashContoll';
import App from './App';
import * as serviceWorker from './serviceWorker';



ReactDOM.render(<App />, document.getElementById('App'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
