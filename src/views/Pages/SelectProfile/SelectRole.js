/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';
import { Col, Container, Row } from 'reactstrap';
import './card.css';

class SelectRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: '',
    };
  }

  setRole(r) {
    this.setState({ role: r });
  }

  saveAndContinue = (e) => {
    const { role } = this.state;
    e.preventDefault();
    this.props.nextStep(role);
  };

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <div className="card">
                <div className="container">
                  <h2 style={{ textAlign: 'center' }}>Which describes you best ?</h2>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}
                  >
                    <button
                      className="cardRole"
                      type="submit"
                      onClick={() => {
                        this.setRole('Importer');
                      }}
                    >
                      Importer
                    </button>
                    <button
                      className="cardRole"
                      type="submit"
                      onClick={() => {
                        this.setRole('Exporter');
                      }}
                    >
                      Exporter
                    </button>
                    <button
                      className="cardRole"
                      type="submit"
                      onClick={() => {
                        this.setRole('Freight Forwarder');
                      }}
                    >
                      Freight Forwarder
                    </button>
                    <button
                      className="cardRole"
                      type="submit"
                      onClick={() => {
                        this.setRole('Custom Broker');
                      }}
                    >
                      Custom Broker
                    </button>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 10 }}>
                    <p style={{ color: '#909090' }}>
                      It's so that we can provide the best onboarding user experience.
                    </p>
                  </div>
                  <div style={{ paddingBottom: 20 }}>
                    <div className="col-sm-12 text-center">
                      <button
                        className="button button1"
                        type="submit"
                        onClick={this.saveAndContinue}
                      >
                        <span style={{ color: '#fff' }}>Next</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default SelectRole;
