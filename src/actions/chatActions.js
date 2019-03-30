import { TYPING_TEXT } from '../constants/constants';

export const typing = data => dispatch => {
  let text = data.target.value;
  dispatch({
    type: TYPING_TEXT,
    text: text
  });
};
