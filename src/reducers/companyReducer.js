// eslint-disable-next-line filenames/match-exported
import { FETCH_COMPANY_DETAIL, FETCH_COMPANY_USER } from '../constants/constants';

const INITIAL_STATE = {
  CompanyDetail: {},
  UserCompany: {}
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_COMPANY_DETAIL:
      return {
        ...state,
        CompanyDetail: action.payload
      };
    case FETCH_COMPANY_USER:
      return {
        ...state,
        UserCompany: action.payload
      };
    default:
      return state;
  }
}
