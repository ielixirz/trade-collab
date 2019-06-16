/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
/* eslint-disable import/no-unresolved */
/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';
import {
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
  UncontrolledCollapse,
  Badge
} from 'reactstrap';
import EdiText from 'react-editext';
import _ from 'lodash';
import { connect } from 'react-redux';
import Tabs from 'react-draggable-tabs';
import { PutFile } from '../../service/storage/managestorage';
import {
  typing,
  fetchMoreMessage,
  fetchChatMessage,
  sendMessage,
  moveTab,
  selectTab,
  getChatRoomList
} from '../../actions/chatActions';

import ChatWithHeader from './components/ChatWithHeader';
import ChatCreateRoom from './components/ChatCreateRoom';

import {
  AddChatRoomMember,
  CreateChatRoom,
  EditChatRoom,
  UpdateChatRoomMessageReader
} from '../../service/chat/chat';
import './Chat.css';
import './MasterDetail.css';
import { GetShipmentDetail } from '../../service/shipment/shipment';
import { GetShipmentNotificationCount } from '../../service/personalize/personalize';
import { GetUserCompany } from '../../service/user/user';
import { fetchCompany } from '../../actions/companyAction';

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
      roomeditor: {},
      onDropChatStyle: false,
      shipments: {},
      chatAlert: []
    };

    this.uploadModalRef = React.createRef();
    this.fileInput = React.createRef();
  }

  createChatRoom(fetchChatMessage, param, room, user) {
    const shipmentkey = _.get(param, 'shipmentkey', 'HDTPONlnceJeG5yAA1Zy');
    CreateChatRoom(shipmentkey, {
      ChatRoomType: room,
      ChatRoomName: room
    }).subscribe({
      next: result => {
        const data = result.path.split('/');
        let chatkey = result.id;
        let ChatRoomMember = AddChatRoomMember(shipmentkey, result.id, {
          ChatRoomMemberUserKey: user.uid,
          ChatRoomMemberEmail: user.email,
          ChatRoomMemberImageUrl: '',
          ChatRoomMemberRole: [room],
          ChatRoomMemberCompanyName: '',
          ChatRoomMemberCompanyKey: ''
        }).subscribe({
          next: result => {
            fetchChatMessage(data[data.length - 1], shipmentkey, chatkey);
            ChatRoomMember.unsubscribe();
          }
        });
      },
      complete: result => {
        console.log(result);
      }
    });
  }

  renderChat(ChatRoomKey = '', ShipmentKey = '') {
    if (ShipmentKey === 'custom') {
      const {
        match: { params }
      } = this.props;
      return (
        <ChatCreateRoom
          createChatRoom={this.createChatRoom}
          fetchChatMessage={this.props.fetchChatMessage}
          param={params}
          user={this.props.user}
        />
      );
    }
    const {
      user,
      ChatReducer,
      onTyping,
      onSendMessage,
      onFetchMoreMessage,
      sender,
      companies
    } = this.props;
    const { text, chatrooms, msg } = ChatReducer;
    const chat = _.get(this.props, `ChatReducer.chatroomsMsg.${ChatRoomKey}`, []);
    const chatMsg = chat.length === 0 ? [] : chat.chatMsg;
    const ChatRoomFileLink = _.get(chatrooms, `[${ChatRoomKey}].ChatRoomData.ChatRoomFileLink`);
    const ChatRoomMember = _.get(chatrooms, `[${ChatRoomKey}].ChatRoomMember`, []);
    const ChatRoomData = _.get(chatrooms, `[${ChatRoomKey}].ChatRoomData`, []);
    const member = _.get(chatrooms, `[${ChatRoomKey}].member`, []);

    return (
      <ChatWithHeader
        alert={this.state.chatAlert}
        msg={msg}
        user={user}
        sender={sender}
        chatMsg={chatMsg}
        ChatRoomData={ChatRoomData}
        text={text}
        companies={companies}
        typing={onTyping}
        members={member}
        uploadModalRef={this.uploadModalRef}
        fileInputRef={this.fileInput}
        ShipmentData={this.state.shipments}
        // Major Key
        ShipmentKey={this.props.match.params.shipmentkey}
        ChatRoomKey={ChatRoomKey}
        ChatRoomFileLink={ChatRoomFileLink}
        ChatRoomMember={ChatRoomMember}
        // Action
        sendMessage={onSendMessage}
        fetchMoreMessage={onFetchMoreMessage}
        browseFile={this.browseFile}
        scrollChatToBottom={this.scrollChatToBottom}
        //   Event
        onDropChatStyle={this.state.onDropChatStyle}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onFileDrop={this.onFileDrop}
        shipments={this.props.shipments}
      />
    );
  }

  browseFile = () => {
    this.fileInput.current.value = null;
    this.fileInput.current.click();
  };

  onFileDrop = (event, ShipmentKey, ChatRoomKey) => {
    event.preventDefault();
    const fileItems = event.dataTransfer.items;
    const files = [];
    _.forEach(fileItems, i => {
      files.push(i.getAsFile());
    });

    // eslint-disable-next-line no-param-reassign
    event.target.value = null;
    this.uploadModalRef.current.triggerUploading(files, ShipmentKey, ChatRoomKey);
    this.setState({
      onDropChatStyle: false
    });
  };

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

  scrollChatToBottom = () => {
    try {
      this.msgChatRef.scrollTop = this.msgChatRef.scrollHeight;
    } catch (e) {
      console.log('is custom tab or something went wrong', e.message);
    }
  };

  closedTab(removedIndex, removedID) {
    this.setState((state, props) => {
      const newTabs = [...state.tabs];
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
      const newTabs = [...state.tabs];
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
    const {
      match: { params }
    } = this.props;
    this.props.getChatRoomList(params.shipmentkey, this.props.user.uid); // MOCK SHIPMENT KEY
    const chats = _.filter(this.props.ChatReducer.chatrooms, item => {
      if (item.ShipmentKey === 'custom') return true;
      return item.ShipmentKey === params.shipmentkey;
    });
    GetShipmentDetail(params.shipmentkey).subscribe({
      next: res => {
        this.setState({
          shipments: {
            ...res.data()
          }
        });
      }
    });
    GetShipmentNotificationCount(this.props.sender.id, params.shipmentkey).subscribe({
      next: res => {
        this.setState({
          chatAlert: res.data()
        });
      }
    });
    const tabs = [];
    _.forEach(chats, (item, index) => {
      tabs.push({
        ChatRoomKey: item.ChatRoomKey,
        ShipmentKey: item.ShipmentKey
      });
    });
    _.forEach(tabs, tab => {
      console.log('fetch', tab);
      this.props.fetchChatMessage(tab.ChatRoomKey, tab.ShipmentKey);
    });
    GetUserCompany(this.props.user.uid).subscribe({
      next: res => {
        console.log('Fetched Company is', res);
        this.props.fetchCompany(res);
      }
    });
  }

  movetab(dragIndex, hoverIndex) {
    this.props.moveTab(dragIndex, hoverIndex);
  }

  render() {
    const {
      match: { params }
    } = this.props;

    const chats = _.filter(this.props.ChatReducer.chatrooms, item => {
      if (item.ShipmentKey === 'custom') {
        return true;
      }
      return item.ShipmentKey === params.shipmentkey;
    });

    let tabs = [];

    _.forEach(chats, (item, index) => {
      let content = (
        <div
          className="noti"
          onDoubleClick={() => {
            if (item.roomName !== '+') {
              this.setState({
                roomeditor: {
                  roomName: item.roomName,
                  ChatRoomKey: item.ChatRoomKey,
                  ShipmentKey: item.ShipmentKey
                }
              });
            }
          }}
        >
          {item.roomName}
          {item.roomName !== '+' ? (
            <Badge pill className="notibadge" color="danger">
              {_.get(this.state, `chatAlert.ChatRoomCount.${item.ChatRoomKey}`, 0) > 0
                ? _.get(this.state, `chatAlert.ChatRoomCount.${item.ChatRoomKey}`, 0)
                : ''}
            </Badge>
          ) : (
            ''
          )}
        </div>
      );
      if (
        this.state.roomeditor.ShipmentKey === item.ShipmentKey &&
        this.state.roomeditor.ChatRoomKey === item.ChatRoomKey
      ) {
        content = (
          <div className="noti">
            <Input
              value={this.state.roomeditor.roomName}
              type="text"
              onChange={e => {
                this.setState({
                  roomeditor: {
                    ...this.state.roomeditor,
                    roomName: e.target.value
                  }
                });
              }}
              onKeyDown={button => {
                if (button.key === 'Enter') {
                  EditChatRoom(item.ShipmentKey, item.ChatRoomKey, {
                    ChatRoomName: this.state.roomeditor.roomName
                  });
                  this.setState({ roomeditor: {} });
                }
              }}
            />
            <Badge pill className="notibadge" color="danger">
              5
            </Badge>
          </div>
        );
      }
      tabs.push({
        id: tabs.length + 1,
        content,
        active: item.active,
        ChatRoomKey: item.ChatRoomKey,
        ShipmentKey: item.ShipmentKey,
        position: item.position,
        member: item.member
      });
    });
    tabs = _.sortBy(tabs, 'position');
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
        />
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
  const { ChatReducer, authReducer, profileReducer, companyReducer, shipmentReducer } = state;

  const sender = _.find(
    profileReducer.ProfileList,
    item => item.id === profileReducer.ProfileDetail.id
  );

  return {
    ChatReducer,
    user: authReducer.user,
    sender,
    shipments: shipmentReducer.Shipments,
    companies: companyReducer.UserCompany
  };
};

export default connect(
  mapStateToProps,
  {
    fetchChatMessage,
    onTyping: typing,
    onFetchMoreMessage: fetchMoreMessage,
    onSendMessage: sendMessage,
    moveTab,
    selectTab,
    getChatRoomList,
    fetchCompany
  }
)(Chat);
