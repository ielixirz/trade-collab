/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
/* as it is component */
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Input,
  Label,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Container,
  Row,
  Alert,
} from 'reactstrap';
import { isValidPassword } from '../utils/validation';
import { ConfirmPasswordReset } from '../service/auth/manageuser';

const ResetPasswordModal = forwardRef((props, ref) => {
  const [modal, setModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const [invalid, setInvalid] = useState(undefined);
  const [msg, setMsg] = useState('');
  const [email, setEmail] = useState('');
  const [actionCode, setActionCode] = useState('');

  const toggle = () => {
    setModal(!modal);
  };

  const changePassword = () => {
    ConfirmPasswordReset(actionCode, newPassword)
      .then((resp) => {
        console.log(resp);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const validateInput = (callback) => {
    if (newPassword === newConfirmPassword) {
      if (isValidPassword(newPassword)) {
        setInvalid(false);
        callback();
      }
      setMsg('Your password is invalid');
      setInvalid(true);
    } else {
      setMsg('Password and Confirm Password not match');
      setInvalid(true);
    }
  };

  const handleInputPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleInputConfirmPasswordChange = (event) => {
    setNewConfirmPassword(event.target.value);
  };

  useImperativeHandle(ref, () => ({
    // eslint-disable-next-line no-shadow
    triggerResetPassword(email, actionCode) {
      setEmail(email);
      setActionCode(actionCode);
      toggle();
    },
  }));

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      fade={false}
      backdrop={props.backdrop}
      onClosed={props.redirect === null ? () => null : () => props.redirect()}
      className="reset-password-modal"
    >
      <ModalHeader toggle={toggle} style={{ border: 'none' }}>
        <h2>
          <b>Reset your password:</b>
        </h2>
      </ModalHeader>
      <ModalBody>
        <Container style={{ padding: '20px 50px 10px 50px' }}>
          {invalid ? (
            <Row style={{ margin: 'auto', marginBottom: '15px' }}>
              <Alert style={{ margin: 'auto' }} color="danger">
                {msg}
                {' '}
!
              </Alert>
            </Row>
          ) : (
            ''
          )}
          <Label htmlFor="newPassword">
            <b>New Password</b>
          </Label>
          <Input
            type="password"
            id="newPassword"
            placeholder=""
            value={newPassword}
            onChange={handleInputPasswordChange}
            autocomplete="new-password"
          />
          <Label htmlFor="confirmPassword" style={{ marginTop: 15 }}>
            <b>Confirm New Password</b>
          </Label>
          <Input
            type="password"
            id="confirmPassword"
            placeholder=""
            value={newConfirmPassword}
            onChange={handleInputConfirmPasswordChange}
            autocomplete="new-password"
          />
        </Container>
      </ModalBody>
      <ModalFooter style={{ border: 'none' }}>
        <Button
          color="primary"
          className="change-password-btn"
          style={{ margin: 'auto' }}
          onClick={validateInput(changePassword)}
        >
          Change Password
        </Button>
        {' '}
      </ModalFooter>
    </Modal>
  );
});

export default ResetPasswordModal;
