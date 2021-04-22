import './index.scss'

import * as serviceWorker from './serviceWorker'

import App from './App'
import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import store from './app/store'

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

serviceWorker.unregister()
