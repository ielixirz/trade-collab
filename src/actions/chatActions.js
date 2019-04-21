import _ from 'lodash';
import {
  FETCH_CHAT,
  moveTab as MOVE_TAB,
  TYPING_TEXT,
  FETCH_CHAT_ROOMS
} from '../constants/constants';
import { GetChatMessage, CreateChatMessage, GetChatRoomList } from '../service/chat/chat';

export const typing = data => dispatch => {
  const text = data.target.value;
  console.log(text);
  dispatch({
    type: TYPING_TEXT,
    text
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

export const moveTab = (dragIndex, hoverIndex, chats) => dispatch => {
  const tabs = [];
  _.forEach(chats, item => {
    tabs.push({
      id: tabs.length + 1,
      roomName: item.roomName,
      active: item.active,
      ChatRoomKey: item.ChatRoomKey,
      ShipmentKey: item.ShipmentKey,
      ChatRoomData: item.ChatRoomData,
      position: item.position
    });
  });

  const movingItem = tabs[dragIndex];
  tabs.splice(dragIndex, 1);
  tabs.splice(hoverIndex, 0, movingItem);

  const originalReducer = [];
  _.forEach(tabs, (item, index) => {
    originalReducer[item.ChatRoomKey] = {
      ChatRoomKey: item.ChatRoomKey,
      ShipmentKey: item.ShipmentKey,
      roomName: item.roomName,
      chatMsg: item.chatMsg,
      active: item.active,
      ChatRoomData: item.ChatRoomData,
      position: index
    };
  });
  dispatch({ type: MOVE_TAB, payload: originalReducer });
};

export const selectTab = (selectedIndex, selectedID) => (dispatch, getState) => {
  const chats = getState().ChatReducer.chatrooms;
  const tabs = [];
  _.forEach(chats, item => {
    tabs.push({
      id: tabs.length + 1,
      roomName: item.roomName,
      active: item.active,
      ChatRoomKey: item.ChatRoomKey,
      ShipmentKey: item.ShipmentKey,
      ChatRoomData: item.ChatRoomData,
      position: item.index
    });
  });
  const newTabs = tabs.map(tab => ({
    ...tab,
    active: tab.id === selectedID
  }));
  const originalReducer = [];
  _.forEach(newTabs, (item, index) => {
    originalReducer[item.ChatRoomKey] = {
      ChatRoomKey: item.ChatRoomKey,
      ShipmentKey: item.ShipmentKey,
      roomName: item.roomName,
      active: item.active,
      ChatRoomData: item.ChatRoomData,
      position: index
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
  console.log(getState().authReducer);
  // eslint-disable-next-line prefer-destructuring
  const user = getState().authReducer.user;
  console.log(user);
  if (_.get(user, 'uid', false)) {
    const msg = {
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

export const getChatRoomList = shipmentKey => dispatch => {
  GetChatRoomList(shipmentKey).subscribe({
    next: snapshot => {
      const originalReducer = [];
      const chatrooms = [];
      snapshot.map((d, index) => {
        const chatRoomKey = d.id;
        const data = d.data();

        chatrooms.push({
          id: index + 1,
          active: index === 0,
          ChatRoomKey: chatRoomKey,
          ShipmentKey: shipmentKey,
          ChatRoomData: data,
          position: index
        });
        return true;
      });

      _.forEach(chatrooms, (c, index) => {
        originalReducer[c.ChatRoomKey] = {
          ChatRoomKey: c.ChatRoomKey,
          ShipmentKey: c.ShipmentKey,
          roomName: c.ChatRoomData.ChatRoomName,
          active: c.active,
          ChatRoomData: c.ChatRoomData,
          position: index
        };
      });

      originalReducer.custom = {
        ChatRoomKey: 'custom',
        ShipmentKey: 'custom',
        roomName: '+',
        active: false,
        ChatRoomData: [],
        position: chatrooms.length
      };

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
