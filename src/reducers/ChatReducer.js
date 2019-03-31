import { TYPING_TEXT } from '../constants/constants';

const INITIAL_STATE = {
  text: '',
  chatroom: [
    {
      roomId: 'room1',
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
