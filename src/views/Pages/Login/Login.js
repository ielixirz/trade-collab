/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Alert,
} from 'reactstrap';
import './login.css';
import { connect } from 'react-redux';
import { typinglogin, login } from '../../../actions/loginActions';
import ForgotPass from '../ForgotPass/ForgotPass';
import {
  INVALID_EMAIL,
  ACCOUNT_NOT_FOUND,
  INVALID_PASSWORD,
  TOO_MANY_ATTEMPT,
  INVALID_EMAIL_CODE,
  ACCOUNT_NOT_FOUND_CODE,
  INVALID_PASSWORD_CODE,
  TOO_MANY_ATTEMPT_CODE,
} from '../../../constants/auth';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      errorMsg: '',
    };
  }

  displayError = (error) => {
    let errorMessage = 'Unknown Error Occur.';
    switch (error.code) {
      case INVALID_EMAIL_CODE:
        errorMessage = INVALID_EMAIL;
        break;
      case INVALID_PASSWORD_CODE:
        errorMessage = INVALID_PASSWORD;
        break;
      case ACCOUNT_NOT_FOUND_CODE:
        errorMessage = ACCOUNT_NOT_FOUND;
        break;
      case TOO_MANY_ATTEMPT_CODE:
        errorMessage = TOO_MANY_ATTEMPT;
        break;
      default:
        break;
    }
    this.setState({
      isError: true,
      errorMsg: errorMessage,
    });
  };

  render() {
    const { email, password } = this.props.loginForm;

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <div className="login-header" />
                      {this.state.isError ? (
                        <Row style={{ margin: 'auto', marginBottom: '15px' }}>
                          <Alert style={{ margin: 'auto' }} color="danger">
                            {this.state.errorMsg}
                            {' '}
!
                          </Alert>
                        </Row>
                      ) : (
                        ''
                      )}
                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="email">
                              <b>Email</b>
                            </Label>
                            <Input
                              type="email"
                              id="email"
                              value={email}
                              onChange={this.props.typinglogin}
                              required
                              style={{ marginTop: 0 }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="password">
                              <b>Password</b>
                            </Label>
                            <Input
                              type="password"
                              value={password}
                              id="password"
                              onChange={this.props.typinglogin}
                              required
                            />
                            <div
                              className="text-center text-md-right"
                              style={{ marginTop: '10px' }}
                            >
                              <ForgotPass>
                                <p style={{ color: 'red' }}>Forgot Password</p>
                              </ForgotPass>
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row
                        className="justify-content-center full-height align-items-center "
                        style={{ marginTop: '2.5rem' }}
                      >
                        <Button
                          style={{
                            backgroundColor: '#16A085',
                            color: 'white',
                            fontWeight: 'bold',
                            marginLeft: 20,
                            marginRight: 20,
                            width: '300px',
                          }}
                          onClick={() => {
                            this.props.login(
                              this.props.loginForm,
                              this.displayError,
                              '#/selectprofile',
                            );
                          }}
                          className="px-4 login-btn"
                        >
                          LOG IN
                        </Button>
                      </Row>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          marginTop: '20px',
                        }}
                      >
                        <p>
                          <b>Don't have an account?</b>
                        </p>
                        <Link
                          className="cool-link"
                          to="register"
                          style={{ color: '#367FEE', marginLeft: '10px' }}
                        >
                          <p>Sign Up here!</p>
                        </Link>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { authReducer } = state;
  return {
    ...authReducer,
  };
};

export default connect(
  mapStateToProps,
  { typinglogin, login },
)(Login);
