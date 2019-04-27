import _ from 'lodash';
import { FETCH_USER_DETAIL } from '../constants/constants';
import { GetUserInfoDetail } from '../service/user/user';

// eslint-disable-next-line import/prefer-default-export
export const getUserInfoDetail = userInfoKey => (dispatch) => {
  GetUserInfoDetail(userInfoKey).subscribe({
    next: (snapshot) => {
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
          UserInfoCompanyRelate: SnapshotData.UserInfoCompanyRelate,
        };
        dispatch({
          type: FETCH_USER_DETAIL,
          payload: originalReducer,
        });
      } else {
        console.error('Error from system : User data not found');
      }
    },
    error: (err) => {
      console.log(err);
      alert(err.message);
    },
    complete: () => {},
  });
};
