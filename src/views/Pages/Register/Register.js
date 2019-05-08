/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';
import {
  Card, CardBody, Col, Container, Row, CardTitle, CardSubtitle,
} from 'reactstrap';
import './register.css';
import './checkbox.scss';
import { RegisterUser } from '../../../service/auth/register';

const styles = {
  marginInput: { marginLeft: 40, marginRight: 40 },
  marginInputCheckbox: {
    marginLeft: 48,
    marginRight: 40,
    marginTop: 30,
    marginBottom: 30,
    display: 'flex',
    flexDirection: 'row',
  },
  agreeTerm: {
    fontWeight: 'bold',
    marginLeft: 10,
  },
  termCon: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#16a085',
    marginLeft: 10,
  },
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
    e.preventDefault()
    this.props.nextStep()
}

  render() {
    const { values } = this.props

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardTitle>
                  <h2 style={{ textAlign: 'center', marginTop: 20 }}>
                    Create new account for free!
                  </h2>
                </CardTitle>
                <CardSubtitle>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <h4 style={{ marginLeft: 60 }}>or</h4>
                    <h4 style={{ marginLeft: 10, textDecoration: 'underline', color: '#16a085' }}>
                      sign into your account
                    </h4>
                  </div>
                </CardSubtitle>
                <CardBody className="p-4">
                  <form>
                    <div style={styles.marginInput}>
                      <input
                        type="text"
                        id="Email"
                        name="email"
                        placeholder="Email"
                        onChange={this.props.handleChange('Email')}
                        defaultValue={values.Email}
                      />
                    </div>
                    <div style={styles.marginInput}>
                      <input
                        type="text"
                        id="Firstname"
                        name="fname"
                        placeholder="Firstname"
                        defaultValue={values.Firstname}
                        onChange={this.props.handleChange('Firstname')}
                      />
                    </div>
                    <div style={styles.marginInput}>
                      <input
                        type="text"
                        id="Surname"
                        name="sname"
                        placeholder="Surname"
                        defaultValue={values.Surname}
                        onChange={this.props.handleChange('Surname')}
                      />
                    </div>
                    <div style={styles.marginInput}>
                      <input
                        type="password"
                        id="Password"
                        name="password"
                        placeholder="Password"
                        onChange={this.props.handleChange('Password')}
                      />
                    </div>
                    <div style={styles.marginInputCheckbox}>
                      <input type="checkbox" id="term" onChange={this.handleChange} />
                      <p style={styles.agreeTerm}>I agree to Y-Terminal</p>
                      <p style={styles.termCon}>Term & condition</p>
                    </div>
                    <div className="col-sm-12 text-center">
                      <button className="button button1" type="submit" onClick={this.saveAndContinue}>
                        <span style={{ color: '#fff' }}>Sign Up</span>
                      </button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
