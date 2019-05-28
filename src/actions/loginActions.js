import {
  FETCH_COMPANY_USER,
  FETCH_USER_DETAIL,
  FILL_CREDENCIAL,
  SAVE_CREDENCIAL
} from '../constants/constants';
import { LoginWithEmail } from '../service/auth/login';
import { getUserInfoDetail } from './userActions';
import 'firebase/auth';
import { FirebaseApp } from '../service/firebase';
import { GetUserCompany, GetUserInfoDetail } from '../service/user/user';

export const typinglogin = data => dispatch => {
  // eslint-disable-next-line prefer-destructuring
  const value = data.target.value;
  const payload = data.target.id;
  dispatch({
    type: FILL_CREDENCIAL,
    payload,
    value
  });
};

export const setDefault = () => dispatch => {
  dispatch({
    type: SAVE_CREDENCIAL,
    payload: {}
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
      GetUserInfoDetail(res.user.uid).subscribe({
        next: snapshot => {
          const SnapshotData = snapshot.data();
          let originalReducer = {};
          if (SnapshotData) {
            originalReducer = {
              UserInfoUsername: SnapshotData.UserInfoUsername,
              UserInfoEmail: SnapshotData.UserInfoEmail,
              UserInfoBio: SnapshotData.UserInfoBio,
              UserInfoProfileImageLink: SnapshotData.UserInfoProfileImageLink,
              UserInfoCreateTimestamp: SnapshotData.UserInfoCreateTimestamp,
              UserInfoAccountType: SnapshotData.UserInfoAccountType,
              UserInfoCompanyName: SnapshotData.UserInfoCompanyName,
              UserInfoCompanyRelate: SnapshotData.UserInfoCompanyRelate
            };
            dispatch({
              type: FETCH_USER_DETAIL,
              payload: originalReducer
            });
          } else {
            console.error('Error from system : User data not found');
          }
        },
        error: err => {
          console.log(err);
          alert(err.message);
        },
        complete: () => {}
      });
      GetUserCompany(res.user.uid).subscribe({
        next: res => {
          dispatch({
            type: FETCH_COMPANY_USER,
            payload: res
          });
        }
      });

      window.location.replace('#/selectprofile');
    },
    error: err => {
      console.log(err);
      alert(err.message);
    },
    complete: () => {}
  });
};

export const logout = callback => dispatch => {
  FirebaseApp.auth()
    .signOut()
    .then(() => {
      dispatch({
        type: SAVE_CREDENCIAL,
        payload: {}
      });
      if (callback) callback();
    });
};
