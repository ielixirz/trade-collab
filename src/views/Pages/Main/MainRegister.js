/* eslint-disable default-case */
/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';
import Register from '../Register/Register';
import SelectRole from '../SelectProfile/SelectRole';
import Confirmation from '../SelectProfile/Confirmation';
import SelectProfile from '../SelectProfile/SelectProfile';
import { RegisterUser } from '../../../service/auth/register';

class MainRegister extends Component {
  state = {
    step: 1,
    Firstname: '',
    Surname: '',
    Email: '',
    Password: '',
    AccountType: '',
  };

  nextStep = (r) => {
    const { step } = this.state;
    console.log('r', r);
    this.setState({
      step: step + 1,
      AccountType: r,
    });
  };

  handleChange = input => (event) => {
    this.setState({ [input]: event.target.value });
  };

  handleRegister = () => {
    console.log('state', this.state);
    RegisterUser(this.state).subscribe({
      next: (result) => {
        console.log('result', result);
      },
      error: (err) => {
        console.log('err', err);
        window.location.replace('#/login');
      },
      complete: (result) => {
        console.log(result);
      },
    });
  };

  render() {
    const { step } = this.state;
    const {
      Firstname, Surname, Email, Password, AccountType,
    } = this.state;
    const values = {
      Firstname,
      Surname,
      Email,
      Password,
      AccountType,
    };
    switch (step) {
      case 1:
        return (
          <Register nextStep={this.nextStep} handleChange={this.handleChange} values={values} />
        );
      case 2:
        return <SelectRole nextStep={this.nextStep} values={values} />;
      case 3:
        return <Confirmation nextStep={this.nextStep} values={values} />;
      case 4:
        this.handleRegister();
        return '';
      default:
        return (
          <Register nextStep={this.nextStep} handleChange={this.handleChange} values={values} />
        );
    }
  }
}

export default MainRegister;
