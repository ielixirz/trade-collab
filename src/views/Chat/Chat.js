/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
/* eslint-disable import/no-unresolved */
/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

import { TabContent, Input, TabPane, Badge } from 'reactstrap';
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
  getChatRoomList,
  toggleLoading,
  newChat,
  selectChatRoom,
  toggleCreateChat
} from '../../actions/chatActions';

import ChatWithHeader from './components/ChatWithHeader';
import ChatCreateRoom from './components/ChatCreateRoom';

import { AddChatRoomMember, CreateChatRoom, EditChatRoom } from '../../service/chat/chat';
import './MasterDetail.css';
import { GetShipmentDetail } from '../../service/shipment/shipment';
import { GetShipmentNotificationCount } from '../../service/personalize/personalize';
import { GetUserCompany } from '../../service/user/user';
import { fetchCompany } from '../../actions/companyAction';
import './Chat.scss';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.moveTab = moveTab.bind(this);
    this.selectTab = this.props.selectTab.bind(this);
    this.selectChat = this.props.selectChat.bind(this);
    this.addTab = this.addTab.bind(this);
    this.putFile = PutFile.bind(this);
    this.createChatRoom = this.createChatRoom.bind(this);
    this.state = {
      activeTab: new Array(4).fill('1'),
      text: '',
      tabs: [],
      roomeditor: {},
      onDropChatStyle: false,
      shipments: {},
      chatAlert: [],
      blocking: false,
      toggleChat: false
    };
    this.toggleBlocking = this.toggleBlocking.bind(this);
    this.toggleCreateChat = this.toggleCreateChat.bind(this);
    this.uploadModalRef = React.createRef();
    this.fileInput = React.createRef();
    this.chatWithHeader = React.createRef();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.roomeditor.ShipmentKey) {
      this.nameInput.focus(true);
    }
    const hasNewChat = _.get(this.props, 'ChatReducer.selectedChat', '');
    if (_.size(hasNewChat) > 2) {
      this.props.selectChat(hasNewChat);
    }
  }

  toggleBlocking = toggle => {
    this.props.toggleLoading(toggle);
  };

  toggleCreateChat = toggle => {
    this.setState({ toggleChat: toggle });
  };

  createChatRoom(fetchChatMessage, param, room, user) {
    const shipmentkey = _.get(param, 'shipmentkey', 'HDTPONlnceJeG5yAA1Zy');
    CreateChatRoom(shipmentkey, {
      ChatRoomType: room,
      ChatRoomName: room
    }).subscribe({
      next: result => {
        const data = result.path.split('/');
        const chatkey = result.id;

        this.props.toggleCreateChat(true);

        const ChatRoomMember = AddChatRoomMember(shipmentkey, result.id, {
          ChatRoomMemberUserKey: user.uid,
          ChatRoomMemberEmail: user.email,
          ChatRoomMemberImageUrl: '',
          ChatRoomMemberRole: [room],
          ChatRoomMemberCompanyName: '',
          ChatRoomMemberCompanyKey: ''
        }).subscribe({
          next: res => {
            fetchChatMessage(data[data.length - 1], shipmentkey, chatkey);
            this.props.newChat(chatkey);
            this.props.toggleCreateChat(false);

            ChatRoomMember.unsubscribe();
          }
        });
      },
      complete: result => {}
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
        ref={this.chatWithHeader}
        alert={this.state.chatAlert}
        network={this.props.network}
        msg={msg}
        user={user}
        sender={sender}
        chatMsg={chatMsg}
        ChatRoomData={ChatRoomData}
        text={text}
        companies={companies}
        typing={onTyping}
        members={member}
        toggleBlocking={this.toggleBlocking}
        toggleCreateChat={this.toggleCreateChat}
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

  scrollChildChatToBottom = () => {
    this.chatWithHeader.current.scrollChatToBottom();
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

  closedTab(removedIndex) {
    this.setState(state => {
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
    this.setState(state => {
      const newTabs = [...state.tabs];
      newTabs.push({
        id: newTabs.length + 1,
        content: 'Cute *',
        display: <div key={newTabs.length + 1}>Cute *</div>
      });

      return { tabs: newTabs };
    });
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
    _.forEach(chats, item => {
      tabs.push({
        ChatRoomKey: item.ChatRoomKey,
        ShipmentKey: item.ShipmentKey
      });
    });
    _.forEach(tabs, tab => {
      this.props.fetchChatMessage(tab.ChatRoomKey, tab.ShipmentKey, this.scrollChildChatToBottom);
    });
    GetUserCompany(this.props.user.uid).subscribe({
      next: res => {
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
    let chats = _.filter(this.props.ChatReducer.chatrooms, item => {
      if (item.ShipmentKey === 'custom') {
        return true;
      }
      return item.ShipmentKey === params.shipmentkey;
    });
    const hasNewChat = _.get(this.props, 'ChatReducer.selectedChat', '');
    if (_.size(hasNewChat) > 2) {
      if (_.find(chats, item => item.ChatRoomKey === hasNewChat)) {
        chats = _.map(chats, (item, index) => {
          if (item.ChatRoomKey === hasNewChat) {
            return {
              ...item,
              active: true
            };
          } else {
            return {
              ...item,
              active: false
            };
          }
        });
      }
    }

    let tabs = [];

    _.forEach(chats, item => {
      let content = (
        <div
          className={item.roomName === '+' ? 'create-new-chat-tab' : 'noti'}
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
              ref={input => {
                this.nameInput = input;
              }}
              value={this.state.roomeditor.roomName}
              type="text"
              maxLength={40}
              onChange={e => {
                this.setState({
                  roomeditor: {
                    ...this.state.roomeditor,
                    roomName: e.target.value
                  }
                });
              }}
              onBlur={e => {
                EditChatRoom(item.ShipmentKey, item.ChatRoomKey, {
                  ChatRoomName: this.state.roomeditor.roomName
                });
                this.setState({ roomeditor: {} });
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
    let itemToReplace = {};
    let createChatIndex = _.find(tabs, (item, index) => {
      if (item.ShipmentKey === 'custom') {
        itemToReplace = tabs.splice(index, 1);
        return true;
      }
      return false;
    });
    tabs = tabs.concat(itemToReplace);
    console.log('Tabs list is', tabs);
    const activeTab = tabs.filter(tab => tab.active === true);
    const toggle = this.props.ChatReducer.toggle;
    const createChat = this.props.ChatReducer.createChat || false;
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
          <BlockUi tag="div" blocking={toggle || this.state.toggleChat} style={{ height: '100%' }}>
            {activeTab.length !== 0 ? (
              this.renderChat(activeTab[0].ChatRoomKey, activeTab[0].ShipmentKey)
            ) : (
              <BlockUi tag="div" blocking style={{ height: '100%' }}>
                <div style={{ height: '74vh' }} />
              </BlockUi>
            )}
          </BlockUi>
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
  const user = authReducer.user;
  sender.uid = user.uid;
  return {
    ChatReducer,
    user,
    sender,
    shipments: shipmentReducer.Shipments,
    companies: companyReducer.UserCompany,
    network: companyReducer.NetworkEmail
  };
};

export default connect(
  mapStateToProps,
  {
    fetchChatMessage,
    onTyping: typing,
    newChat,
    onFetchMoreMessage: fetchMoreMessage,
    onSendMessage: sendMessage,
    toggleLoading,
    toggleCreateChat,
    moveTab,
    selectTab,
    selectChat: selectChatRoom,
    getChatRoomList,
    fetchCompany
  }
)(Chat);
