import { FETCH_USER_DETAIL } from '../constants/constants';

const INITIAL_STATE = {
  UserInfo: {}
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_USER_DETAIL:
      return {
        ...state,
        UserInfo: action.payload
      };
    default:
      return state;
  }
}
