/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable filenames/match-regex */
import _ from 'lodash';
import React, { Component } from 'react';
import { Breadcrumb, Row, Col, Button, InputGroup, InputGroupAddon, Input } from 'reactstrap';
import MemberModal from '../../../component/MemberModal';
import MemberInviteModal from '../../../component/MemberInviteModal';
import UploadModal from '../../../component/UploadModal';
import FileSide from '../FileSide';
import ShipmentSide from '../ShipmentSide';
import ChatMessage from './ChatMessage';
import PreMessage from './PreMessage';
import { UpdateChatRoomMember, UpdateChatRoomMessageReader } from '../../../service/chat/chat';
import Select from 'react-select';
import { GetCompanyMember } from '../../../service/company/company';
import { CreateChatMultipleInvitation } from '../../../service/join/invite';

const AVAILABLE_ROLES = {
  Importer: 'Exporter',
  Exporter: 'Importer'
};

class ChatWithHeader extends Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    const objDiv = document.getElementById('chathistory');
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  UpdateReader(ShipmentKey, ChatRoomKey, sender, data) {
    const refresh = _.debounce(() => {
      UpdateChatRoomMessageReader(ShipmentKey, ChatRoomKey, sender, data);
    }, 5000);
    refresh();
  }
  handleAssignCompany(e, role) {
    console.log(this.props);
    const { companies, member, ShipmentKey, ChatRoomKey } = this.props;
    console.log('member', member);
    const pickedCompany = _.find(companies, item => item.CompanyKey === e.value);

    if (pickedCompany) {
      GetCompanyMember(e.value).subscribe({
        next: res => {
          let CompanyMember = _.map(res, item => {
            return {
              ...item.data()
            };
          });
          let inviteRole = [];
          inviteRole.push(role);
          console.log('CompanyMember', CompanyMember);
          let inviteMember = [];
          _.forEach(CompanyMember, memberItem => {
            let chatMember = _.find(
              member,
              item => item.ChatRoomMemberEmail === memberItem.UserMemberEmail
            );

            // ChatRoomMemberEmail: "punjasin@gmail.com"
            // ChatRoomMemberKey: "DtUSy9J4aYzu7tGWjHUK"
            // ChatRoomMemberRole: (2) ["Custom Broker Outbound", "Forwarder Outbound"]
            // ChatRoomMemberUserKey: "v4q6ksx4AhaMbekVLvWl0dKuaWf2"
            if (chatMember) {
              const result = UpdateChatRoomMember(
                ShipmentKey,
                ChatRoomKey,
                chatMember.ChatRoomMemberKey,
                {
                  ...chatMember,
                  ChatRoomMemberCompanyName: pickedCompany.CompanyName,
                  ChatRoomMemberCompanyKey: pickedCompany.CompanyKey
                }
              );
              console.log(result);
            } else {
              // Email: "punjasin@gmail.com"
              // Image: undefined
              // Role: (2) ["Custom Broker Outbound", "Forwarder Outbound"]

              inviteMember.push({
                Email: memberItem.UserMemberEmail,
                Image: '',
                Role: inviteRole,
                ChatRoomMemberCompanyName: pickedCompany.CompanyName,
                ChatRoomMemberCompanyKey: pickedCompany.CompanyKey
              });
            }
          });
          console.log(inviteMember);
          CreateChatMultipleInvitation(inviteMember, ShipmentKey, ChatRoomKey).subscribe({
            next: res => {
              console.log(res);
            }
          });
        }
      });
    }
  }
  renderAssignCompany(ChatRoomType, hasInvite = false) {
    const { companies } = this.props;

    let options = [];
    options = _.map(companies, item => {
      return {
        value: item.CompanyKey,
        label: item.CompanyName
      };
    });

    if (hasInvite) {
      return (
        <div
          style={{
            backgroundColor: 'rgba(242, 175, 41, 0.3)',
            height: 'auto',
            padding: '10px',
            borderRadius: '5px'
          }}
        >
          <p
            style={{
              fontWeight: 700,
              color: '#000000'
            }}
          >
            You have been invited you as {ChatRoomType} for this shipment.
          </p>
          <p>Choose the company you want to use to handle this shipment</p>

          <div>
            <Select
              onChange={e => {
                this.handleAssignCompany(e, ChatRoomType);
              }}
              name="company"
              options={options}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={{
            backgroundColor: 'rgba(242, 175, 41, 0.3)',
            height: 'auto',
            padding: '10px',
            borderRadius: '5px'
          }}
        >
          <p
            style={{
              fontWeight: 700,
              color: '#000000'
            }}
          >
            You have assigned your self as an {ChatRoomType} for this shipment
          </p>
          <p>Select a company, to inform your team about this shipment</p>

          <div>
            <Select
              onChange={e => {
                this.handleAssignCompany(e, ChatRoomType);
              }}
              name="company"
              options={options}
            />
          </div>
        </div>
      );
    }
  }
  render() {
    const {
      user,
      msg: sending,
      chatMsg,
      text,
      typing,
      uploadModalRef,
      fileInputRef,
      sender,
      ShipmentKey,
      ShipmentData = {},
      member,
      ChatRoomKey,
      ChatRoomFileLink,
      ChatRoomMember,
      ChatRoomData: { ChatRoomType },
      // Action
      sendMessage,
      fetchMoreMessage,
      browseFile,
      scrollChatToBottom,
      //   Event
      onDropChatStyle,
      onDragOver,
      onDragLeave,
      onFileDrop
    } = this.props;
    let lastkey = '';
    let isInvited = _.find(member, item => item.ChatRoomMemberEmail === user.email);
    console.log('isInvited', isInvited);
    return (
      <div className="inbox_msg" style={{ backgroundColor: 'rgb(247, 247, 247)' }}>
        <Row
          style={{
            backgroundColor: 'white',
            borderBottom: '1px solid #707070'
          }}
        >
          <Breadcrumb className="chat-toolbar">
            <MemberInviteModal
              ShipmentKey={ShipmentKey}
              ChatRoomKey={ChatRoomKey}
              member={member}
            />
            <Button className="btn-chat-label">|</Button>
            <MemberModal count={ChatRoomMember.length} />
            <Button className="btn-chat-label">|</Button>
            <Button className="btn-chat-label">
              Ref#
              {ChatRoomKey}
            </Button>
          </Breadcrumb>
        </Row>
        <Row>
          <Col xs="8" style={{ backgroundColor: 'white', marginTop: '0.5rem' }}>
            <div
              className="mesgs"
              style={onDropChatStyle === false ? {} : { opacity: '0.5' }}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={event => onFileDrop(event, ShipmentKey, ChatRoomKey)}
              onMouseEnter={() => {
                if (chatMsg.length > 0) {
                  if (chatMsg[chatMsg.length - 1].id !== lastkey) {
                    this.UpdateReader(ShipmentKey, ChatRoomKey, sender.id, {
                      ChatRoomMessageReaderFirstName: sender.ProfileFirstname,
                      ChatRoomMessageReaderSurName: sender.ProfileSurname,
                      ChatRoomMessageReaderProfileImageUrl: _.get(
                        sender,
                        'UserInfoProfileImageLink',
                        ''
                      ),
                      ChatRoomMessageReaderLastestMessageKey: chatMsg[chatMsg.length - 1].id
                    });
                  }
                  lastkey = chatMsg[chatMsg.length - 1].id;
                }
              }}
            >
              <div
                id="chathistory"
                className="msg_history"
                onScroll={() => {
                  const div = document.getElementById('chathistory').scrollTop;
                  if (div === 0) {
                    fetchMoreMessage(ChatRoomKey, ShipmentKey);
                  }
                }}
                ref={el => {
                  this.msgChatRef = el;
                }}
              >
                {_.get(this.props.ShipmentData, 'ShipmentCreatorUserKey', false) === user.uid
                  ? this.renderAssignCompany(this.props.ShipmentData.ShipmentCreatorType)
                  : isInvited
                  ? this.renderAssignCompany(isInvited.ChatRoomMemberRole[0], true)
                  : ''}
                {chatMsg.map((msg, i) => {
                  const t = new Date(msg.ChatRoomMessageTimestamp.seconds * 1000);
                  let type = 'sender';
                  if (_.get(sender, 'id', '0') === msg.ChatRoomMessageSenderKey) {
                    type = 'reciever';
                  }
                  const message = {
                    type,
                    text: msg.ChatRoomMessageContext,
                    name: msg.ChatRoomMessageSender,
                    status: t,
                    readers: msg.ChatRoomMessageReader,
                    prev: chatMsg[i - 1],
                    isLast: chatMsg.length - 1 === i
                  };

                  return <ChatMessage message={message} i={i} />;
                })}
                {_.isEmpty(sending) ? '' : <PreMessage message={sending} callback={sendMessage} />}
              </div>
              <div className="type_msg">
                <UploadModal
                  chatFile={ChatRoomFileLink}
                  sendMessage={sendMessage}
                  ref={uploadModalRef}
                />
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <Button color="default" onClick={() => browseFile(ShipmentKey)}>
                      {' '}
                      <i className="fa fa-plus fa-lg" />
                    </Button>
                    <input
                      type="file"
                      id="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={event =>
                        uploadModalRef.current.triggerUploading(
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
                    onMouseEnter={() => {
                      if (chatMsg.length > 0) {
                        if (chatMsg[chatMsg.length - 1].id !== lastkey) {
                          this.UpdateReader(ShipmentKey, ChatRoomKey, sender.id, {
                            ChatRoomMessageReaderFirstName: sender.ProfileFirstname,
                            ChatRoomMessageReaderSurName: sender.ProfileSurname,
                            ChatRoomMessageReaderProfileImageUrl: _.get(
                              sender,
                              'UserInfoProfileImageLink',
                              ''
                            ),
                            ChatRoomMessageReaderLastestMessageKey: chatMsg[chatMsg.length - 1].id
                          });
                        }
                        lastkey = chatMsg[chatMsg.length - 1].id;
                      }
                    }}
                    onChange={e => {
                      // (ShipmentKey, ChatRoomKey, ProfileKey, Data)
                      // ChatRoomMessageKeyList *(Static document name) (Create for util)
                      // ChatRoomMessageKeyList (Array<string>)
                      // >ProfileKey
                      // ChatRoomMessageReaderFirstName (string)
                      // ChatRoomMessageReaderSurName (string)
                      // ChatRoomMessageReaderProfileImageUrl (string)
                      // ChatRoomMessageReaderLastestMessageKey (string)
                      //
                      // id(pin): "2ZUpe18haaMfMHKPn0ku"
                      // Description(pin): "punnie"
                      // ProfileEmail(pin): "sdasd@asdasd.com"
                      // ProfileFirstname(pin): "Punjasin"
                      // ProfileSurname(pin): "Punya"
                      // UserInfoProfileImageLink

                      if (chatMsg.length > 0) {
                        if (chatMsg[chatMsg.length - 1].id !== lastkey) {
                          this.UpdateReader(ShipmentKey, ChatRoomKey, sender.id, {
                            ChatRoomMessageReaderFirstName: sender.ProfileFirstname,
                            ChatRoomMessageReaderSurName: sender.ProfileSurname,
                            ChatRoomMessageReaderProfileImageUrl: _.get(
                              sender,
                              'UserInfoProfileImageLink',
                              ''
                            ),
                            ChatRoomMessageReaderLastestMessageKey: chatMsg[chatMsg.length - 1].id
                          });
                        }
                        lastkey = chatMsg[chatMsg.length - 1].id;
                      }
                      typing(e);
                    }}
                    onKeyPress={event => {
                      if (event.key === 'Enter') {
                        sendMessage(ChatRoomKey, ShipmentKey, text);
                        scrollChatToBottom();
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
                        sendMessage(ChatRoomKey, ShipmentKey, text);
                        scrollChatToBottom();
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
              chatFile={ChatRoomFileLink}
              shipmentKey={ShipmentKey}
              chatroomKey={ChatRoomKey}
            />
            <ShipmentSide shipmentKey={ShipmentKey} chatroomKey={ChatRoomKey} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default ChatWithHeader;
