// eslint-disable-next-line filenames/match-regex
import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { RegisterUser } from '../../../service/auth/register';

class Confirmation extends Component {
  saveAndContinue = (r) => {
    this.props.nextStep(r);
  };

  render() {
    const {
      values: {
        Firstname, Surname, Email, Password, AccountType,
      },
    } = this.props;

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <img
              src="https://ui-ex.com/images/rocket-transparent-flat-3.png"
              alt="Success"
              width="300"
              height="300"
            />
            <h1 style={{ textAlign: 'center' }}>Hooray!</h1>
            <p style={{ fontStyle: 'italic', color: '#6A6A6A' }}>
              Welcome to your first shipment our terminal.
            </p>
            <div className="col-sm-12 text-center">
              <button
                className="button button1"
                type="submit"
                onClick={() => {
                  this.saveAndContinue(AccountType);
                }}
              >
                <span style={{ color: '#fff' }}>Go To Terminal</span>
              </button>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

export default Confirmation;
