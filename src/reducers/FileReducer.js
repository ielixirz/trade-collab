import { FETCH_FILES } from '../constants/constants';

const INITIAL_STATE = [];
export default (state = INITIAL_STATE, action) => {
  console.log(action);
  switch (action.type) {
    case FETCH_FILES:
      state = INITIAL_STATE;
      return [...state, ...action.payload];
    default:
      return state;
  }
};
