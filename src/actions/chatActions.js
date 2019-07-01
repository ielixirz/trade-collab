import _ from 'lodash';
import {
  FETCH_CHAT,
  moveTab as MOVE_TAB,
  TYPING_TEXT,
  FETCH_CHAT_ROOMS,
  SEND_MESSAGE,
  FETCH_CHAT_MEMBER,
  TOGGLE_LOAD
} from '../constants/constants';
import {
  GetChatMessage,
  CreateChatMessage,
  GetChatRoomList,
  GetChatRoomMemberList
} from '../service/chat/chat';
import { ClearUnReadChatMessage } from '../service/personalize/personalize';

export const typing = data => dispatch => {
  const text = data.target.value;
  console.log(text);
  dispatch({
    type: TYPING_TEXT,
    text
  });
};

const chatroom = {};
let chatMessage = null;

export const fetchChatMessage = (ChatRoomKey, ShipmentKey, ChatKey = '') => (
  dispatch,
  getState
) => {
  const { authReducer, profileReducer } = getState();
  // eslint-disable-next-line prefer-destructuring

  const sender = _.find(
    profileReducer.ProfileList,
    item => item.id === profileReducer.ProfileDetail.id
  );
  const room = _.get(chatroom, `${ShipmentKey}.${ChatRoomKey}.message`, false);
  const members = _.get(chatroom, `${ShipmentKey}.${ChatRoomKey}.members`, false);
  if (room) {
    room.unsubscribe();
    if (members) {
      members.unsubscribe();
    }
  }
  _.set(
    chatroom,
    `${ShipmentKey}.${ChatRoomKey}.message`,
    GetChatMessage(ShipmentKey, ChatRoomKey, 25).subscribe({
      next: res => {
        console.log(res);

        dispatch({
          type: FETCH_CHAT,
          id: ChatRoomKey,
          payload: res
        });
        _.set(
          chatroom,
          `${ShipmentKey}.${ChatRoomKey}.member`,
          GetChatRoomMemberList(ShipmentKey, ChatRoomKey).subscribe({
            next: res => {
              console.log('Respond', res);
              const members = _.map(res, item => {
                console.log(item);
                return {
                  ChatRoomMemberKey: item.id,
                  ...item.data()
                };
              });
              dispatch({
                type: FETCH_CHAT_MEMBER,
                id: ChatRoomKey,
                payload: members
              });
            }
          })
        );
      },
      error: err => {
        console.log(err);
        alert(err.message);
      },
      complete: () => {}
    })
  );

  if (!_.isEmpty(ChatKey)) {
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
      active: tab.ChatRoomKey === ChatKey
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
  }
};
export const fetchMoreMessage = (ChatRoomKey, ShipmentKey) => (dispatch, getState) => {
  const chats = _.get(getState().ChatReducer, `chatroomsMsg.${ChatRoomKey}.chatMsg`, []).length;
  const room = _.get(chatroom, `${ShipmentKey}.${ChatRoomKey}.message`, false);
  const members = _.get(chatroom, `${ShipmentKey}.${ChatRoomKey}.members`, false);
  if (room) {
    room.unsubscribe();
    if (members) {
      members.unsubscribe();
    }
  }
  _.set(
    chatroom,
    `${ShipmentKey}.${ChatRoomKey}.message`,
    GetChatMessage(ShipmentKey, ChatRoomKey, chats + 25).subscribe({
      next: res => {
        console.log(res);

        dispatch({
          type: FETCH_CHAT,
          id: ChatRoomKey,
          payload: res
        });
        _.set(
          chatroom,
          `${ShipmentKey}.${ChatRoomKey}.member`,
          GetChatRoomMemberList(ShipmentKey, ChatRoomKey).subscribe({
            next: res => {
              console.log('Respond', res);
              const members = _.map(res, item => {
                console.log(item);
                return {
                  ChatRoomMemberKey: item.id,
                  ...item.data()
                };
              });
              dispatch({
                type: FETCH_CHAT_MEMBER,
                id: ChatRoomKey,
                payload: members
              });
            }
          })
        );
      },
      error: err => {
        console.log(err);
        alert(err.message);
      },
      complete: () => {}
    })
  );
};

