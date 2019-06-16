import _ from 'lodash';
import { configureStore } from '../utils/configureStore';
import { FETCH_COMPANY_DETAIL, FETCH_COMPANY_USER } from '../constants/constants';
import { GetCompanyDetail } from '../service/company/company';

const { store } = configureStore();

// eslint-disable-next-line import/prefer-default-export
export const getCompanyDetail = companyKey => dispatch => {
  GetCompanyDetail(companyKey).subscribe({
    next: snapshot => {
      let CompanyDetail = {};

      CompanyDetail = { id: snapshot.id, ...snapshot.data() };
      store.dispatch({
        type: FETCH_COMPANY_DETAIL,
        payload: CompanyDetail
      });
    },
    error: err => {
      console.log(err);
      alert(err.message);
    },
    complete: () => {}
  });
};

export const fetchCompany = companies => dispatch => {
  dispatch({
    type: FETCH_COMPANY_USER,
    payload: companies
  });
};
