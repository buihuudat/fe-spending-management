import { createStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import reducers from './reducers';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['admin', 'user', 'statistics'],
}

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = createStore(persistedReducer);