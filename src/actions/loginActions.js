import { FILL_CREDENCIAL, SAVE_CREDENCIAL } from '../constants/constants';
import { LoginWithEmail } from '../service/auth/login';
import { getUserInfoDetail } from './userActions';
import 'firebase/auth';
import { FirebaseApp } from '../service/firebase';

export const typinglogin = data => (dispatch) => {
  // eslint-disable-next-line prefer-destructuring
  const value = data.target.value;
  const payload = data.target.id;
  dispatch({
    type: FILL_CREDENCIAL,
    payload,
    value,
  });
};

export const setDefault = () => (dispatch) => {
  dispatch({
    type: SAVE_CREDENCIAL,
    payload: {},
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
      window.location.replace('#/selectprofile');
    },
    error: (err) => {
      console.log(err);
      alert(err.message);
    },
    complete: () => {},
  });
};

export const logout = () => (dispatch) => {
  FirebaseApp.auth()
    .signOut()
    .then(() => {
      dispatch({
        type: SAVE_CREDENCIAL,
        payload: {},
      });
      window.location.assign('/login');
    });
};
