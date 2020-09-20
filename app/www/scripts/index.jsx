import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import store from './storeCtrl/store';
import App from './reactComponents/app';

function mapStateToProps(state) {
  return { ...state };
}

const AppConnected = connect(mapStateToProps)(App);

ReactDOM.render(
  <Provider store={store}>
    <AppConnected />
  </Provider>,
  document.getElementById('react')
);
