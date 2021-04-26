import { applyMiddleware, createStore } from 'redux'

import { combineReducers } from '@reduxjs/toolkit'
import { downloadsSlice } from './slices/downloads'
import { friendsSlice } from './slices/friends'
import { messagesSlice } from './slices/messages'
import { uploadsSlice } from './slices/uploads'
import { userSlice } from './slices/user'
import { zonesSlice } from './slices/zones'

let userReducer = userSlice.reducer
let downloadsReducer = downloadsSlice.reducer
let uploadsReducer = uploadsSlice.reducer
let zonesReducer = zonesSlice.reducer
let friendsReducer = friendsSlice.reducer
let messagesReducer = messagesSlice.reducer

function loggerMiddleware(store) {
    return function (next) {
        return function (action) {
            next(action)
        }
    }
}

const rootReducer = combineReducers({
    userReducer,
    downloadsReducer,
    uploadsReducer,
    zonesReducer,
    friendsReducer,
    messagesReducer,
})

let store = createStore(rootReducer, applyMiddleware(loggerMiddleware))

export default store
