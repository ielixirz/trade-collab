import React, { Component } from 'react';
import {
  Badge,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane
} from 'reactstrap';
import classnames from 'classnames';
import './Chat.css';

class Shipment extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: new Array(4).fill('1')
    };
  }

  lorem() {
    return 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.';
  }

  toggle(tabPane, tab) {
    const newArray = this.state.activeTab.slice();
    newArray[tabPane] = tab;
    this.setState({
      activeTab: newArray
    });
  }
  renderChat() {
    return (
      <div className="inbox_msg">
        <div className="mesgs">
          <div className="msg_history">
            <div className="incoming_msg">
              <div className="received_msg">
                <div className="received_withd_msg">
                  <p className="user-name">Name</p>
                  <p>{this.lorem()}</p>
                  <span className="time_date"> 11:01 AM | June 9</span>
                </div>
              </div>
            </div>
            <div className="outgoing_msg">
              <div className="sent_msg">
                <p>{this.lorem()}</p>
                <span className="time_date"> 11:01 AM | June 9</span>
              </div>
            </div>
            <div className="incoming_msg">
              <div className="received_msg">
                <div className="received_withd_msg">
                  <p className="user-name">Name</p>
                  <p>{this.lorem()}</p>
                  <span className="time_date"> 11:01 AM | Yesterday</span>
                </div>
              </div>
            </div>
            <div className="outgoing_msg">
              <div className="sent_msg">
                <p>{this.lorem()}</p>
                <span className="time_date"> 11:01 AM | Today</span>
              </div>
            </div>
            <div className="incoming_msg">
              <div className="received_msg">
                <div className="received_withd_msg">
                  <p className="user-name">Name</p>
                  <p>{this.lorem()}</p>
                  <span className="time_date"> 11:01 AM | Today</span>
                </div>
              </div>
            </div>
          </div>
          <div className="type_msg">
            <div className="input_msg_write">
              <input
                type="text"
                className="write_msg"
                placeholder="Type a message"
              />
              <button className="msg_send_btn" type="button">
                <i className="fa fa-paper-plane-o" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  tabPane() {
    return (
      <>
        <TabPane tabId="1">{this.renderChat()}</TabPane>
        <TabPane tabId="2">{this.renderChat()}</TabPane>
        <TabPane tabId="3">{this.renderChat()}</TabPane>
      </>
    );
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Nav tabs>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[0] === '1'}
                  onClick={() => {
                    this.toggle(0, '1');
                  }}
                >
                  Internal
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[0] === '2'}
                  onClick={() => {
                    this.toggle(0, '2');
                  }}
                >
                  Exporter
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[0] === '3'}
                  onClick={() => {
                    this.toggle(0, '3');
                  }}
                >
                  Custom
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab[0]}>
              {this.tabPane()}
            </TabContent>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Shipment;
