import {
  FETCH_CHAT,
  moveTab as MOVE_TAB,
  SAVE_CREDENCIAL,
  TYPING_TEXT
} from '../constants/constants';
import { GetChatMessage, CreateChatMessage } from '../service/chat/chat';
import _ from 'lodash';

export const typing = data => dispatch => {
  let text = data.target.value;
  console.log(text);
  dispatch({
    type: TYPING_TEXT,
    text: text
  });
};

export const fetchChatMessage = (ChatRoomKey, ShipmentKey) => dispatch => {
  console.log('trigger Fetch');
  GetChatMessage(ShipmentKey, ChatRoomKey).subscribe({
    next: res => {
      dispatch({
        type: FETCH_CHAT,
        id: ChatRoomKey,
        payload: res
      });
    },
    error: err => {
      console.log(err);
      alert(err.message);
    },
    complete: () => {}
  });
};

export const moveTab = (dragIndex, hoverIndex) => (getState, dispatch) => {
  let chats = getState().ChatReducer.chatrooms;
  let tabs = [];
  _.forEach(chats, (item, index) => {
    tabs.push({
      id: tabs.length + 1,
      content: item.roomName,
      active: item.active,
      ChatRoomKey: item.ChatRoomKey,
      ShipmentKey: item.ShipmentKey,
      chatMsg: item.chatMsg
    });
  });
  let newTabs = tabs;
  newTabs.splice(hoverIndex, 0, newTabs.splice(dragIndex, 1)[0]);
  let originalReducer = [];
  _.forEach(newTabs, (item, index) => {
    originalReducer[item.ChatRoomKey] = {
      ChatRoomKey: item.ChatRoomKey,
      ShipmentKey: item.ShipmentKey,
      roomName: 'Exporter',
      chatMsg: item.chatMsg,
      active: item.active
    };
  });

  dispatch({ type: MOVE_TAB, payload: originalReducer });
};

export const selectTab = (selectedIndex, selectedID) => (
  dispatch,
  getState
) => {
  let chats = getState().ChatReducer.chatrooms;
  let tabs = [];
  _.forEach(chats, (item, index) => {
    tabs.push({
      id: tabs.length + 1,
      content: item.roomName,
      active: item.active,
      ChatRoomKey: item.ChatRoomKey,
      ShipmentKey: item.ShipmentKey,
      chatMsg: item.chatMsg
    });
  });
  const newTabs = tabs.map(tab => ({
    ...tab,
    active: tab.id === selectedID
  }));
  let originalReducer = [];
  _.forEach(newTabs, (item, index) => {
    originalReducer[item.ChatRoomKey] = {
      ChatRoomKey: item.ChatRoomKey,
      ShipmentKey: item.ShipmentKey,
      roomName: 'Exporter',
      chatMsg: item.chatMsg,
      active: item.active
    };
  });
  dispatch({ type: MOVE_TAB, payload: originalReducer });
};

export const sendMessage = (ChatRoomKey, ShipmentKey, text) => (
  dispatch,
  getState
) => {
  // ShipmentKey,ChatRoomKey,Data
  // {
  //   ChatRoomMessageSender : ProfileKey,
  //     ChatRoomMessageContext : "หวัดดีครับ",
  //   ChatRoomMessageType : "Text",
  //   ChatRoomMessageTimestamp : new Date()
  // }
  console.log(getState().authReducer);
  const user = getState().authReducer.user;
  console.log(user);
  if (_.get(user, 'uid', false)) {
    let msg = {
      ChatRoomMessageSender: _.get(user, 'email', 0),
      ChatRoomMessageContext: text,
      ChatRoomMessageType: 'Text',
      ChatRoomMessageTimestamp: new Date()
    };
    CreateChatMessage(ShipmentKey, ChatRoomKey, msg);
    dispatch({
      type: TYPING_TEXT,
      text: ''
    });
  } else {
    alert('please Sign in');
  }
};
