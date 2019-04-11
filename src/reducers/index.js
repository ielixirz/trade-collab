import { combineReducers } from 'redux';
import dataReducer from './dataReducer';
import ChatReducer from './ChatReducer';
import authReducer from './authReducer';
import FileReducer from './FileReducer';

export default combineReducers({
  dataReducer,
  ChatReducer,
  authReducer,
  FileReducer,
});
