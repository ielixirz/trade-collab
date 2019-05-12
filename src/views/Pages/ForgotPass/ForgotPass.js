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
} from 'reactstrap';
import { connect } from 'react-redux';
import { typinglogin, login } from '../../../actions/loginActions';

class ForgotPass extends Component {
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <p>forgotpass</p>
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
  null,
)(ForgotPass);
