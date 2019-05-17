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
import { UpdateChatRoomMessageReader } from '../../../service/chat/chat';

class ChatWithHeader extends Component {
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
      ChatRoomKey,
      ChatRoomFileLink,
      ChatRoomMember,
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

    return (
      <div className="inbox_msg" style={{ backgroundColor: 'rgb(247, 247, 247)' }}>
        <Row
          style={{
            backgroundColor: 'white',
            borderBottom: '1px solid #707070'
          }}
        >
          <Breadcrumb className="chat-toolbar">
            <MemberInviteModal ShipmentKey={ShipmentKey} ChatRoomKey={ChatRoomKey} />
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
                      console.log('Updating');
                      if (chatMsg[chatMsg.length - 1].ChatRoomMessageSenderKey !== sender.id) {
                        UpdateChatRoomMessageReader(ShipmentKey, ChatRoomKey, sender.id, {
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
                      if (chatMsg[chatMsg.length - 1].ChatRoomMessageSenderKey !== sender.id) {
                        UpdateChatRoomMessageReader(ShipmentKey, ChatRoomKey, sender.id, {
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
            <ShipmentSide />
          </Col>
        </Row>
      </div>
    );
  }
}

export default ChatWithHeader;
