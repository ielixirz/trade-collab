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

const ResetPasswordModal = forwardRef((props, ref) => {
  const [modal, setModal] = useState(false);
  const [backdrop] = useState('static');
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const [invalid, setInvalid] = useState(undefined);
  const [msg, setMsg] = useState('');

  const toggle = () => {
    setModal(!modal);
  };

  const validateInput = () => {
    if (newPassword === newConfirmPassword) {
      if (isValidPassword(newPassword)) {
        setInvalid(false);
      } else {
        setMsg('Your password is invalid');
        setInvalid(true);
      }
    } else {
      setMsg('Password and Confirm Password not match');
      setInvalid(true);
    }
  };

  const changePassword = () => {
    validateInput();
  };

  const handleInputPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleInputConfirmPasswordChange = (event) => {
    setNewConfirmPassword(event.target.value);
  };

  useImperativeHandle(ref, () => ({
    // eslint-disable-next-line no-shadow
    triggerResetPassword() {
      toggle();
    },
  }));

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      fade={false}
      backdrop={backdrop}
      onClosed={() => props.redirect()}
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
          onClick={changePassword}
        >
          Change Password
        </Button>
        {' '}
      </ModalFooter>
    </Modal>
  );
});

export default ResetPasswordModal;
