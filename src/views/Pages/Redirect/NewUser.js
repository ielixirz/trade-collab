/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable filenames/match-regex */
import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import CryptoJS from 'crypto-js';

import MainRegister from '../Main/MainRegister';

const mockInviteData = {
  email: 'test@test.com',
};

const NewUser = (props) => {
  const [inviteData, setInviteData] = useState({});

  useEffect(() => {
    const parsed = queryString.parse(props.location.search);
    setInviteData(mockInviteData);
  }, []);

  return <MainRegister invite inviteData={inviteData} />;
};

export default NewUser;
