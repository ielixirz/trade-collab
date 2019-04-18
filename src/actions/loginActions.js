import { FILL_CREDENCIAL, SAVE_CREDENCIAL } from '../constants/constants';
import { LoginWithEmail } from '../service/auth/login';

export const typinglogin = data => (dispatch) => {
  const [value] = data.target.value;
  const payload = data.target.id;
  dispatch({
    type: FILL_CREDENCIAL,
    payload,
    value,
  });
};

export const login = data => (dispatch) => {
  const { email, password } = data;
  LoginWithEmail(email, password).subscribe({
    next: (res) => {
      dispatch({
        type: SAVE_CREDENCIAL,
        payload: res.user,
      });

      window.location.replace('/');
    },
    error: (err) => {
      console.log(err);
      alert(err.message);
    },
    complete: () => {},
  });
};
