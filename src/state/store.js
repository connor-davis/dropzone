import {
  combineReducers,
  configureStore,
  getDefaultMiddleware
} from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import storage from 'redux-persist/lib/storage';
import { themeSlice } from './theme.slice';
import { userSlice } from './user.slice';

let userReducer = userSlice.reducer;
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

