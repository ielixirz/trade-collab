/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';
import {
  Form, Col, Container, Row,
} from 'reactstrap';
import './register.css';
import './checkbox.scss';
import { RegisterUser } from '../../../service/auth/register';

const styles = {
  marginInput: { marginLeft: 5, marginRight: 5 },
};

class Register extends Component {
  // state = {
  //   Email: '',
  //   Password: '',
  //   Firstname: '',
  //   Surname: '',
  //   AccountType: '',
  // };

  // handleChange = (e) => {
  //   this.setState({
  //     [e.target.id]: e.target.value,
  //   });
  // };

  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log('state form', this.state);
  //   RegisterUser(this.state).subscribe({
  //     next: (result) => {
  //       console.log('result', result);
  //     },
  //     complete: (result) => {
  //       console.log(result);
  //     },
  //   });
  // };
  saveAndContinue = (e) => {
    e.preventDefault();
    this.props.nextStep('');
  };

  render() {
    const { values } = this.props;

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
                      <h4>Firstname</h4>
                      <input
                        type="text"
                        id="Firstname"
                        name="fname"
                        placeholder="Enter Firstname"
                        style={{ marginTop: 0 }}
                        defaultValue={values.Firstname}
                        onChange={this.props.handleChange('Firstname')}
                      />
                    </div>

                    <div style={styles.marginInput}>
                      <h4>Surname</h4>
                      <input
                        type="text"
                        id="Surname"
                        name="sname"
                        placeholder="Enter Surname"
                        style={{ marginTop: 0 }}
                        defaultValue={values.Surname}
                        onChange={this.props.handleChange('Surname')}
                      />
                    </div>

                    <div style={styles.marginInput}>
                      <h4>Email</h4>
                      <input
                        type="text"
                        id="Email"
                        name="email"
                        style={{ marginTop: 0 }}
                        placeholder="you@example.com"
                        onChange={this.props.handleChange('Email')}
                        defaultValue={values.Email}
                      />
                    </div>

                    <div style={styles.marginInput}>
                      <h4>Password</h4>
                      <input
                        type="password"
                        id="Password"
                        name="password"
                        style={{ marginTop: 0 }}
                        placeholder="Enter Password"
                        onChange={this.props.handleChange('Password')}
                      />
                    </div>

                    <div className="col-sm-12 text-center">
                      <button
                        className="button button1"
                        type="submit"
                        onClick={this.saveAndContinue}
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
  }
}

export default Register;
