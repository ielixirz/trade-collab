/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable filenames/match-regex */
import React, { useState } from 'react';
import {
  Col, Container, Row, Button,
} from 'reactstrap';
import './card.css';

const SelectRole = (props) => {
  const [role, setRole] = useState('');
  const [isRoleSelect, setIsRoleSelect] = useState(false);

  const setSelectRole = (r) => {
    setRole(r);
    setIsRoleSelect(true);
  };

  const saveAndContinue = (e) => {
    e.preventDefault();
    if (isRoleSelect) {
      props.nextStep(role);
    }
  };

  return (
    <div className="app flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md="9" lg="7" xl="8">
            <div className="card">
              <div className="container">
                <h2 className="register-step2-header">Which describes you best ?</h2>
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
                      setSelectRole('Importer');
                    }}
                  >
                    <Row className="cardRole-pic">
                      <img
                        className="cardRole-pic-img"
                        src="../assets/img/Importer2x.png"
                        alt="admin@bootstrapmaster.com"
                      />
                    </Row>
                    <Row className="cardRole-text">
                      <span className="cardRole-text-span">Importer</span>
                    </Row>
                  </button>
                  <button
                    className="cardRole"
                    type="submit"
                    onClick={() => {
                      setSelectRole('Exporter');
                    }}
                  >
                    <Row className="cardRole-pic">
                      <img
                        className="cardRole-pic-img"
                        src="../assets/img/Exporter2x.png"
                        alt="admin@bootstrapmaster.com"
                      />
                    </Row>
                    <Row className="cardRole-text">
                      <span className="cardRole-text-span">Exporter</span>
                    </Row>
                  </button>
                  <button
                    className="cardRole"
                    type="submit"
                    onClick={() => {
                      setSelectRole('Freight Forwarder');
                    }}
                  >
                    <Row className="cardRole-pic">
                      <img
                        className="cardRole-pic-img"
                        src="../assets/img/FreightF@2x.png"
                        alt="admin@bootstrapmaster.com"
                      />
                    </Row>
                    <Row className="cardRole-text">
                      <span className="cardRole-text-span">Freight Forwarder</span>
                    </Row>
                  </button>
                  <button
                    className="cardRole"
                    type="submit"
                    onClick={() => {
                      setSelectRole('Custom Broker');
                    }}
                  >
                    <Row className="cardRole-pic">
                      <img
                        className="cardRole-pic-img"
                        src="../assets/img/Broker@2x.png"
                        alt="admin@bootstrapmaster.com"
                      />
                    </Row>
                    <Row className="cardRole-text">
                      <span className="cardRole-text-span">Custome Broker</span>
                    </Row>
                  </button>
                </div>
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                  <p style={{ color: '#909090' }}>
                    It's so that we can provide the best onboarding user experience.
                  </p>
                </div>
                <div style={{ paddingBottom: 20 }}>
                  <div className="col-sm-12 text-center">
                    <Button
                      className="button button1"
                      type="submit"
                      onClick={saveAndContinue}
                      disabled={!isRoleSelect}
                    >
                      <span style={{ color: '#fff' }}>Next</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SelectRole;
