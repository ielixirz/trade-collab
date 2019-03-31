import { FILL_CREDENCIAL, SAVE_CREDENCIAL } from '../constants/constants';
import { LoginWithEmail } from '../service/auth/login';

export const typinglogin = data => dispatch => {
  let value = data.target.value;
  let payload = data.target.id;
  dispatch({
    type: FILL_CREDENCIAL,
    payload: payload,
    value: value
  });
};

export const login = data => dispatch => {
  const { email, password } = data;
  LoginWithEmail(email, password).subscribe({
    next: res => {
      dispatch({
        type: SAVE_CREDENCIAL,
        payload: res.user
      });
    },
    error: err => {
      console.log(err);
      alert(err.message);
    },
    complete: () => {}
  });
};
