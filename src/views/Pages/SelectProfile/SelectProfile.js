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
import { getProfileDetail } from '../../../actions/profileActions';

class SelectProfile extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    profiles: PropTypes.array.isRequired,
    fetchProfile: PropTypes.isRequired,
  };

  goToShipment = (profile) => {
    const { user, history, fetchProfile } = this.props;
    fetchProfile(user.uid, profile.id, history);
  };

  renderProfile = profile => (
    <div
      className="cardSelect"
      onClick={() => this.goToShipment(profile)}
      role="button"
      tabIndex={0}
      key={profile.id}
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
          src="//placehold.it/50"
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
                      <p style={{ color: '#16a085' }}>
                        <b>Add New User</b>
                      </p>
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

export default connect(
  state => ({
    user: state.authReducer.user,
    profiles: state.profileReducer.ProfileList,
  }),
  { fetchProfile: getProfileDetail },
)(SelectProfile);
