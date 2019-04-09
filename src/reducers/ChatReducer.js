import { FETCH_CHAT, TYPING_TEXT, moveTab } from '../constants/constants';

const ShipmentKey = 'HDTPONlnceJeG5yAA1Zy';
const ChatRoomKey = 'lvCb608c7PusGqptBsq0';

const INITIAL_STATE = {
  text: '',
  chatrooms: {
    [ChatRoomKey]: {
      ChatRoomKey,
      ShipmentKey,
      roomName: 'Exporter',
      chatMsg: [],
      active: true,
    },
  },
};
export default (state = INITIAL_STATE, action) => {
  console.log(action);
  switch (action.type) {
    case TYPING_TEXT:
      return {
        ...state,
        text: action.text,
      };
    case FETCH_CHAT:
      return {
        ...state,
        chatrooms: {
          ...state.chatrooms,
          [action.id]: {
            ...state.chatrooms[action.id],
            chatMsg: action.payload,
          },
        },
      };
    case moveTab:
      return {
        ...state,
        chatrooms: {
          ...action.payload,
        },
      };
    default:
      return state;
  }
};
