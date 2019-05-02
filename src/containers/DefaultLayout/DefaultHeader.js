import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  UncontrolledDropdown,
} from 'reactstrap';
import PropTypes from 'prop-types';

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import './DefaultLayout.css';
import { connect } from 'react-redux';
import logo from '../../assets/img/brand/logo.svg';
import sygnet from '../../assets/img/brand/sygnet.svg';

const propTypes = {
  children: PropTypes.node,
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
            alt: 'CoreUI Logo',
          }}
          minimized={{
            src: sygnet,
            width: 30,
            height: 30,
            alt: 'Y terminal',
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
          <NavItem className="d-md-down-none">
            <NavLink to="/network">
              <i className="fa fa-bell-o fa-lg" style={{ fontWeight: 'bold', color: 'black' }} />
              <Badge
                pill
                color="danger"
                style={{ marginLeft: -8, position: 'absolute', bottom: 10 }}
              >
                5
              </Badge>
            </NavLink>
          </NavItem>
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
              <DropdownItem>Reset</DropdownItem>
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
const mapStateToProps = (state) => {
  const { authReducer } = state;
  return {
    user: authReducer.user,
  };
};

const styles = {
  fontNav: {
    color: '#3B3B3B',
    textDecoration: 'none',
    fontSize: 16,
  },
  marginNav: { marginRight: 18 },
};
export default connect(
  mapStateToProps,
  null,
)(DefaultHeader);
