/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable filenames/match-regex */
import React, { useState } from 'react';
import {
  Form, Col, Container, Row, Input,
} from 'reactstrap';
import './register.css';
import './checkbox.scss';
import { RegisterUser } from '../../../service/auth/register';
import { GetUserInfoFromEmail } from '../../../service/user/user';
import { isValidEmail, isValidName, isValidPassword } from '../../../utils/validation';

const styles = {
  marginInput: { marginLeft: 5, marginRight: 5 },
};

const Register = (props) => {
  const [invalid, setInvalid] = useState({
    Firstname: { isInvalid: undefined, msg: '' },
    Surname: { isInvalid: undefined, msg: '' },
    Email: { isInvalid: undefined, msg: '' },
    Password: { isInvalid: undefined, msg: '' },
  });
  const [isDuplicate, setIsDuplicate] = useState(false);

  const validateFields = (values) => {
    let valid = true;
    const i = { ...invalid };
    if (values.Firstname !== '') {
      if (!isValidName(values.Firstname)) {
        valid = valid && false;
        i.Firstname.isInvalid = true;
        i.Firstname.msg = '*Invalid';
      } else {
        i.Firstname.isInvalid = false;
      }
    } else {
      valid = valid && false;
      i.Firstname.isInvalid = true;
      i.Firstname.msg = '*Required';
    }

    if (values.Surname !== '') {
      if (!isValidName(values.Surname)) {
        valid = valid && false;
        i.Surname.isInvalid = true;
        i.Surname.msg = '*Invalid';
      } else {
        i.Surname.isInvalid = false;
      }
    } else {
      valid = valid && false;
      i.Surname.isInvalid = true;
      i.Surname.msg = '*Required';
    }

    if (values.Email !== '') {
      if (!isValidEmail(values.Email)) {
        valid = valid && false;
        i.Email.isInvalid = true;
        i.Email.msg = '*Invalid';
      } else {
        i.Email.isInvalid = false;
      }
    } else {
      valid = valid && false;
      i.Email.isInvalid = true;
      i.Email.msg = '*Required';
    }

    if (values.Password !== '') {
      if (!isValidPassword(values.Password)) {
        valid = valid && false;
        i.Password.isInvalid = true;
        i.Password.msg = '*Invalid';
      } else {
        i.Password.isInvalid = false;
      }
    } else {
      valid = valid && false;
      i.Password.isInvalid = true;
      i.Password.msg = '*Required';
    }

    setInvalid(i);
    return valid;
  };

  const handleEmailChange = (email) => {
    GetUserInfoFromEmail(email).subscribe((data) => {
      if (data.length === 0) {
        setIsDuplicate(false);
      } else setIsDuplicate(true);
    });
    props.handleEmailChange(email);
  };

  const saveAndContinue = (e) => {
    e.preventDefault();
    if (validateFields(props.values) && !isDuplicate) {
      props.nextStep('');
    }
  };

  return (
    <div className="app flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md="9" lg="7" xl="6">
            <div className="card">
              <div
                style={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 40,
                  paddingBottom: 40,
                }}
              >
                <h2 style={{ marginLeft: 0 }}>Create new account for free!</h2>
                <Form>
                  <div style={styles.marginInput}>
                    <Row>
                      <Col md="9">
                        <h4>Firstname</h4>
                      </Col>
                      {invalid.Firstname.isInvalid ? (
                        <Col className="field-error-container-regis">
                          <span className="field-error-msg-regis">{invalid.Firstname.msg}</span>
                        </Col>
                      ) : (
                        ''
                      )}
                    </Row>

                    <Input
                      type="text"
                      id="Firstname"
                      name="fname"
                      placeholder="Enter Firstname"
                      style={{ marginTop: 0 }}
                      defaultValue={props.values.Firstname}
                      onChange={props.handleChange('Firstname')}
                      className="register-form"
                      invalid={invalid.Firstname.isInvalid}
                      valid={invalid.Firstname.isInvalid === false}
                    />
                  </div>

                  <div style={styles.marginInput}>
                    <Row>
                      <Col md="9">
                        <h4>Surname</h4>
                      </Col>
                      {invalid.Surname.isInvalid ? (
                        <Col className="field-error-container-regis">
                          <span className="field-error-msg-regis">{invalid.Surname.msg}</span>
                        </Col>
                      ) : (
                        ''
                      )}
                    </Row>
                    <Input
                      type="text"
                      id="Surname"
                      name="sname"
                      placeholder="Enter Surname"
                      style={{ marginTop: 0 }}
                      defaultValue={props.values.Surname}
                      onChange={props.handleChange('Surname')}
                      className="register-form"
                      invalid={invalid.Surname.isInvalid}
                      valid={invalid.Surname.isInvalid === false}
                    />
                  </div>

                  <div style={styles.marginInput}>
                    <Row>
                      <Col md="2">
                        <h4>Email</h4>
                      </Col>
                      <Col md="7">
                        {isDuplicate ? (
                          <span className="field-error-msg-regis">*Email already register</span>
                        ) : (
                          ''
                        )}
                      </Col>
                      {invalid.Email.isInvalid ? (
                        <Col className="field-error-container-regis">
                          <span className="field-error-msg-regis">{invalid.Email.msg}</span>
                        </Col>
                      ) : (
                        ''
                      )}
                    </Row>
                    <Input
                      type="text"
                      id="Email"
                      name="email"
                      style={{ marginTop: 0 }}
                      placeholder="you@example.com"
                      onChange={(e) => {
                        handleEmailChange(e.target.value);
                      }}
                      defaultValue={props.values.Email}
                      className="register-form"
                      invalid={invalid.Email.isInvalid || isDuplicate}
                      valid={invalid.Email.isInvalid === false}
                      disabled={props.invite}
                    />
                  </div>

                  <div style={styles.marginInput}>
                    <Row>
                      <Col md="9">
                        <h4>Password</h4>
                      </Col>
                      {invalid.Password.isInvalid ? (
                        <Col className="field-error-container-regis">
                          <span className="field-error-msg-regis">{invalid.Password.msg}</span>
                        </Col>
                      ) : (
                        ''
                      )}
                    </Row>
                    <Input
                      type="password"
                      id="Password"
                      name="password"
                      style={{ marginTop: 0 }}
                      placeholder="Enter Password"
                      onChange={props.handleChange('Password')}
                      className="register-form"
                      invalid={invalid.Password.isInvalid}
                      valid={invalid.Password.isInvalid === false}
                      autocomplete="new-password"
                    />
                  </div>

                  <div className="col-sm-12 text-center">
                    <button
                      className="regis-button button1"
                      type="submit"
                      onClick={e => saveAndContinue(e)}
                    >
                      <span style={{ color: '#fff' }}>Register</span>
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
