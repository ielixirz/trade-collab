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
  TabPane,
  Breadcrumb,
  ButtonGroup
} from 'reactstrap';
import _ from 'lodash';
import { GetChatMessage } from '../../service/chat/chat';

import {
  typing,
  fetchChatMessage,
  sendMessage,
  moveTab,
  selectTab
} from '../../actions/chatActions';
import { connect } from 'react-redux';

import Tabs from 'react-draggable-tabs';
import './Chat.css';
import ShipmentSide from './ShipmentSide';
import FileSide from './FileSide';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.moveTab = this.props.moveTab.bind(this);
    this.selectTab = this.props.selectTab.bind(this);
    this.addTab = this.addTab.bind(this);
    this.state = {
      activeTab: new Array(4).fill('1'),
      text: '',
      tabs: []
    };
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
  renderChat(ChatRoomKey = '', ShipmentKey = '') {
    let chat = _.get(this.props, `ChatReducer.chatrooms.${ChatRoomKey}`, {});

    const text = this.props.ChatReducer.text;
    return (
      <div
        className="inbox_msg"
        style={{ backgroundColor: 'rgb(247, 247, 247)' }}
      >
        <Row
          style={{
            backgroundColor: 'white',
            borderBottom: '1px solid #707070'
          }}
        >
          <Breadcrumb className="chat-toolbar">
            <Button
              style={{ marginLeft: '2rem', marginRight: '1rem' }}
              color="success"
            >
              Invite
            </Button>
            <Button className="btn-chat-label">|</Button>
            <Button className="btn-chat-label">Member: 14</Button>
            <Button className="btn-chat-label">|</Button>
            <Button className="btn-chat-label">Ref#123</Button>
          </Breadcrumb>
        </Row>
        <Row>
          <Col xs="8" style={{ backgroundColor: 'white', marginTop: '0.5rem' }}>
            <div className="mesgs">
              <div className="msg_history">
                {chat.chatMsg.map((msg, i) => {
                  console.log(msg);
                  var t = new Date(msg.ChatRoomMessageTimestamp.seconds * 1000);
                  let type = 'sender';

                  if (
                    _.get(this.props, 'user.uid', '0') ===
                    msg.ChatRoomMessageSender
                  ) {
                    console.log('user is', _.get(this.props, 'user.uid', '0'));
                    type = 'reciever';
                  }
                  let message = {
                    type: type,
                    text: msg.ChatRoomMessageContext,
                    name: msg.ChatRoomMessageSender,
                    status: t.toLocaleString()
                  };
                  console.log(message);
                  return this.renderMessage(message);
                })}
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
                    value={text}
                    onChange={this.props.typing}
                  />
                  <InputGroupAddon addonType="append">
                    <Button color="default1"> @</Button>
                    <Button color="default1">
                      {' '}
                      <i className="fa fa-smile-o fa-lg" />
                    </Button>
                    <Button
                      color="default1"
                      onClick={() => {
                        console.log(
                          'Sending Message',
                          ChatRoomKey,
                          ShipmentKey,
                          text
                        );
                        console.log(text);
                        this.props.sendMessage(ChatRoomKey, ShipmentKey, text);
                      }}
                    >
                      {' '}
                      <i className="fa fa-paper-plane-o fa-lg" />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          </Col>
          <Col xs="4" style={{ paddingLeft: '0.3rem', marginTop: '0.6rem' }}>
            <FileSide />
            <ShipmentSide />
          </Col>
        </Row>
      </div>
    );
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
  componentDidUpdate() {}

  componentDidMount() {
    let chats = this.props.ChatReducer.chatrooms;
    let tabs = [];
    _.forEach(chats, (item, index) => {
      tabs.push({
        id: tabs.length + 1,
        content: item.roomName,
        active: item.active,
        ChatRoomKey: item.ChatRoomKey,
        ShipmentKey: item.ShipmentKey
      });
    });
    console.log(chats);
    const activeTab = tabs.filter(tab => tab.active === true);
    this.props.fetchChatMessage(
      activeTab[0].ChatRoomKey,
      activeTab[0].ShipmentKey
    );
  }

  render() {
    let chats = this.props.ChatReducer.chatrooms;
    let tabs = [];
    _.forEach(chats, (item, index) => {
      tabs.push({
        id: tabs.length + 1,
        content: item.roomName,
        active: item.active,
        ChatRoomKey: item.ChatRoomKey,
        ShipmentKey: item.ShipmentKey
      });
    });
    console.log(chats);
    const activeTab = tabs.filter(tab => tab.active === true);
    return (
      <div className="animated fadeIn chatbox">
        <Tabs
          style={{ backgroundColor: 'black' }}
          moveTab={this.props.moveTab}
          selectTab={this.props.selectTab}
          tabs={tabs}
        >
          <button onClick={this.addTab}>+</button>
        </Tabs>
        <TabContent>
          {activeTab.length !== 0
            ? this.renderChat(
                activeTab[0].ChatRoomKey,
                activeTab[0].ShipmentKey
              )
            : ''}
        </TabContent>
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { ChatReducer, authReducer } = state;
  return {
    ChatReducer,
    user: authReducer.user
  };
};

export default connect(
  mapStateToProps,
  { typing, fetchChatMessage, sendMessage, moveTab, selectTab }
)(Chat);
