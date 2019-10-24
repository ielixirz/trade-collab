/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable filenames/match-regex */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import { Col, Container, Row } from 'reactstrap';
import './card.css';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

import ErrorPopup from '../../../component/commonPopup/ErrorPopup';
import NewProfileModal from '../../../component/NewProfileModal';
import { getProfileDetail } from '../../../actions/profileActions';
import { isValidProfileImg } from '../../../utils/validation';
import ProfileLoading from '../../../component/svg/ProfileLoading';

class SelectProfile extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    profiles: PropTypes.array.isRequired,
    fetchProfile: PropTypes.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      blocking: false,
    };
    this.errorPopupRef = React.createRef();
  }

  goToShipment = (profile) => {
    const { user, history, fetchProfile } = this.props;
    fetchProfile(user.uid, profile.id, history);
    this.setState({
      blocking: true,
    });
    // using timeout rightnow for workaround
    setTimeout(() => {
      history.push('/shipment');
    }, 2000);
  };

  goToCompany = (profile, companyKey) => {
    const { user, history, fetchProfile } = this.props;
    fetchProfile(user.uid, profile.id, history);
    this.setState({
      blocking: true,
    });
    // using timeout rightnow for workaround
    setTimeout(() => {
      history.push(`/network/company/${companyKey}`);
    }, 2000);
  };

  goToChat = (profile, chatroomKey) => {
    const { user, history, fetchProfile } = this.props;
    fetchProfile(user.uid, profile.id, history);
    this.setState({
      blocking: true,
    });
    // using timeout rightnow for workaround
    setTimeout(() => {
      history.push(`/chat/${chatroomKey}`);
    }, 2000);
  };

  getIn = (profile) => {
    const parsed = queryString.parse(this.props.location.search);
    const { c, s } = parsed;
    if (c !== undefined) {
      this.goToCompany(profile, c);
    } else if (s !== undefined) {
      this.goToChat(profile, s);
    } else {
      this.goToShipment(profile);
    }
  };

  renderProfile = profile => (
    <div
      className="cardSelect"
      onClick={() => this.getIn(profile)}
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
          src={
            profile.UserInfoProfileImageLink === undefined
              ? '../../assets/img/default-grey.jpg'
              : profile.UserInfoProfileImageLink
          }
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
    const renderedProfiles = profiles.map(profile => this.renderProfile(profile));
    if (renderedProfiles.length === 0) {
      return <ProfileLoading />;
    }
    return renderedProfiles;
  };

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <div className="card">
                <div className="container">
                  <BlockUi tag="div" blocking={this.state.blocking}>
                    <h2 className="header-select-profile">Select Profile</h2>
                    <React.Fragment>
                      <div style={{ maxHeight: 400, overflowY: 'scroll' }}>
                        {this.renderProfiles()}
                      </div>
                      {this.props.profiles.length !== 0 ? (
                        <div style={{ textAlign: 'center' }}>
                          <NewProfileModal>
                            <p
                              style={{ color: '#16a085', marginTop: 20 }}
                              className="add-profile-link"
                            >
                              Add New User
                            </p>
                          </NewProfileModal>
                          <p style={{ color: '#16a085' }}>
                            You can have multiple users using the same e-mail address
                          </p>
                        </div>
                      ) : (
                        ''
                      )}
                      <ErrorPopup ref={this.errorPopupRef} />
                    </React.Fragment>
                  </BlockUi>
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
