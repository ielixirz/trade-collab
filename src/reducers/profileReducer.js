// eslint-disable-next-line filenames/match-exported
import { FETCH_PROFILE_LIST, FETCH_PROFILE_DETAIL } from '../constants/constants';

const INITIAL_STATE = {
  ProfileList: [],
  ProfileDetail: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_PROFILE_LIST:
      return {
        ...state,
        ProfileList: action.payload,
      };

    case FETCH_PROFILE_DETAIL:
      return {
        ...state,
        ProfileDetail: action.payload,
      };
    default:
      return state;
  }
};
