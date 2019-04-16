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
  ButtonGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import _ from 'lodash';
import { GetChatMessage } from '../../service/chat/chat';
import { PutFile } from '../../service/storage/managestorage';

import {
  typing,
  fetchChatMessage,
  sendMessage,
  moveTab,
  selectTab,
  getChatRoomList
} from '../../actions/chatActions';

import { connect } from 'react-redux';

import Tabs from 'react-draggable-tabs';
import './Chat.css';
import ShipmentSide from './ShipmentSide';
import FileSide from './FileSide';
import UploadModal from '../../component/UploadModal';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.moveTab = moveTab.bind(this);
    this.selectTab = this.props.selectTab.bind(this);
    this.addTab = this.addTab.bind(this);
    this.putFile = PutFile.bind(this);
    this.state = {
      activeTab: new Array(4).fill('1'),
      text: '',
      tabs: [],
      onDropChatStyle: false
    };

    this.uploadModalRef = React.createRef();
    this.fileInput = React.createRef();
  }

  renderMessage(message, i) {
    console.log('renderMessage', message);

    const {
      type = 'sender',
      text = this.lorem(),
      name = 'Anonymous',
      status = new Date()
    } = message;
    let prev = _.get(message, 'prev', false);
    let isFirstMessageOfTheDay = false;
    if (prev) {
      let t = new Date(prev.ChatRoomMessageTimestamp.seconds * 1000);
      console.log(t.toDateString());
      console.log(status.toDateString());

      if (t.toDateString() === status.toDateString()) {
        console.log('*** Same day ***');
      } else {
        isFirstMessageOfTheDay = true;
      }
    } else {
      console.log('first message');
      isFirstMessageOfTheDay = true;
    }
    if (type === 'sender') {
      return (
        <div key={i}>
          {isFirstMessageOfTheDay ? (
            <h2 class="time-background">
              <span className="time-seperation" align="center">
                {status.toDateString() === new Date().toDateString()
                  ? 'Today'
                  : status.toDateString()}
              </span>
            </h2>
          ) : (
            ''
          )}
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
                  <Col xs={4}>
                    <span className="time_date"> {status.toLocaleTimeString()}</span>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div key={i}>
          {isFirstMessageOfTheDay ? (
            <h2 class="time-background">
            <span className="time-seperation" align="center">
              {status.toDateString() === new Date().toDateString()
                ? 'Today'
                : status.toDateString()}
            </span>
          </h2>
          ) : (
            ''
          )}
          <div className="outgoing_msg">
            <div className="sent_msg">
              <Row>
                <Col xs={4}>
                  <span className="time_date"> {status.toLocaleTimeString()}</span>
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
        </div>
      );
    }
  }

  renderChat(ChatRoomKey = '', ShipmentKey = '') {
    if (ShipmentKey === 'custom') {
      return (
        <Card>
          <CardBody>
            <Row>
              <Col xs={4} />
              <Col xs={4} className="text-lg-center">
                Inform Other Party about this shipments
              </Col>
              <Col xs={4} />
            </Row>
            <Row
              style={{
                marginTop: '100px',
                marginBottom: '100px'
              }}
            >
              <Col />
              <Col className="text-lg-center">
                <Button color="primary" size="lg" active>
                  Inbound Custom Broker
                </Button>
              </Col>
              <Col className="text-lg-center">
                <Button color="primary" size="lg" active>
                  Inbound Forwarder
                </Button>
              </Col>
              <Col />
            </Row>
            <Row
              style={{
                marginTop: '100px',
                marginBottom: '100px'
              }}
            >
              <Col />
              <Col className="text-lg-center">
                <Button color="primary" size="lg" active>
                  Importer
                </Button>
              </Col>
              <Col className="text-lg-center">
                <Button color="primary" size="lg" active>
                  Outbound Forwarder
                </Button>
              </Col>
              <Col />
            </Row>
          </CardBody>
        </Card>
      );
    } else {
      let chat = _.get(this.props, `ChatReducer.chatroomsMsg.${ChatRoomKey}`, []);
      let chatMsg = chat.length === 0 ? [] : chat.chatMsg;
      const text = this.props.ChatReducer.text;
      return (
        <div className="inbox_msg" style={{ backgroundColor: 'rgb(247, 247, 247)' }}>
          <Row
            style={{
              backgroundColor: 'white',
              borderBottom: '1px solid #707070'
            }}
          >
            <Breadcrumb className="chat-toolbar">
              <Button
                className="invite-btn"
                style={{
                  marginLeft: '2rem',
                  marginRight: '1rem',
                  color: 'white',
                  backgroundColor: '#16A085'
                }}
              >
                <i style={{ marginRight: '0.5rem' }} className="fa  fa-user-plus fa-lg" />
                Invite
              </Button>
              <Button className="btn-chat-label">|</Button>
              <Button className="btn-chat-label">
                <i style={{ marginRight: '0.5rem' }} className="fa  fa-users fa-lg" />
                14
              </Button>
              <Button className="btn-chat-label">|</Button>
              <Button className="btn-chat-label">Ref#1234</Button>
            </Breadcrumb>
          </Row>
          <Row>
            <Col xs="8" style={{ backgroundColor: 'white', marginTop: '0.5rem' }}>
              <div
                className="mesgs"
                style={this.state.onDropChatStyle === false ? {} : { opacity: '0.5' }}
                onDragOver={this.onDragOver}
                onDragLeave={this.onDragLeave}
                onDrop={event => this.onFileDrop(event, ShipmentKey, ChatRoomKey)}
              >
                <div
                  className="msg_history"
                  ref={el => {
                    this.msgChatRef = el;
                  }}
                >
                  {chatMsg.map((msg, i) => {
                    var t = new Date(msg.ChatRoomMessageTimestamp.seconds * 1000);
                    let type = 'sender';

                    if (_.get(this.props, 'user.email', '0') === msg.ChatRoomMessageSender) {
                      type = 'reciever';
                    }
                    let message = {
                      type: type,
                      text: msg.ChatRoomMessageContext,
                      name: msg.ChatRoomMessageSender,
                      status: t,
                      prev: chatMsg[i - 1]
                    };

                    return this.renderMessage(message, i);
                  })}
                </div>
                <div className="type_msg">
                  <UploadModal
                    chatFile={
                      this.props.ChatReducer.chatrooms[ChatRoomKey].ChatRoomData.ChatRoomFileLink
                    }
                    sendMessage={this.props.sendMessage}
                    ref={this.uploadModalRef}
                  />
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <Button color="default" onClick={() => this.browseFile(ShipmentKey)}>
                        {' '}
                        <i className="fa fa-plus fa-lg" />
                      </Button>
                      <input
                        type="file"
                        id="file"
                        ref={this.fileInput}
                        style={{ display: 'none' }}
                        onChange={event =>
                          this.uploadModalRef.current.triggerUploading(
                            event.target.files[0],
                            ShipmentKey,
                            ChatRoomKey
                          )
                        }
                      />
                    </InputGroupAddon>
                    <Input
                      placeholder="type...."
                      value={text}
                      onChange={this.props.typing}
                      onKeyPress={event => {
                        if (event.key === 'Enter') {
                          console.log('Enter press', event);
                          this.props.sendMessage(ChatRoomKey, ShipmentKey, text);
                        }
                      }}
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
              <FileSide
                chatFile={
                  this.props.ChatReducer.chatrooms[ChatRoomKey].ChatRoomData.ChatRoomFileLink
                }
              />
              <ShipmentSide />
            </Col>
          </Row>
        </div>
      );
    }
  }

  browseFile() {
    this.fileInput.current.value = null;
    this.fileInput.current.click();
  }

  onFileDrop(event, ShipmentKey, ChatRoomKey) {
    event.preventDefault();
    let file = event.dataTransfer.items[0].getAsFile();
    event.target.value = null;
    this.uploadModalRef.current.triggerUploading(file, ShipmentKey, ChatRoomKey);
    this.setState({
      onDropChatStyle: false
    });
  }

  onDragOver = event => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      onDropChatStyle: true
    });
  };

  onDragLeave = event => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      onDropChatStyle: false
    });
  };

  onDragEnter = event => {
    event.preventDefault();
  };

  scrollChatToBottom() {
    try {
      this.msgChatRef.scrollTop = this.msgChatRef.scrollHeight;
    } catch (e) {
      console.log('is custom tab or something went wrong', e.message);
    }
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
  componentDidUpdate() {
    this.scrollChatToBottom();
  }

  componentDidMount() {
    this.props.getChatRoomList(`HDTPONlnceJeG5yAA1Zy`); //MOCK SHIPMENT KEY
    let chats = this.props.ChatReducer.chatrooms;
    console.log(chats);
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
    const activeTab = tabs.filter(tab => tab.active === true);
    _.forEach(tabs, tab => {
      this.props.fetchChatMessage(tab.ChatRoomKey, tab.ShipmentKey);
    });
  }
  movetab(dragIndex, hoverIndex) {
    let chats = this.props.ChatReducer.chatrooms;

    this.props.moveTab(dragIndex, hoverIndex);
  }

  render() {
    const chats = this.props.ChatReducer.chatrooms;
    let tabs = [];

    _.forEach(chats, (item, index) => {
      tabs.push({
        id: tabs.length + 1,
        content: item.roomName,
        active: item.active,
        ChatRoomKey: item.ChatRoomKey,
        ShipmentKey: item.ShipmentKey,
        position: item.position
      });
    });
    tabs = _.sortBy(tabs, 'position');
    console.log('sorted tab is', tabs);
    const activeTab = tabs.filter(tab => tab.active === true);
    return (
      <div className="animated fadeIn chatbox">
        <Tabs
          style={{ backgroundColor: 'black' }}
          moveTab={(hoverIndex, dragIndex) => {
            this.props.moveTab(hoverIndex, dragIndex, chats);
          }}
          selectTab={this.props.selectTab}
          tabs={tabs}
        >
          <button onClick={this.addTab}>+</button>
        </Tabs>
        <TabContent>
          {activeTab.length !== 0
            ? this.renderChat(activeTab[0].ChatRoomKey, activeTab[0].ShipmentKey)
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
  { typing, fetchChatMessage, sendMessage, moveTab, selectTab, getChatRoomList }
)(Chat);
