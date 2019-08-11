/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable filenames/match-regex */
import React, { useEffect, useRef } from 'react';
import { Container } from 'reactstrap';
import queryString from 'query-string';
import ResetPasswordModal from '../../../component/ResetPasswordModal';
import '../../../scss/ResetPassword.scss';
import { VerifyPasswordResetCode } from '../../../service/auth/manageuser';

const ResetPassword = props => {
  const resetPasswordModalRef = useRef(null);

  useEffect(() => {
    const parsed = queryString.parse(props.location.search);
    VerifyPasswordResetCode(parsed.oobCode)
      .then(email => {
        resetPasswordModalRef.current.triggerResetPassword(email, parsed.oobCode, false);
      })
      .catch(() => {
        resetPasswordModalRef.current.triggerResetPassword(null, null, true);
      });
  }, []);

  const redirect = () => {
    props.history.replace('/login');
  };

  return (
    <div className="app flex-row align-items-center">
      <Container>
        <ResetPasswordModal ref={resetPasswordModalRef} backdrop="static" redirect={redirect} />
      </Container>
    </div>
  );
};

export default ResetPassword;
