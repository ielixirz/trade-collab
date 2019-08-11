import {
  FETCH_COMPANY_USER,
  FETCH_SHIPMENT_LIST_DATA,
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
export const login = (data, callback, redirectUrl) => dispatch => {
  const { email, password } = data;
  dispatch({
    type: FETCH_COMPANY_USER,
    payload: {}
  });
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
            dispatch({
              type: FETCH_SHIPMENT_LIST_DATA,
              payload: {}
            });
          } else {
            console.error('Error from system : User data not found');
          }
        },
        error: err => {
          console.log(err);
          callback(err);
        },
        complete: () => {}
      });

      window.location.replace(redirectUrl);
    },
    error: err => {
      console.log(err);
      callback(err);
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

      dispatch({
        type: FETCH_SHIPMENT_LIST_DATA,
        payload: {}
      });
      dispatch({
        type: FETCH_COMPANY_USER,
        payload: {}
      });
      if (callback) callback();
    });
};
