import _ from 'lodash';
import { FETCH_PROFILE_LIST, FETCH_PROFILE_DETAIL } from '../constants/constants';
import { GetProlfileList, GetProfileDetail } from '../service/user/profile';

// eslint-disable-next-line import/prefer-default-export
export const getProlfileList = userInfoKey => (dispatch) => {
  GetProlfileList(userInfoKey).subscribe({
    next: (snapshot) => {
      let ProfileList = [];

      ProfileList = _.map(snapshot, item => ({
        id: item.id,
        ...item.data(),
      }));

      dispatch({
        type: FETCH_PROFILE_LIST,
        payload: ProfileList,
      });
    },
    error: (err) => {
      console.log(err);
      alert(err.message);
    },
    complete: () => {},
  });
};

export const getProfileDetail = (userInfoKey, profileKey) => (dispatch) => {
  GetProfileDetail(userInfoKey, profileKey).subscribe({
    next: (snapshot) => {
      let ProfileDetail = {};

      ProfileDetail = { id: snapshot.id, ...snapshot.data() };
      dispatch({
        type: FETCH_PROFILE_DETAIL,
        payload: ProfileDetail,
      });
    },
    error: (err) => {
      console.log(err);
      alert(err.message);
    },
    complete: () => {},
  });
};
