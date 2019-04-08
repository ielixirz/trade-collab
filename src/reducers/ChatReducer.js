import { FETCH_CHAT, TYPING_TEXT, moveTab, FETCH_CHAT_ROOMS } from '../constants/constants';
const ShipmentKey = 'HDTPONlnceJeG5yAA1Zy';
const ChatRoomKey = 'lvCb608c7PusGqptBsq0';

const INITIAL_STATE = {
  text: '',
  chatrooms: {
  }
};
export default (state = INITIAL_STATE, action) => {
  console.log(action);
  switch (action.type) {
    case TYPING_TEXT:
      return {
        ...state,
        text: action.text
      };
    case FETCH_CHAT:
      return {
        ...state,
        chatrooms: {
          ...state.chatrooms,
          [action.id]: {
            ...state.chatrooms[action.id],
            chatMsg: action.payload
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
    case FETCH_CHAT_ROOMS:
      return {
        ...state,
        chatrooms: {
          ...action.payload
        }
      };
    default:
      return state;
  }
};
