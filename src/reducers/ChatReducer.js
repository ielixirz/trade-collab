import {
  FETCH_CHAT,
  TYPING_TEXT,
  moveTab,
  FETCH_CHAT_ROOMS,
  SEND_MESSAGE,
  FETCH_CHAT_MEMBER,
  TOGGLE_LOAD,
  SELECT_ROOM,
  TOGGLE_CHAT,
  NEW_ROOM
} from '../constants/constants';
import _ from 'lodash';
const ShipmentKey = 'HDTPONlnceJeG5yAA1Zy';
const ChatRoomKey = 'lvCb608c7PusGqptBsq0';

const INITIAL_STATE = {
  text: '',
  chatrooms: {},
  chatroomsMsg: {},
  msg: {},
  toggle: true,
  createChat: true,
  selectedChat: '',
  lastCreatedChat: '',
  chatroomsOrder: {}
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPING_TEXT:
      return {
        ...state,
        text: action.text
      };
    case TOGGLE_LOAD:
      return {
        ...state,
        toggle: action.payload
      };
    case TOGGLE_CHAT:
      return {
        ...state,
        createChat: action.payload
      };
    case FETCH_CHAT:
      return {
        ...state,
        chatroomsMsg: {
          ...state.chatroomsMsg,
          [action.id]: {
            chatMsg: _.reverse(action.payload)
          }
        }
      };
    case moveTab:
      return {
        ...state,
        chatrooms: {
          ...action.payload
        }
      };
    case SELECT_ROOM:
      return {
        ...state,
        selectedChat: action.payload
      };
    case NEW_ROOM:
      return {
        ...state,
        lastCreatedChat: action.payload
      };
    case FETCH_CHAT_ROOMS:
      return {
        ...state,
        chatrooms: {
          ...action.payload
        }
      };
    case SEND_MESSAGE:
      return {
        ...state,
        msg: {
          ...action.payload
        }
      };
    case FETCH_CHAT_MEMBER:
      return {
        ...state,
        chatrooms: {
          ...state.chatrooms,
          [action.id]: {
            ...state.chatrooms[action.id],
            member: action.payload
          }
        }
      };
    default:
      return state;
  }
};
