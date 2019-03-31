import { TYPING_TEXT } from '../constants/constants';
const ShipmentKey = 'HDTPONlnceJeG5yAA1Zy';
const ChatRoomKey = 'lvCb608c7PusGqptBsq0';

const INITIAL_STATE = {
  text: '',
  chatrooms: [
    {
      ChatRoomKey: ChatRoomKey,
      ShipmentKey: ShipmentKey,
      roomName: 'Exporter',
      chatMsg: []
    }
  ]
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPING_TEXT:
      return {
        ...state,
        text: action.text
      };
    default:
      return state;
  }
};
