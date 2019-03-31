import { combineReducers } from 'redux';
import dataReducer from './dataReducer';
import ChatReducer from './ChatReducer';
import authReducer from './authReducer';

export default combineReducers({
  dataReducer,
  ChatReducer,
  authReducer
});