export const moveTab = (dragIndex, hoverIndex, chats) => dispatch => {
  const tabs = [];
  _.forEach(chats, item => {
    console.log(item);
    tabs.push({
      id: tabs.length + 1,
      roomName: item.roomName,
      active: item.active,
      ChatRoomKey: item.ChatRoomKey,
      ShipmentKey: item.ShipmentKey,
      ChatRoomData: item.ChatRoomData,
      position: item.position,
      member: item.member
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
      position: index,
      member: item.member
    };
  });

  dispatch({ type: MOVE_TAB, payload: originalReducer });
};

export const selectTab = (selectedIndex, selectedID) => (dispatch, getState) => {
  const chats = getState().ChatReducer.chatrooms;
  const tabs = [];
  console.log('selectedIndex', selectedIndex);
  console.log('selectedID', selectedID);
  _.forEach(chats, item => {
    tabs.push({
      id: tabs.length + 1,
      roomName: item.roomName,
      active: item.active,
      ChatRoomKey: item.ChatRoomKey,
      ShipmentKey: item.ShipmentKey,
      ChatRoomData: item.ChatRoomData,
      position: item.index,
      member: item.member
    });
  });
  console.log(tabs);
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
      position: index,
      member: item.member
    };
    const { ChatRoomKey, ShipmentKey } = item;
    const room = _.get(chatroom, `${ShipmentKey}.${ChatRoomKey}.message`, false);
    const members = _.get(chatroom, `${ShipmentKey}.${ChatRoomKey}.members`, false);
    if (room) {
      room.unsubscribe();
      if (members) {
        members.unsubscribe();
      }
    }
    _.set(
      chatroom,
      `${ShipmentKey}.${ChatRoomKey}.message`,
      GetChatMessage(ShipmentKey, ChatRoomKey, 25).subscribe({
        next: res => {
          console.log(res);

          dispatch({
            type: FETCH_CHAT,
            id: ChatRoomKey,
            payload: res
          });
          _.set(
            chatroom,
            `${ShipmentKey}.${ChatRoomKey}.member`,
            GetChatRoomMemberList(ShipmentKey, ChatRoomKey).subscribe({
              next: res => {
                console.log('Respond', res);
                const members = _.map(res, item => {
                  console.log(item);
                  return {
                    ChatRoomMemberKey: item.id,
                    ...item.data()
                  };
                });
                dispatch({
                  type: FETCH_CHAT_MEMBER,
                  id: ChatRoomKey,
                  payload: members
                });
              }
            })
          );
        },
        error: err => {
          console.log(err);
          alert(err.message);
        },
        complete: () => {}
      })
    );
  });
  dispatch({ type: MOVE_TAB, payload: originalReducer });
};

export const toggleLoading = toggle => (dispatch, getState) => {
  dispatch({
    type: TOGGLE_LOAD,
    payload: toggle
  });
};

