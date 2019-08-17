export const TYPING_TEXT = 'TYPING_TEXT';
export const TOGGLE_LOAD = 'TOGGLE_LOAD';
export const TOGGLE_CHAT = 'TOGGLE_CHAT';
export const FILL_CREDENCIAL = 'FILL_CREDENCIAL';
export const SAVE_CREDENCIAL = 'SAVE_CREDENCIAL';
export const moveTab = 'moveTab';
export const SELECT_ROOM = 'SELECT_ROOM';
export const NEW_ROOM = 'NEW_ROOM';
export const selectTab = 'selectTab';
export const closedTab = 'closedTab';
export const addTab = 'addTab';

// Notification

export const FETCH_NOTIFICATION = 'FETCH_NOTIFICATION';

// Shipment
export const FETCH_SHIPMENT = 'FETCH_SHIPMENT';
export const FETCH_SHIPMENT_LIST = 'FETCH_SHIPMENT_LIST';
export const FETCH_SHIPMENT_LIST_DATA = 'FETCH_SHIPMENT_LIST_DATA';
export const SET_QUERY = 'SET_QUERY';
export const SEARCH_KEYWORD = 'SEARCH_KEYWORD';
export const NOTIFICATIONS = 'NOTIFICATIONS';
export const FETCH_SHIPMENT_REF_LIST = 'FETCH_SHIPMENT_REF_LIST';
export const EDIT_SHIPMENT_REF = 'EDIT_SHIPMENT_REF';
export const UPDATE_SHIPMENT_REF = 'UPDATE_SHIPMENT_REF';

export const SHIPMENT_STATUS_UPDATE_OPTIONS = [
  {
    value: {
      status: 'Planning',
    },
    label: 'Planning',
  },
  {
    value: {
      status: 'Order Confirmed',
    },
    label: 'Confirmed',
  },
  {
    value: {
      status: 'In Transit',
    },
    label: 'In Transit',
  },
  {
    value: {
      status: 'Delivered',
    },
    label: 'Delivered',
  },
  {
    value: {
      status: 'Cancelled',
    },
    label: 'Cancelled',
  },
];

// File
export const FETCH_FILES = 'FETCH_FILES';

// Chat
export const FETCH_CHAT = 'FETCH_CHAT';
export const FETCH_CHAT_MEMBER = 'FETCH_CHAT_MEMBER';
export const FETCH_CHAT_ROOMS = 'FETCH_CHAT_ROOMS';
export const SEND_MESSAGE = 'SEND_MESSAGE';

// User
export const FETCH_USER_DETAIL = 'FETCH_USER';

// Profile
export const FETCH_PROFILE_LIST = 'FETCH_PROFILE_LIST';
export const FETCH_PROFILE_DETAIL = 'FETCH_PROFILE_DETAIL';
export const CLEAR_PROFILE = 'CLEAR_PROFILE';

// Company
export const FETCH_COMPANY_DETAIL = 'FETCH_COMPANY_DETAIL';
export const FETCH_NETWORK_EMAIL = 'FETCH_NETWORK_EMAIL';
export const FETCH_COMPANY_USER = 'FETCH_COMPANY_USER';
