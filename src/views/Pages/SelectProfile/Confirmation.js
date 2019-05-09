// eslint-disable-next-line filenames/match-regex
import React, { Component } from 'react';
import { Container, Row } from 'reactstrap';

class Confirmation extends Component {
  saveAndContinue = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    const {
      values: {
        Firstname, Lastname, Email, Password, AccountType,
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
            <p>
              First Name:
              {Firstname}
            </p>
            <p>
              Last Name:
              {Lastname}
            </p>
            <p>
              Email:
              {Email}
            </p>
            <p>
              pass:
              {Password}
            </p>
            <p>
              Role:
              {AccountType}
            </p>
            <div className="col-sm-12 text-center">
              <button className="button button1" type="submit" onClick={this.saveAndContinue}>
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
