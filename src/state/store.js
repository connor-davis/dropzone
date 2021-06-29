import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import { downloadsSlice } from './downloads.slice';
import { friendsSlice } from './friends.slice';
import { messagesSlice } from './messages.slice';
import storage from 'redux-persist/lib/storage';
import { themeSlice } from './theme.slice';
import { uploadsSlice } from './uploads.slice';
import { userSlice } from './user.slice';

let userReducer = userSlice.reducer;
let downloadsReducer = downloadsSlice.reducer;
let uploadsReducer = uploadsSlice.reducer;
let friendsReducer = friendsSlice.reducer;
let messagesReducer = messagesSlice.reducer;
let themeReducer = themeSlice.reducer;

let persistConfig = {
  key: 'root',
  storage,
};


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
  themeReducer,
});

let persistedReducer = persistReducer(persistConfig, rootReducer);

let store = configureStore({
  reducer: persistedReducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
    loggerMiddleware,
  ],
});

let persistor = persistStore(store);

export { store, persistor };
