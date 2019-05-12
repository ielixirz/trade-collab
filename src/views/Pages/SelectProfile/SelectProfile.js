/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable filenames/match-regex */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import './card.css';

import NewProfileModal from '../../../component/NewProfileModal';

class SelectProfile extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    profiles: PropTypes.array.isRequired,
  };

  goToShipment = () => {
    const { history } = this.props;
    history.push('/shipment');
  };

  renderProfile = profile => (
    <div
      className="cardSelect"
      onClick={() => this.goToShipment(profile)}
      role="button"
      tabIndex={0}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <img
          src="https://scontent.fbkk22-2.fna.fbcdn.net/v/t1.0-9/46491975_2461706807202990_8323584076334235648_n.jpg?_nc_cat=103&_nc_eui2=AeGn67viBaYidmrn_yWeMaX6AMBuov3nYmk0a3llhOLDSXB7ZkYqVOfdhs4ccrLKPCWRey-jjR1i4_oRS7MShnX_GA8CHblXrqXXsouL8Cb7yA&_nc_ht=scontent.fbkk22-2.fna&oh=c2ace08edac9ee9b9fda8bb7632da8c1&oe=5D6A9D95"
          alt="Avatar"
          style={{
            display: 'flex',
            width: 50,
            height: 50,
            borderRadius: 50 / 2,
            marginLeft: 10,
            flex: 0.2,
          }}
        />
        <h4
          style={{
            display: 'flex',
            marginLeft: 20,
            textAlign: 'center',
            flex: 0.8,
          }}
        >
          {profile.ProfileFirstname}
        </h4>
      </div>
    </div>
  );

  renderProfiles = () => {
    const { profiles } = this.props;
    return profiles.map(profile => this.renderProfile(profile));
  };

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <div className="card">
                <div className="container">
                  <h2>Select Profile</h2>
                  {this.renderProfiles()}
                  <div style={{ textAlign: 'center' }}>
                    <NewProfileModal>
                      <p style={{ color: '#16a085' }}>Add New User</p>
                    </NewProfileModal>
                    <p style={{ color: '#16a085' }}>
                      You can have multiple users using the same e-mail address
                    </p>
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

export default connect(state => ({ profiles: state.profileReducer.ProfileList }))(SelectProfile);
