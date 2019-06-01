/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
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
  UncontrolledDropdown,
  Row,
  Col,
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

const propTypes = {
  children: PropTypes.node,
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

  render() {
    const notification = [
      {
        id: 1,
        text: 'Holy.Wisdom has request to join Liam Produce',
        time: new Date(),
        isRead: false,
        sender: 'John',
        type: 'Shipment',
        avatar:
          'https://firebasestorage.googleapis.com/v0/b/yterminal-b0906.appspot.com/o/Profile%2F2sYaYykLYOd5a2D4FPbV%2F1556806598505Screen%20Shot%202562-04-29%20at%2023.54.33.png?alt=media&token=eda3cf62-d247-45dd-97c5-e7c9022a00bb',
        ShipmentKey: 'i5SXjeRcWWLMGd9m4bcg',
      },
      {
        id: 2,
        text: 'Pooh.Elixir has been invite to join Importer Chatroom',
        time: new Date(),
        isRead: true,
        sender: 'Pooh',
        type: 'Chat',
        avatar:
          'https://scontent.fbkk22-2.fna.fbcdn.net/v/t1.0-9/46491975_2461706807202990_8323584076334235648_n.jpg?_nc_cat=103&_nc_eui2=AeGn67viBaYidmrn_yWeMaX6AMBuov3nYmk0a3llhOLDSXB7ZkYqVOfdhs4ccrLKPCWRey-jjR1i4_oRS7MShnX_GA8CHblXrqXXsouL8Cb7yA&_nc_ht=scontent.fbkk22-2.fna&oh=c2ace08edac9ee9b9fda8bb7632da8c1&oe=5D6A9D95',

        ShipmentKey: 'i5SXjeRcWWLMGd9m4bcg',
      },
      {
        id: 3,
        text: 'John_Lee_J.Lee_skytex.com_has_requested_to_join_Y-Terminal_Co._Ltd.',
        time: new Date(),
        isRead: false,
        type: 'Shipment',
        sender: 'Pooh',
        avatar:
          'https://scontent.fbkk22-2.fna.fbcdn.net/v/t1.0-9/46491975_2461706807202990_8323584076334235648_n.jpg?_nc_cat=103&_nc_eui2=AeGn67viBaYidmrn_yWeMaX6AMBuov3nYmk0a3llhOLDSXB7ZkYqVOfdhs4ccrLKPCWRey-jjR1i4_oRS7MShnX_GA8CHblXrqXXsouL8Cb7yA&_nc_ht=scontent.fbkk22-2.fna&oh=c2ace08edac9ee9b9fda8bb7632da8c1&oe=5D6A9D95',
        ShipmentKey: 'i5SXjeRcWWLMGd9m4bcg',
      },
    ];
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
                    float: 'left',
                  }}
                >
                  Notification
                </span>
                <span
                  style={{
                    fontWeight: 'bold',
                    float: 'right',
                  }}
                >
                  <div>
                    <span
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      Mark Read All
                    </span>
                    <span style={{ marginRight: 5, marginLeft: 5, opacity: 0.3 }}>|</span>
                    <i className="icon-settings" />
                  </div>
                </span>
              </DropdownItem>
              {notification.map((item, index) => (
                <DropdownItem
                  key={`notification${index}`}
                  className={item.isRead ? '' : 'highlight'}
                >
                  <div>
                    <div className="message">
                      <div className="pt-3 mr-3 float-left">
                        <div className="avatar">
                          <img src={item.avatar} className="img-avatar" />
                          <span className="avatar-status badge-success" />
                        </div>
                      </div>
                      <div>
                        <small className="text-muted">{item.sender}</small>
                        <small className="text-muted float-right mt-1">
                          {item.time.toLocaleString()}
                        </small>
                      </div>

                      <div className="small text-muted text-truncate">{item.text}</div>
                    </div>
                  </div>
                </DropdownItem>
              ))}
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
  { logout, clearProfile },
)(DefaultHeader);
