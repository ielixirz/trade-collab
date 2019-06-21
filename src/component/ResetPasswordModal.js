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
import { ConfirmPasswordReset, UpdatePassword } from '../service/auth/manageuser';

const ResetPasswordModal = forwardRef((props, ref) => {
  const [modal, setModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const [invalid, setInvalid] = useState(undefined);
  const [msg, setMsg] = useState('');
  const [email, setEmail] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [state, setState] = useState(undefined);

  const toggle = () => {
    setModal(!modal);
  };

  const changePassword = () => {
    if (props.changeMode) {
      UpdatePassword(email, currentPassword, newPassword).subscribe(
        () => {
          setState('DONE');
        },
        (err) => {
          setMsg('Your current password is invalid.');
          setInvalid(true);
        },
      );
    } else {
      ConfirmPasswordReset(actionCode, newPassword)
        .then(() => {
          setState('DONE');
        })
        .catch(() => {
          setState('ERROR');
        });
    }
  };

  const validateInput = (callback) => {
    if (newPassword === newConfirmPassword) {
      if (isValidPassword(newPassword)) {
        setInvalid(false);
        callback();
      } else {
        setMsg('Your password is invalid');
        setInvalid(true);
      }
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

  const handleInputCurrentPasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };

  useImperativeHandle(ref, () => ({
    // eslint-disable-next-line no-shadow
    triggerResetPassword(email, actionCode, expired) {
      if (!props.changeMode) {
        if (expired) {
          setState('EXPIRED');
        } else {
          setState('VALID');
          setEmail(email);
        }
        setActionCode(actionCode);
      } else {
        setState('VALID');
        setEmail(email);
      }
      toggle();
    },
  }));

  const renderBody = (currentState) => {
    switch (currentState) {
      case 'EXPIRED':
        return <h4 style={{ textAlign: 'center' }}>Your link already expired.</h4>;
      case 'ERROR':
        return (
          <h4 style={{ textAlign: 'center' }}>
            An error occured, please try reset your password again.
          </h4>
        );
      case 'VALID':
        return (
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
            {props.changeMode ? (
              <React.Fragment>
                <Label htmlFor="currentPassword">
                  <b>Current Password</b>
                </Label>
                <Input
                  type="password"
                  id="currentPassword"
                  placeholder=""
                  value={currentPassword}
                  onChange={handleInputCurrentPasswordChange}
                  autocomplete="new-password"
                  style={{ marginBottom: 15 }}
                />
              </React.Fragment>
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
        );
      case 'DONE':
        return (
          <Container>
            <Row style={{ marginBottom: 25 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="142"
                height="142"
                viewBox="0 0 142 142"
                style={{ margin: 'auto' }}
              >
                <g id="Group_7528" data-name="Group 7528" transform="translate(-437 -214)">
                  <path
                    id="Path_4008"
                    data-name="Path 4008"
                    d="M71,0A71,71,0,1,1,0,71,71,71,0,0,1,71,0Z"
                    transform="translate(437 214)"
                    fill="#16a085"
                  />
                  <circle
                    id="Ellipse_610"
                    data-name="Ellipse 610"
                    cx="59"
                    cy="59"
                    r="59"
                    transform="translate(449 226)"
                    fill="#fff"
                  />
                  <g id="Group_7525" data-name="Group 7525" transform="translate(148 1.621)">
                    <rect
                      id="Rectangle_4122"
                      data-name="Rectangle 4122"
                      width="31"
                      height="13"
                      transform="translate(330.349 281.18) rotate(45)"
                      fill="#16a085"
                    />
                    <path
                      id="Path_4009"
                      data-name="Path 4009"
                      d="M0,0,75.876,4.206l.6,10.839L.6,10.839Z"
                      transform="translate(333.73 305.053) rotate(-45)"
                      fill="#16a085"
                    />
                  </g>
                </g>
              </svg>
            </Row>
            <h4 style={{ textAlign: 'center' }}>
              <b>Change Password</b>
            </h4>
          </Container>
        );
      default:
        return '';
    }
  };

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
      <ModalBody>{renderBody(state)}</ModalBody>
      {state !== 'VALID' ? (
        ''
      ) : (
        <ModalFooter style={{ border: 'none' }}>
          <Button
            color="primary"
            className="change-password-btn"
            style={{ margin: 'auto' }}
            onClick={() => validateInput(changePassword)}
          >
            Change Password
          </Button>
          {' '}
        </ModalFooter>
      )}
    </Modal>
  );
});

export default ResetPasswordModal;
