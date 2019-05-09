/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';
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
} from 'reactstrap';
import './login.css';
import { connect } from 'react-redux';
import { typinglogin, login } from '../../../actions/loginActions';

class Login extends Component {
  render() {
    console.log('props is', this.props);
    const { email, password } = this.props.loginForm;

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="4">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <div className="login-header">
                        <h1>Login</h1>
                      </div>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              type="email"
                              id="email"
                              value={email}
                              onChange={this.props.typinglogin}
                              required
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="password">Password </Label>
                            <Input
                              type="password"
                              value={password}
                              id="password"
                              onChange={this.props.typinglogin}
                              required
                            />
                            <div className="text-center text-md-right">
                              <a href="/forgetpassword">Forget Password</a>
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row className="justify-content-center full-height align-items-center ">
                        <Button
                          color="primary"
                          onClick={() => {
                            this.props.login(this.props.loginForm);
                          }}
                          className="px-4"
                        >
                          Login
                        </Button>
                      </Row>
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
