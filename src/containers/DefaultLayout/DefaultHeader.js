/* eslint-disable react/prefer-stateless-function */
/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  UncontrolledDropdown
} from 'reactstrap';
import PropTypes from 'prop-types';

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import './DefaultLayout.css';
import { connect } from 'react-redux';
import logo from '../../assets/img/brand/logo.svg';
import sygnet from '../../assets/img/brand/sygnet.svg';
import { logout } from '../../actions/loginActions';
import './style.css';
const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    console.log('props', this.props);
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
                    5
                  </Badge>
                </NavLink>
              </NavItem>
            </DropdownToggle>
            <DropdownMenu right className="notification" style={{ right: 'auto' }}>
              <DropdownItem header tag="div">
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
                    >
                      Mark Read All
                    </span>
                    <span style={{ marginRight: 5, marginLeft: 5, opacity: 0.3 }}>|</span>
                    <i className="icon-settings" />
                  </div>
                </span>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-bell-o" /> Updates<Badge color="info">42</Badge>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-envelope-o" /> Messages<Badge color="success">42</Badge>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-tasks" /> Tasks<Badge color="danger">42</Badge>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-comments" /> Comments<Badge color="warning">42</Badge>
              </DropdownItem>
              <DropdownItem header tag="div" className="text-center">
                <strong>Settings</strong>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-user" /> Profile
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-wrench" /> Settings
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-usd" /> Payments<Badge color="secondary">42</Badge>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-file" /> Projects<Badge color="primary">42</Badge>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
                <i className="fa fa-shield" /> Lock Account
              </DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}>
                <i className="fa fa-lock" /> Logout
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
              <DropdownItem>Option 1</DropdownItem>
              <DropdownItem>Option 2</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
                <a onClick={() => this.props.logout()}>logout</a>
              </DropdownItem>
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
  const { authReducer } = state;
  return {
    user: authReducer.user
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
  { logout }
)(DefaultHeader);
