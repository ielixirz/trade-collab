/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable default-case */
/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

import Register from '../Register/Register';
import SelectRole from '../SelectProfile/SelectRole';
import Confirmation from '../SelectProfile/Confirmation';
import { RegisterUser } from '../../../service/auth/register';
import { KeepIsCompanyMember } from '../../../service/company/company';
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
      blocking: true,
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
        this.props.login({ email: Email, password: Password }, null, '#/selectprofile');
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
    const data = this.state;
    const { flow, docKey, dataKey } = this.props.inviteData;
    data.NonUserDocumentKey = docKey;

    switch (flow) {
      case 'Company':
        RegisterUser(data).subscribe({
          next: (result) => {
            this.props.setDefault();
            const checkingMembership = KeepIsCompanyMember(dataKey.companyKey, result).subscribe({
              next: (isMember) => {
                if (isMember) {
                  checkingMembership.unsubscribe();
                  this.props.login(
                    { email: data.Email, password: data.Password },
                    null,
                    `#/selectprofile/?rc=${dataKey.companyKey}`,
                  );
                }
              },
              error: (err) => {
                console.log('err', err);
              },
            });
          },
          complete: (result) => {
            console.log(result);
          },
          error: (err) => {
            console.log('err', err);
          },
        });
        break;
      case 'Chat':
        RegisterUser(data).subscribe({
          next: (result) => {
            this.props.setDefault();
            const checkingMembership = KeepIsCompanyMember(dataKey.companyKey, result).subscribe({
              next: (isMember) => {
                if (isMember) {
                  checkingMembership.unsubscribe();
                  this.props.login(
                    { email: data.Email, password: data.Password },
                    null,
                    `#/selectprofile/?rs=${dataKey.shipmentKey}`,
                  );
                }
              },
              error: (err) => {
                console.log('err', err);
              },
            });
          },
          complete: (result) => {
            console.log(result);
          },
          error: (err) => {
            console.log('err', err);
          },
        });
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
        return (
          <BlockUi tag="div" blocking={this.state.blocking} style={{ height: '100%' }}>
            <div style={{ width: 400, height: 400 }} />
          </BlockUi>
        );
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
