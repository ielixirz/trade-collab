/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable filenames/match-regex */
import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import CryptoJS from 'crypto-js';
import { isDateBefore } from '../../../utils/date';

import MainRegister from '../Main/MainRegister';

const NewUser = (props) => {
  const [inviteData, setInviteData] = useState({});
  const [expired, setExpired] = useState(undefined);

  const verifyExpiration = (seconds) => {
    const isExpired = isDateBefore(new Date(+seconds * 1000), new Date());
    return isExpired;
  };

  const verifyUsed = (usage) => {
    if (usage === 'Y') {
      return false;
    }
    return true;
  };

  useEffect(() => {
    const parsed = queryString.parse(props.location.search);
    const {
 dke, ed, e, f, ck, u,
} = parsed;
    // ---- TO-DO secret key need to be stored securely
    const bytesUsed = CryptoJS.AES.decrypt(u, 'redroylkeew');
    const decryptedUsed = bytesUsed.toString(CryptoJS.enc.Utf8);

    if (verifyUsed(decryptedUsed)) {
      const bytesDKE = CryptoJS.AES.decrypt(dke, 'redroylkeew');
      const decryptedDKE = bytesDKE.toString(CryptoJS.enc.Utf8);

      const bytesEmail = CryptoJS.AES.decrypt(e, 'redroylkeew');
      const decryptedEmail = bytesEmail.toString(CryptoJS.enc.Utf8);

      const bytesFlow = CryptoJS.AES.decrypt(f, 'redroylkeew');
      const decryptedFlow = bytesFlow.toString(CryptoJS.enc.Utf8);

      const bytesED = CryptoJS.AES.decrypt(ed, 'redroylkeew');
      const decryptedED = bytesED.toString(CryptoJS.enc.Utf8);

      const dataKey = {};
      let decryptedCompanyKey;
      // let decrypted???Key ---> for invite to shipment/chat case
      if (decryptedFlow === 'Company') {
        const bytesCompany = CryptoJS.AES.decrypt(ck, 'redroylkeew');
        decryptedCompanyKey = bytesCompany.toString(CryptoJS.enc.Utf8);
        dataKey.companyKey = decryptedCompanyKey;
      } else {
        // data.chatKey???? = decrypted???Key;
      }

      if (!verifyExpiration(decryptedED)) {
        setExpired(false);
        setInviteData({
          email: decryptedEmail,
          flow: decryptedFlow,
          docKey: decryptedDKE,
          dataKey,
        });
      } else {
        setExpired(true);
      }
    } else {
      setExpired(true);
    }
  }, []);

  return expired ? 'Expired' : <MainRegister invite inviteData={inviteData} />;
};

export default NewUser;
