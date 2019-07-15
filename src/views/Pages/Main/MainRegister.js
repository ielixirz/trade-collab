/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable default-case */
/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Register from '../Register/Register';
import SelectRole from '../SelectProfile/SelectRole';
import Confirmation from '../SelectProfile/Confirmation';
import { RegisterUser } from '../../../service/auth/register';
import { login, setDefault } from '../../../actions/loginActions';

class MainRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      Firstname: '',
      Surname: '',
      Email: '',
      Password: '',
      AccountType: '',
    };
  }

  nextStep = (r) => {
    const { step } = this.state;
    const nextState = {
      step: step + 1,
      AccountType: r,
    };
    if (this.props.invite) {
      nextState.Email = this.props.inviteData.email;
    }
    this.setState(nextState);
  };

  handleChange = input => (event) => {
    this.setState({ [input]: event.target.value });
  };

  handleEmailChange = (email) => {
    this.setState({ Email: email });
  };

  handleRegister = () => {
    const { Email, Password } = this.state;
    RegisterUser(this.state).subscribe({
      next: (result) => {
        this.props.setDefault();
        this.props.login({ email: Email, password: Password });
      },
      complete: (result) => {
        console.log(result);
      },
      error: (err) => {
        console.log('err', err);
        window.location.replace('#/login');
      },
    });
  };

  handleRegisterByInvite = () => {
    const { Email, Password } = this.state;
    const { flow } = this.props.inviteData;

    switch (flow) {
      case 'COMPANY_INVITE':
        // TO-DO
        break;
      case 'SHIPMENT_CHAT_INVITE':
        // TO-DO for fluke
        break;
      default:
        // TO-DO return unhandled case.
        break;
    }
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
    if (this.props.invite) {
      values.Email = this.props.inviteData.email;
    }
    switch (step) {
      case 1:
        return (
          <Register
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            handleEmailChange={this.handleEmailChange}
            values={values}
            invite={this.props.invite}
          />
        );
      case 2:
        return <SelectRole nextStep={this.nextStep} values={values} />;
      case 3:
        return <Confirmation nextStep={this.nextStep} values={values} />;
      case 4:
        if (this.props.invite) {
          this.handleRegisterByInvite();
        } else {
          this.handleRegister();
        }
        return '';
      default:
        return (
          <Register nextStep={this.nextStep} handleChange={this.handleChange} values={values} />
        );
    }
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
  { login, setDefault },
)(MainRegister);
