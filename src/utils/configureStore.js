/* @flow */
/* global ErrorUtils */
import _ from 'lodash';
/* Redux */
import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native

import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

import reducers from '../reducers';

const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, reducers);
const composeEnhancers = composeWithDevTools({});

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  blacklist: ['shipmentReducer']
};

export const configureStore = () => {
  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(logger, thunk)));
  const persistor = persistStore(store);

  return {
    store,
    persistor
  };
};

export default configureStore;
