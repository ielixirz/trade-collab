import { combineReducers } from 'redux';
import dataReducer from './dataReducer';
import ChatReducer from './ChatReducer';
import authReducer from './authReducer';
import FileReducer from './FileReducer';
import shipmentReducer from './shipmentReducer';
import profileReducer from './profileReducer';
import companyReducer from './companyReducer';
import userReducer from './userReducer';

export default combineReducers({
  dataReducer,
  ChatReducer,
  authReducer,
  FileReducer,
  shipmentReducer,
  profileReducer,
  userReducer,
  companyReducer
});
