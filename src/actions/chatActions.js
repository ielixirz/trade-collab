import { SAVE_CREDENCIAL, TYPING_TEXT } from '../constants/constants';
import { GetChatMessage } from '../service/chat/chat';

export const typing = data => dispatch => {
  let text = data.target.value;
  dispatch({
    type: TYPING_TEXT,
    text: text
  });
};

export const fetchChatMessage = (ShipmentKey, ChatRoomKey) => dispatch => {
  GetChatMessage(ShipmentKey, ChatRoomKey).subscribe({
    next: res => {
      console.log(res);
    },
    error: err => {
      console.log(err);
      alert(err.message);
    },
    complete: () => {}
  });
};
