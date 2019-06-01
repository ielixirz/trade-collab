// eslint-disable-next-line filenames/match-exported
import { FETCH_PROFILE_LIST, FETCH_PROFILE_DETAIL, CLEAR_PROFILE } from '../constants/constants';

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
    case CLEAR_PROFILE:
      return {
        ...state,
        ProfileDetail: {},
        ProfileList: [],
      };
    default:
      return state;
  }
};
