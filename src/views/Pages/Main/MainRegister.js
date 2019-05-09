/* eslint-disable default-case */
/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';
import Register from '../Register/Register';
import SelectRole from '../SelectProfile/SelectRole';
import Confirmation from '../SelectProfile/Confirmation';
import SelectProfile from '../SelectProfile/SelectProfile';

class MainRegister extends Component {
  state = {
    step: 1,
    Firstname: '',
    Lastname: '',
    Email: '',
    Password: '',
    AccountType: '',
  };

  nextStep = (r) => {
    const { step } = this.state;
    this.setState({
      step: step + 1,
      AccountType: r,
    });
  };

  handleChange = input => (event) => {
    this.setState({ [input]: event.target.value });
  };

  render() {
    const { step } = this.state;
    const {
      Firstname, Lastname, Email, Password, AccountType,
    } = this.state;
    const values = {
      Firstname,
      Lastname,
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
        return <SelectProfile />;
      default:
        return (
          <Register nextStep={this.nextStep} handleChange={this.handleChange} values={values} />
        );
    }
  }
}

export default MainRegister;
