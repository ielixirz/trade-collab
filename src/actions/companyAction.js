import _ from 'lodash';
import { configureStore } from '../utils/configureStore';
import {
  FETCH_COMPANY_DETAIL,
  FETCH_COMPANY_USER,
  FETCH_NETWORK_EMAIL
} from '../constants/constants';
import { GetCompanyDetail, GetCompanyMember } from '../service/company/company';

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

export const fetchCompany = companies => async (dispatch, getState) => {
  let members = _.get(getState(), 'companyReducer.NetworkEmail', {});
  _.forEach(companies, async item => {
    dispatch({
      type: FETCH_NETWORK_EMAIL,
      payload: await new Promise((resolve, reject) => {
        GetCompanyMember(item.CompanyKey).subscribe({
          next: res => {
            _.forEach(res, memberData => {
              const user = {
                ...memberData.data()
              };
              members[user.UserMemberEmail] = {
                ...user
              };
            });
            console.log('member', members);
            resolve(members);
          },
          error: res => {
            resolve(members);
          }
        });
      })
    });
  });

  dispatch({
    type: FETCH_COMPANY_USER,
    payload: companies
  });
};
