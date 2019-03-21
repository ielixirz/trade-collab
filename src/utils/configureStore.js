/* @flow */
/* global ErrorUtils */
import _ from 'lodash';
/* Redux */
import { createStore, applyMiddleware, compose } from 'redux';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native

import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

import reducers from '../reducers';

const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const configureStore = () => {
  const store = createStore(persistedReducer, applyMiddleware(thunk));
  let persistor = persistStore(store);

  return { store, persistor };
};
