/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import _ from 'lodash';
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  UncontrolledDropdown,
  Row,
  Col
} from 'reactstrap';
import PropTypes from 'prop-types';

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import './DefaultLayout.css';
import { connect } from 'react-redux';
import logo from '../../assets/img/brand/logo.svg';
import sygnet from '../../assets/img/brand/sygnet.svg';
import { logout } from '../../actions/loginActions';
import { clearProfile } from '../../actions/profileActions';
import './style.css';
import { fetchUserNotification } from '../../actions/userActions';
import { notificationTitleHelper } from '../../utils/tool';
import notiReducer from '../../reducers/notiReducer';
import { SetUserNotificationRead } from '../../service/user/user';

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
  logout = () => {
    this.props.clearProfile();
    this.props.logout(this.redirect);
  };

  redirect = () => {
    this.props.history.replace('/login');
  };
  componentDidMount() {
    if (this.props.user) {
      this.props.fetchUserNotification(this.props.user.uid);
    }
  }

  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    const notifications = this.props.notifications;
    let notification = _.map(notifications, (item, index) => {
      return notificationTitleHelper(item, index);
    });
    console.log(
      'notifications===>',
      _.filter(notifications, item => item.UserNotificationReadStatus === false)
    );
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{
            src: logo,
            width: 89,
            height: 25,
            alt: 'CoreUI Logo'
          }}
          minimized={{
            src: sygnet,
            width: 30,
            height: 30,
            alt: 'Y terminal'
          }}
        />
        <Nav className="d-md-down-none">
          <NavItem className="px-1" style={styles.marginNav}>
            <NavLink activeClassName="cool-think" to="/shipment" style={styles.fontNav}>
              Shipments
            </NavLink>
          </NavItem>
          <NavItem className="px-1" style={styles.marginNav}>
            <NavLink activeClassName="cool-think" to="/network" style={styles.fontNav}>
              Networks
            </NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar style={styles.marginNav}>
          <UncontrolledDropdown direction="down">
            <DropdownToggle nav>
              <NavItem className="d-md-down-none">
                <NavLink to="#" className="nav-link">
                  <i className="icon-bell" />
                  <Badge pill color="danger">
                    {
                      _.filter(notifications, item => item.UserNotificationReadStatus === false)
                        .length
                    }
                  </Badge>
                </NavLink>
              </NavItem>
            </DropdownToggle>
            <DropdownMenu right className="notification" style={{ right: 'auto' }}>
              <DropdownItem
                header
                style={{
                  backgroundColor: '#277C83'
                }}
                tag="div"
              >
                <span
                  style={{
                    fontWeight: 'bold',
                    float: 'left'
                  }}
                >
                  Notification
                </span>
                <span
                  style={{
                    fontWeight: 'bold',
                    float: 'right'
                  }}
                >
                  <div>
                    <span
                      style={{
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        _.forEach(notifications, item => {
                          SetUserNotificationRead(item.UserNotificationUserInfoKey, item.id);
                        });
                      }}
                    >
                      Mark Read All
                    </span>
                    <span style={{ marginRight: 5, marginLeft: 5, opacity: 0.3 }}>|</span>
                    <i className="icon-settings" />
                  </div>
                </span>
              </DropdownItem>
              {notification.map(item => item)}
              <DropdownItem className="text-center">
                <Link to="/notification">See All</Link>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>

          <UncontrolledDropdown nav inNavbar style={{ marginRight: 5 }}>
            <DropdownToggle nav caret>
              <span style={styles.fontNav}>
                {this.props.user.email ? this.props.user.email : 'USERNAME'}
              </span>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={() => this.logout()}>Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <NavItem className="px-1" style={{ marginRight: 5 }}>
            <span style={{ marginRight: 5, opacity: 0.3 }}>|</span>
            <Link className="cool-link" to="/#" style={styles.fontNav}>
              Help
            </Link>
          </NavItem>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;
const mapStateToProps = state => {
  const { authReducer, notiReducer } = state;
  console.log('default header', state);
  return {
    user: authReducer.user,

    notifications: notiReducer.notifications
  };
};

const styles = {
  fontNav: {
    color: '#3B3B3B',
    textDecoration: 'none',
    fontSize: 16
  },
  marginNav: { marginRight: 18 }
};
export default connect(
  mapStateToProps,
  { logout, clearProfile, fetchUserNotification }
)(DefaultHeader);
