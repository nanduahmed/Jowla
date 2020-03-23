import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'firebase/performance';
import 'bootstrap/dist/css/bootstrap.min.css';


import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import ziyaraatReducer from './redux/reducers'

export const firebaseConfig = {
  apiKey: "AIzaSyApnuz-cAf8tBb_7wm9GdPAKYAWTGqGtrU",
  authDomain: "ziyaraat-test.firebaseapp.com",
  databaseURL: "https://ziyaraat-test.firebaseio.com",
  projectId: "ziyaraat-test",
  storageBucket: "ziyaraat-test.appspot.com",
  messagingSenderId: "125259738471",
  appId: "1:125259738471:web:bad866477becec283393c2",
  measurementId: "G-KRLLH03BGK"
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  ziyaraatReducer,
  composeEnhancers(
    applyMiddleware(thunk)
  )
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
