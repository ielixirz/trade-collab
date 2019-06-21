/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable filenames/match-regex */
import React, { useEffect, useRef } from 'react';
import { Container } from 'reactstrap';
import ResetPasswordModal from '../../../component/ResetPasswordModal';
import '../../../scss/ResetPassword.scss';
import { VerifyPasswordResetCode } from '../../../service/auth/manageuser';

const ResetPassword = (props) => {
  const resetPasswordModalRef = useRef(null);

  useEffect(() => {
    VerifyPasswordResetCode(props.match.params.oobCode)
      .then((email) => {
        resetPasswordModalRef.current.triggerResetPassword(email, props.match.params.oobCode);
      })
      .catch((error) => {
        console.log(error);
        // TO-DO Redirect to Reset Password Expired.
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
