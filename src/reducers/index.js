import { combineReducers } from 'redux';
import dataReducer from './dataReducer';
import ChatReducer from './ChatReducer';

export default combineReducers({
  dataReducer,
  ChatReducer
});
