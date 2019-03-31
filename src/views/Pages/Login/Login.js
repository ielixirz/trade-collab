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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row
} from 'reactstrap';
import './login.css';

class Login extends Component {
  render() {
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
                            <Input type="email" id="email" required />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="password">Password </Label>
                            <Input type="password" id="password" required />
                            <div className="text-center text-md-right">
                              <a href="/forgetpassword">Forget Password</a>
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row className="justify-content-center full-height align-items-center ">
                        <Button color="primary" className="px-4">
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

export default Login;
