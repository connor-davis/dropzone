import { applyMiddleware, createStore } from 'redux';

import { combineReducers } from '@reduxjs/toolkit';
import { downloadsSlice } from './downloads.slice';
import { friendsSlice } from './friends.slice';
import { messagesSlice } from './messages.slice';
import { uploadsSlice } from './uploads.slice';
import { userSlice } from './user.slice';

let userReducer = userSlice.reducer;
let downloadsReducer = downloadsSlice.reducer;
let uploadsReducer = uploadsSlice.reducer;
let friendsReducer = friendsSlice.reducer;
let messagesReducer = messagesSlice.reducer;

function loggerMiddleware(_) {
  return function (next) {
    return function (action) {
      next(action);
    };
  };
}

const rootReducer = combineReducers({
  userReducer,
  downloadsReducer,
  uploadsReducer,
  friendsReducer,
  messagesReducer,
});

let store = createStore(rootReducer, applyMiddleware(loggerMiddleware));

export default store;
