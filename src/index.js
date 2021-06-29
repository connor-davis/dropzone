import './index.css';

import * as serviceWorker from './serviceWorker';

import { persistor, store } from './state/store';

import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={() => <div>Loading</div>}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
