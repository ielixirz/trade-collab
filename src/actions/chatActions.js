import {
  FETCH_CHAT,
  moveTab as MOVE_TAB,
  SAVE_CREDENCIAL,
  TYPING_TEXT,
  FETCH_CHAT_ROOMS
} from '../constants/constants';
import {
  GetChatMessage,
  CreateChatMessage,
  GetChatRoomList,
  GetChatRoomDetail
} from '../service/chat/chat';
import _ from 'lodash';
import { map } from 'rxjs/operators';

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
      roomName: item.roomName,
      active: item.active,
      ChatRoomKey: item.ChatRoomKey,
      ShipmentKey: item.ShipmentKey,
      ChatRoomData: item.ChatRoomData
    });
  });
  let newTabs = tabs;
  newTabs.splice(hoverIndex, 0, newTabs.splice(dragIndex, 1)[0]);
  let originalReducer = [];
  _.forEach(newTabs, (item, index) => {
    originalReducer[item.ChatRoomKey] = {
      ChatRoomKey: item.ChatRoomKey,
      ShipmentKey: item.ShipmentKey,
      roomName: item.roomName,
      chatMsg: item.chatMsg,
      active: item.active,
      ChatRoomData: item.ChatRoomData
    };
  });

  dispatch({ type: MOVE_TAB, payload: originalReducer });
};

export const selectTab = (selectedIndex, selectedID) => (dispatch, getState) => {
  let chats = getState().ChatReducer.chatrooms;
  let tabs = [];
  _.forEach(chats, (item, index) => {
    tabs.push({
      id: tabs.length + 1,
      roomName: item.roomName,
      active: item.active,
      ChatRoomKey: item.ChatRoomKey,
      ShipmentKey: item.ShipmentKey,
      ChatRoomData: item.ChatRoomData
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
      roomName: item.roomName,
      active: item.active,
      ChatRoomData: item.ChatRoomData
    };
  });
  dispatch({ type: MOVE_TAB, payload: originalReducer });
};

export const sendMessage = (ChatRoomKey, ShipmentKey, text) => (dispatch, getState) => {
  // ShipmentKey,ChatRoomKey,Data
  // {
  //   ChatRoomMessageSender : ProfileKey,
  //     ChatRoomMessageContext : "หวัดดีครับ",
  //   ChatRoomMessageType : "Text",
  //   ChatRoomMessageTimestamp : new Date()
  // }

  const user = getState().authReducer.user;

  if (_.get(user, 'uid', false)) {
    let msg = {
      ChatRoomMessageSender: _.get(user, 'email', 0),
      ChatRoomMessageContext: text,
      ChatRoomMessageType: 'Text',
      ChatRoomMessageTimestamp: new Date()
    };
    CreateChatMessage(ShipmentKey, ChatRoomKey, msg);
    let chats = getState().ChatReducer.chatrooms;
    let tabs = [];
    tabs = _.map(chats, (item, index) => {
      if (item.ChatRoomKey === ChatRoomKey && item.ShipmentKey === ShipmentKey) {
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
    console.log('tabs', tabs);
    let originalReducer = [];
    _.forEach(tabs, (item, index) => {
      originalReducer[item.ChatRoomKey] = {
        ChatRoomKey: item.ChatRoomKey,
        ShipmentKey: item.ShipmentKey,
        roomName: item.roomName,
        active: item.active,
        ChatRoomData: item.ChatRoomData
      };
    });
    dispatch({ type: MOVE_TAB, payload: originalReducer });

    dispatch({
      type: TYPING_TEXT,
      text: ''
    });
  } else {
    alert('please Sign in');
  }
};

export const getChatRoomList = shipmentKey => (dispatch, getState) => {
  //TODO: get chatroom filter by user?
  const user = getState().authReducer.user;

  GetChatRoomList(shipmentKey).subscribe({
    next: snapshot => {
      let originalReducer = [];
      let chatrooms = [];
      snapshot.map((d, index) => {
        let chatRoomKey = d.id;
        let data = d.data();

        chatrooms.push({
          id: index + 1,
          active: index === 0 ? true : false,
          ChatRoomKey: chatRoomKey,
          ShipmentKey: shipmentKey,
          ChatRoomData: data
        });
      });

      _.forEach(chatrooms, c => {
        originalReducer[c.ChatRoomKey] = {
          ChatRoomKey: c.ChatRoomKey,
          ShipmentKey: c.ShipmentKey,
          roomName: c.ChatRoomData.ChatRoomName,
          active: c.active,
          ChatRoomData: c.ChatRoomData
        };
      });

      dispatch({
        type: FETCH_CHAT_ROOMS,
        payload: originalReducer
      });
    },
    error: err => {
      console.log(err);
      alert(err.message);
    },
    complete: () => {}
  });
};
