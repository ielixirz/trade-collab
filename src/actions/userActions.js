import _ from 'lodash';
import { FETCH_USER_DETAIL } from '../constants/constants';
import { GetUserInfoDetail } from '../service/user/user';

export const getUserInfoDetail = userInfoKey => (dispatch) => {
  GetUserInfoDetail(userInfoKey).subscribe({
    next: (snapshot) => {
      const originalReducer = {};

      originalReducer = {
        UserInfoUsername: snapshot.UserInfoUsername,
        UserInfoEmail: snapshot.UserInfoEmail,
        UserInfoBio: snapshot.UserInfoBio,
        UserInfoProfileImageLink: snapshot.UserInfoProfileImageLink,
        UserInfoCreateTimestamp: snapshot.UserInfoCreateTimestamp,
        UserInfoAccountType: snapshot.UserInfoAccountType,
        UserInfoCompanyName: snapshot.UserInfoCompanyName,
        UserInfoCompanyRelate: snapshot.UserInfoCompanyRelate,
      };

      dispatch({
        type: FETCH_USER_DETAIL,
        payload: originalReducer,
      });
    },
    error: (err) => {
      console.log(err);
      alert(err.message);
    },
    complete: () => {},
  });
};