export const sendMessage = (ChatRoomKey, ShipmentKey, text, isFile) => (dispatch, getState) => {
  // ShipmentKey,ChatRoomKey,Data
  // {
  //   ChatRoomMessageSender : ProfileKey,
  //     ChatRoomMessageContext : "หวัดดีครับ",
  //   ChatRoomMessageType : "Text",
  //   ChatRoomMessageTimestamp : new Date()
  // }
  const { authReducer, profileReducer } = getState();
  // eslint-disable-next-line prefer-destructuring
  const user = authReducer.user;

  const sender = _.find(
    profileReducer.ProfileList,
    item => item.id === profileReducer.ProfileDetail.id
  );
  let clearUnReadChatMessage = ClearUnReadChatMessage(
    sender.id,
    ShipmentKey,
    ChatRoomKey
  ).subscribe({
    next: res => {
      clearUnReadChatMessage.unsubscribe();
    }
  });
  if (_.get(user, 'uid', false)) {
    let msg = {};
    if (!isFile || isFile === undefined) {
      msg = {
        ChatRoomMessageSender: sender.ProfileFirstname,
        ChatRoomMessageSenderKey: sender.id,
        ChatRoomMessageContext: text,
        ChatRoomMessageType: 'Text',
        ChatRoomMessageTimestamp: new Date()
      };
      dispatch({
        type: SEND_MESSAGE,
        payload: { ...msg, isSending: true, isSuccess: false }
      });
    } else {
      msg = {
        ChatRoomMessageSender: sender.ProfileFirstname,
        ChatRoomMessageSenderKey: sender.id,
        ChatRoomMessageContext: text, // File in the form of Text; Maybe this need to be refactor later.
        ChatRoomMessageType: 'File',
        ChatRoomMessageTimestamp: new Date()
      };
      dispatch({
        type: SEND_MESSAGE,
        payload: { ...msg, isSending: true, isSuccess: false }
      });
    }
    if (text === 'test error') {
      dispatch({
        type: SEND_MESSAGE,
        payload: { ...msg, isSending: true, isSuccess: false }
      });
      _.delay(() => {
        dispatch({
          type: SEND_MESSAGE,
          payload: {
            ...msg,
            isSending: false,
            isSuccess: false,
            ShipmentKey,
            ChatRoomKey
          }
        });
      }, 1000);
    } else {
      _.delay(() => {
        dispatch({
          type: SEND_MESSAGE,
          payload: {}
        });

        chatMessage = CreateChatMessage(ShipmentKey, ChatRoomKey, msg).subscribe({
          next: res => {
            console.log(res);
          },
          error: err => {
            dispatch({
              type: SEND_MESSAGE,
              payload: {
                ...msg,
                isSending: false,
                isSuccess: false,
                ShipmentKey,
                ChatRoomKey
              }
            });
            console.log(err);
            alert(err.message);
          },
          complete: () => {}
        });
      }, 1000);
    }

    dispatch({
      type: TYPING_TEXT,
      text: ''
    });
  } else {
    alert('please Sign in');
  }
};

export const getChatRoomList = (shipmentKey, uid) => dispatch => {
  GetChatRoomList(shipmentKey, uid).subscribe({
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

        const { ChatRoomKey, ShipmentKey } = c;
        const room = _.get(chatroom, `${ShipmentKey}.${ChatRoomKey}.message`, false);
        const members = _.get(chatroom, `${ShipmentKey}.${ChatRoomKey}.members`, false);
        if (room) {
          room.unsubscribe();
          if (members) {
            members.unsubscribe();
          }
        }
        _.set(
          chatroom,
          `${ShipmentKey}.${ChatRoomKey}.message`,
          GetChatMessage(ShipmentKey, ChatRoomKey, 25).subscribe({
            next: res => {
              console.log(res);

              dispatch({
                type: FETCH_CHAT,
                id: ChatRoomKey,
                payload: res
              });
              _.set(
                chatroom,
                `${ShipmentKey}.${ChatRoomKey}.member`,
                GetChatRoomMemberList(ShipmentKey, ChatRoomKey).subscribe({
                  next: res => {
                    console.log('Respond', res);
                    const members = _.map(res, item => {
                      console.log(item);
                      return {
                        ChatRoomMemberKey: item.id,
                        ...item.data()
                      };
                    });
                    dispatch({
                      type: FETCH_CHAT_MEMBER,
                      id: ChatRoomKey,
                      payload: members
                    });
                  }
                })
              );
            },
            error: err => {
              console.log(err);
              alert(err.message);
            },
            complete: () => {}
          })
        );
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
