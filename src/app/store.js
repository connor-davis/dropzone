import { applyMiddleware, createStore } from 'redux'

import { combineReducers } from '@reduxjs/toolkit'
import { connectionSlice } from './slices/connection'
import { discoveryChannelSlice } from './slices/discoveryChannel'
import { downloadsSlice } from './slices/downloads'
import { uploadsSlice } from './slices/uploads'

let connectionReducer = connectionSlice.reducer
let discoveryChannelReducer = discoveryChannelSlice.reducer
let downloadsReducer = downloadsSlice.reducer
let uploadsReducer = uploadsSlice.reducer

function loggerMiddleware(store) {
    return function (next) {
        return function (action) {
            next(action)
        }
    }
}

const rootReducer = combineReducers({
    connectionReducer,
    discoveryChannelReducer,
    downloadsReducer,
    uploadsReducer,
})

let store = createStore(rootReducer, applyMiddleware(loggerMiddleware))

export default store
