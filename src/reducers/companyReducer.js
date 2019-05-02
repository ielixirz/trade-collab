// eslint-disable-next-line filenames/match-exported
import { FETCH_COMPANY_DETAIL } from '../constants/constants';

const INITIAL_STATE = {
  CompanyDetail: {},
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_COMPANY_DETAIL:
      return {
        ...state,
        CompanyDetail: action.payload,
      };
    default:
      return state;
  }
}
