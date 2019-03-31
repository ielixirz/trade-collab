import React, { Component, useContext, useReducer } from 'react';
import {
  Collapse,
  Button,
  CardBody,
  Card,
  Col,
  InputGroup,
  InputGroupAddon,
  Row,
  TabContent,
  Input,
  TabPane
} from 'reactstrap';

import { typing } from '../../actions/chatActions';
import { connect } from 'react-redux';

import Tabs from 'react-draggable-tabs';
import './Chat.css';
import ShipmentSide from './ShipmentSide';
import FileSide from './FileSide';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.moveTab = this.moveTab.bind(this);
    this.selectTab = this.selectTab.bind(this);
    this.closedTab = this.closedTab.bind(this);
    this.addTab = this.addTab.bind(this);
    this.state = {
      activeTab: new Array(4).fill('1'),
      text: '',
      tabs: [
        {
          id: 1,
          content: 'Exporter',
          active: true,
          display: this.renderChat()
        }
      ]
    };
  }

  moveTab(dragIndex, hoverIndex) {
    this.setState((state, props) => {
      let newTabs = [...state.tabs];
      newTabs.splice(hoverIndex, 0, newTabs.splice(dragIndex, 1)[0]);

      return { tabs: newTabs };
    });
  }
  renderMessage(message) {
    const {
      type = 'sender',
      text = this.lorem(),
      name = 'Anonymous',
      status = '11:01 AM | Today'
    } = message;
    if (type === 'sender') {
      return (
        <div className="incoming_msg">
          <div className="received_msg">
            <div className="received_withd_msg">
              <Row>
                <Col xs="8">
                  <p>
                    <span className="user-name">{name}</span> <br />
                    {text}
                  </p>
                </Col>
                <Col xs={3}>
                  <span className="time_date"> {status}</span>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="outgoing_msg">
          <div className="sent_msg">
            <Row>
              <Col xs={3}>
                <span className="time_date"> {status}</span>
              </Col>
              <Col>
                <p>
                  <span className="user-name">{name}</span> <br />
                  {text}
                </p>
              </Col>
            </Row>
          </div>
        </div>
      );
    }
  }
  renderChat() {
    return (
      <div className="inbox_msg">
        <div className="mesgs">
          <div className="msg_history">
            {this.renderMessage({ type: 'sender' })}
            {this.renderMessage({ type: 'user' })}
            {this.renderMessage({ type: 'user' })}
            {this.renderMessage({ type: 'user' })}
            {this.renderMessage({ type: 'sender' })}
            {this.renderMessage({ type: 'sender' })}
          </div>
          <div className="type_msg">
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <Button color="default">
                  {' '}
                  <i className="fa fa-plus fa-lg" />
                </Button>
              </InputGroupAddon>
              <Input
                placeholder="and..."
                value={this.props.text}
                onChange={this.props.typing}
              />
              <InputGroupAddon addonType="append">
                <Button color="default1"> @</Button>
                <Button color="default1">
                  {' '}
                  <i className="fa fa-smile-o fa-lg" />
                </Button>
                <Button color="default1">
                  {' '}
                  <i className="fa fa-paper-plane-o fa-lg" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      </div>
    );
  }

  selectTab(selectedIndex, selectedID) {
    this.setState((state, props) => {
      const newTabs = state.tabs.map(tab => ({
        ...tab,
        active: tab.id === selectedID
      }));
      return { tabs: newTabs };
    });
  }

  closedTab(removedIndex, removedID) {
    this.setState((state, props) => {
      let newTabs = [...state.tabs];
      newTabs.splice(removedIndex, 1);

      if (state.tabs[removedIndex].active && newTabs.length !== 0) {
        // automatically select another tab if needed
        const newActive = removedIndex === 0 ? 0 : removedIndex - 1;
        newTabs[newActive].active = true;
      }

      return { tabs: newTabs };
    });
  }

  addTab() {
    this.setState((state, props) => {
      let newTabs = [...state.tabs];
      newTabs.push({
        id: newTabs.length + 1,
        content: 'Cute *',
        display: <div key={newTabs.length + 1}>Cute *</div>
      });

      return { tabs: newTabs };
    });
  }

  lorem() {
    return 'Teddy ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.';
  }

  toggle(tabPane, tab) {
    const newArray = this.state.activeTab.slice();
    newArray[tabPane] = tab;
    this.setState({
      activeTab: newArray
    });
  }

  tabPane() {
    return (
      <>
        <TabPane tabId="1">{`1. ${this.lorem()}`}</TabPane>
        <TabPane tabId="2">{`2. ${this.lorem()}`}</TabPane>
        <TabPane tabId="3">{`3. ${this.lorem()}`}</TabPane>
      </>
    );
  }

  render() {
    const activeTab = this.state.tabs.filter(tab => tab.active === true);
    return (
      <div className="animated fadeIn chatbox">
        <Row>
          <Col xs="9">
            <Tabs
              style={{ backgroundColor: 'black' }}
              moveTab={this.moveTab}
              selectTab={this.selectTab}
              closeTab={this.closedTab}
              tabs={this.state.tabs}
            >
              <button onClick={this.addTab}>+</button>
            </Tabs>
            <TabContent>
              {activeTab.length !== 0 ? activeTab[0].display : ''}
            </TabContent>
          </Col>
          <Col xs="3" style={{ backgroundColor: '#F7F7F7' }}>
            <FileSide />
            <ShipmentSide />
          </Col>
        </Row>
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { ChatReducer } = state;
  return {
    ChatReducer
  };
};

export default connect(
  mapStateToProps,
  { typing }
)(Chat);
