/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable filenames/match-regex */
import _ from 'lodash';
import React, { Component } from 'react';
import { Breadcrumb, Row, Col, Button, InputGroup, InputGroupAddon, Input } from 'reactstrap';
import Select from 'react-select';
import MemberModal from '../../../component/MemberModal';
import MemberInviteModal from '../../../component/MemberInviteModal';
import UploadModal from '../../../component/UploadModal';
import FileSide from '../FileSide';
import ShipmentSide from '../ShipmentSide';
import ChatMessage from './ChatMessage';
import PreMessage from './PreMessage';
import {
  GetChatRoomMemberList,
  UpdateChatRoomMember,
  UpdateChatRoomMessageReader
} from '../../../service/chat/chat';
import { GetCompanyMember } from '../../../service/company/company';
import { CreateChatMultipleInvitation } from '../../../service/join/invite';
import { moveTab } from '../../../actions/chatActions';
import { PutFile } from '../../../service/storage/managestorage';
import { FETCH_CHAT_MEMBER, FETCH_COMPANY_USER } from '../../../constants/constants';
import { GetUserCompany } from '../../../service/user/user';

const AVAILABLE_ROLES = {
  Importer: 'Exporter',
  Exporter: 'Importer'
};

class ChatWithHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      company: '',
      email: '',
      companies: []
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(prevProps, 'prevProps');
    console.log(this.props, 'props');
    if (prevProps.chatMsg.length !== this.props.chatMsg.length) {
      const objDiv = document.getElementById('chathistory');
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }

  componentDidMount() {
    GetUserCompany(this.props.user.uid).subscribe({
      next: res => {
        this.setState({
          companies: res
        });
      }
    });
  }

  UpdateReader(ShipmentKey, ChatRoomKey, sender, data) {
    const refresh = _.debounce(() => {
      UpdateChatRoomMessageReader(ShipmentKey, ChatRoomKey, sender, data);
    }, 5000);
    refresh();
  }

  handleAssignCompany(e, role, userRole) {
    console.log(e, role, userRole);
    const { ShipmentKey, ChatRoomKey } = this.props;
    const { companies } = this.state;
    const pickedCompany = _.find(companies, item => item.CompanyKey === e.value);
    console.log(pickedCompany);

    GetChatRoomMemberList(ShipmentKey, ChatRoomKey).subscribe({
      next: res => {
        const member = _.map(res, item => {
          console.log(item.data());
          return {
            ChatRoomMemberKey: item.id,
            ...item.data()
          };
        });
        if (pickedCompany) {
          const getCompany = GetCompanyMember(e.value).subscribe({
            next: res => {
              const CompanyMember = _.map(res, item => ({
                ...item.data()
              }));
              const inviteRole = userRole;
              console.log('CompanyMember', CompanyMember);
              const inviteMember = [];
              _.forEach(CompanyMember, memberItem => {
                const chatMember = _.find(
                  member,
                  item => item.ChatRoomMemberEmail === memberItem.UserMemberEmail
                );

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
              console.log('inviteMember', inviteMember);
              const invite = CreateChatMultipleInvitation(
                inviteMember,
                ShipmentKey,
                ChatRoomKey
              ).subscribe({
                next: res => {
                  console.log(res);
                  invite.unsubscribe();
                }
              });
              getCompany.unsubscribe();
            }
          });
        }
      }
    });
  }

  renderAssignCompany(ChatRoomType, hasInvite = false) {
    const { ChatRoomData, user, ShipmentData, ShipmentKey, ChatRoomKey } = this.props;

    const isHaveRole = _.get(ShipmentData, `ShipmentMember.${user.uid}`, {});
    const companies = this.state.companies;

    let options = [];
    options = _.map(companies, item => ({
      value: item.CompanyKey,
      label: item.CompanyName
    }));
    if (_.size(isHaveRole.ShipmentMemberRole) > 0) {
      if (_.isEmpty(isHaveRole.ShipmentMemberCompanyName)) {
        if (ShipmentData.ShipmentCreatorUserKey === user.uid) {
          return (
            <div
              style={{
                backgroundColor: 'rgba(242, 175, 41, 0.3)',
                height: 'auto',
                padding: '10px',
                borderRadius: '5px',
                zIndex: '100'
              }}
            >
              <p
                style={{
                  fontWeight: 700,
                  color: '#000000'
                }}
              >
                You have assigned your self as an {_.join(isHaveRole.ShipmentMemberRole, ',')} for
                this shipment
              </p>
              <p>Select a company, to inform your team about this shipment</p>

              <Row>
                <Col xs={6}>
                  <Select
                    onChange={e => {
                      this.setState({ company: e });
                    }}
                    name="company"
                    options={options}
                    value={this.state.company}
                  />
                </Col>
                <Col xs={2}>
                  <Button
                    className="invite-btn"
                    style={{
                      marginLeft: '2rem',
                      marginRight: '1rem',
                      color: 'white',
                      backgroundColor: '#16A085'
                    }}
                    onClick={() => {
                      this.handleAssignCompany(
                        this.state.company,
                        ChatRoomType,
                        isHaveRole.ShipmentMemberRole
                      );
                    }}
                  >
                    Confirm
                  </Button>
                </Col>
              </Row>
            </div>
          );
        }
        return (
          <div
            style={{
              backgroundColor: 'rgba(242, 175, 41, 0.3)',
              height: 'auto',
              padding: '10px',
              borderRadius: '5px',
              zIndex: '100'
            }}
          >
            <p
              style={{
                fontWeight: 700,
                color: '#000000'
              }}
            >
              {user.email} has been invited as
              {_.join(isHaveRole.ShipmentMemberRole, ',')} for this shipment
            </p>
            <p>Select a company, to inform your team about this shipment</p>

            <Row>
              <Col xs={6}>
                <Select
                  onChange={e => {
                    this.setState({ company: e });
                  }}
                  name="company"
                  options={options}
                  value={this.state.company}
                />
              </Col>
              <Col xs={2}>
                <Button
                  className="invite-btn"
                  style={{
                    marginLeft: '2rem',
                    marginRight: '1rem',
                    color: 'white',
                    backgroundColor: '#16A085'
                  }}
                  onClick={() => {
                    this.handleAssignCompany(
                      this.state.company,
                      ChatRoomType,
                      isHaveRole.ShipmentMemberRole
                    );
                  }}
                >
                  Confirm
                </Button>
              </Col>
            </Row>
          </div>
        );
      }
    }

    if (_.size(ChatRoomData.ChatRoomMemberList) < 2) {
      return (
        <div
          style={{
            backgroundColor: 'rgba(88, 202, 219, 0.3)',
            height: 'auto',
            padding: '10px',
            borderRadius: '5px',
            zIndex: '100'
          }}
        >
          <p
            style={{
              fontWeight: 700,
              color: '#000000'
            }}
          >
            Input your {ChatRoomType} e-mail address only for this shipment
          </p>

          <Row>
            <Col xs={6}>
              <Input
                value={this.state.email}
                placeholder="...input email address"
                onChange={e => this.setState({ email: e.target.value })}
              />
            </Col>
            <Col xs={2}>
              <Button
                className="invite-btn"
                style={{
                  marginLeft: '2rem',
                  marginRight: '1rem',
                  color: 'white',
                  backgroundColor: '#16A085'
                }}
                onClick={() => {
                  const inviteMember = [];
                  const role = [];
                  role.push(ChatRoomType);
                  inviteMember.push({
                    Email: this.state.email,
                    Image: '',
                    Role: role,
                    ChatRoomMemberCompanyName: '',
                    ChatRoomMemberCompanyKey: ''
                  });
                  console.log(inviteMember);
                  const invite = CreateChatMultipleInvitation(
                    inviteMember,
                    ShipmentKey,
                    ChatRoomKey
                  ).subscribe({
                    next: res => {
                      console.log(res);
                      invite.unsubscribe();
                    }
                  });
                }}
              >
                <i style={{ marginRight: '0.5rem' }} className="fa  fa-user-plus fa-lg" />
                Invite
              </Button>
            </Col>
          </Row>
        </div>
      );
    }
  }

  render() {
    const {
      alert,
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
      onFileDrop,
      shipments
    } = this.props;
    let lastkey = '';
    const isInvited = _.find(member, item => item.ChatRoomMemberEmail === user.email);
    let ref = '';
    const ship = _.find(shipments, item => item.ShipmentID === ShipmentKey);
    if (isInvited) {
      if (_.get(ship, 'ShipmentReferenceList', []).length > 0) {
        ref = _.find(
          ship.ShipmentReferenceList,
          item => item.ShipmentReferenceCompanyKey === isInvited.ChatRoomMemberCompanyKey
        );
        console.log(ref, 'reffff');
      }
    } else {
      ref =
        'No Refferenc                                                                                                                                                                                                                         e';
    }

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
            <MemberModal {...this.props} count={member.length} list={member} />

            <Button className="btn-chat-label">|</Button>
            <Button className="btn-chat-label">
              Ref#
              {ref.ShipmentReferenceID}
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
                console.log('lastkey', lastkey);

                if (chatMsg.length > 0) {
                  console.log('chatMsg', chatMsg[chatMsg.length - 1].id);

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
                  ? this.renderAssignCompany(
                      isInvited.ChatRoomMemberRole[0],
                      _.get(isInvited, 'ChatRoomMemberCompanyKey', false)
                    )
                  : ''}
                {chatMsg.map((msg, i) => {
                  const t = new Date(msg.ChatRoomMessageTimestamp.seconds * 1000);
                  let type = 'sender';
                  if (_.get(sender, 'id', '0') === msg.ChatRoomMessageSenderKey) {
                    type = 'reciever';
                  }

                  let message = {};

                  if (msg.ChatRoomMessageType === 'File') {
                    const msgJson = JSON.parse(msg.ChatRoomMessageContext);
                    message = {
                      type,
                      text: msgJson.msg,
                      name: msg.ChatRoomMessageSender,
                      status: t,
                      readers: msg.ChatRoomMessageReader,
                      prev: chatMsg[i - 1],
                      isLast: chatMsg.length - 1 === i,
                      hasFile: true,
                      files: msgJson.files
                    };
                  } else {
                    message = {
                      type,
                      text: msg.ChatRoomMessageContext,
                      name: msg.ChatRoomMessageSender,
                      status: t,
                      readers: msg.ChatRoomMessageReader,
                      prev: chatMsg[i - 1],
                      isLast: chatMsg.length - 1 === i,
                      hasFile: false
                    };
                  }

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
                          event.target.files,
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
                        if (text !== '') {
                          sendMessage(ChatRoomKey, ShipmentKey, text);
                          scrollChatToBottom();
                        }
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
