import { FETCH_NOTIFICATION } from '../constants/constants';

const INITIAL_STATE = {
  notifications: {}
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_NOTIFICATION:
      return {
        ...state,
        notifications: action.payload
      };
    default:
      return state;
  }
}
