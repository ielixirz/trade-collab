/* eslint-disable react/prop-types */
// eslint-disable-next-line filenames/match-regex
import React, { Component } from 'react';
import './alert.css';
import { connect } from 'react-redux';
import _ from 'lodash';
import { notificationTitleHelper } from '../../utils/tool';
// eslint-disable-next-line react/prefer-stateless-function
class Alert extends Component {
  render() {
    const { notifications: noti } = this.props;
    let notification = _.orderBy(
      noti,
      item => {
        return new Date(item.UserNotificationTimestamp.seconds * 1000);
      },
      'desc'
    );
    notification = _.map(notification, (item, index) => (
      <div className="container">{notificationTitleHelper(item, index)}</div>
    ));
    return (
      <div
        className="animated fadeIn"
        style={{
          marginTop: '10vh'
        }}
      >
        {notification.map(item => item)}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { authReducer, notiReducer } = state;

  return {
    user: authReducer.user,
    notifications: notiReducer.notifications
  };
};

export default connect(
  mapStateToProps,
  {}
)(Alert);
