/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable filenames/match-regex */
import _ from 'lodash';
import React, { Component } from 'react';
import {
  Breadcrumb,
  Row,
  Col,
  Button,
  InputGroup,
  InputGroupAddon,
  Input,
  UncontrolledPopover,
  PopoverBody,
  Label,
  Form,
  FormGroup
} from 'reactstrap';
import Select from 'react-select';
import Autocomplete from 'react-autocomplete';
import MemberModal from '../../../component/MemberModal';
import UploadModal from '../../../component/UploadModal';
import TextLoading from '../../../component/svg/TextLoading';
import FileSide from '../FileSide';
import ShipmentSide from '../ShipmentSide';
import ChatMessage from './ChatMessage';
import PreMessage from './PreMessage';
import ChatInviteBar from './ChatInviteBar';
import {
  AddChatRoomMember,
  CreateChatRoom,
  EditChatRoom,
  UpdateChatRoomMember,
  UpdateChatRoomMessageReader
} from '../../../service/chat/chat';
import { GetCompanyMember } from '../../../service/company/company';
import { CreateChatMultipleInvitation } from '../../../service/join/invite';
import { ClearUnReadChatMessage } from '../../../service/personalize/personalize';
import TableLoading from '../../../component/svg/TableLoading';
import {
  AddShipmentRole,
  CreateShipmentReference,
  GetAvailableRole,
  GetShipmentDetail,
  GetShipmentReferenceList,
  UpdateShipmentReference
} from '../../../service/shipment/shipment';

const AVAILABLE_ROLES = {
  Importer: 'Exporter',
  Exporter: 'Importer'
};
let lastkey = '';
class ChatWithHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      company: '',
      email: '',
      refs: [],
      companies: [],
      role: [],
      refID: '',
      members: [],
      shipment: {},
      toggleInvite: false,
      availableRole: {},
      isAssign: false,
      input: {
        refs: [],
        newRef: {
          ShipmentReferenceID: '',
          ShipmentReferenceCompanyName: '',
          ShipmentReferenceCompanyKey: ''
        }
      },

      submiting: {},
      sideCollpase: 'SHIPMENT'
    };

    this.msgChatRef = React.createRef();
  }

  componentWillMount() {
    const { ShipmentKey } = this.props;
    GetShipmentDetail(ShipmentKey).subscribe({
      next: res => {
        let result = [];
        const shipments = res.data();
        console.log('ShipmentData', shipments);

        GetShipmentReferenceList(ShipmentKey).subscribe({
          next: refres => {
            this.setState({ refs: refres });
            console.log('getAll Ref');
            result[0] = {
              ...shipments,
              ShipmentID: ShipmentKey,
              ShipmentReferenceList: refres
            };
            this.props.fetchShipments(result, {});
          }
        });
        this.setState({
          shipment: res.data()
        });
      }
    });
  }

  componentDidMount() {
    const { ShipmentKey, ChatRoomKey, sender } = this.props;
    if (this.multilineTextarea) {
      this.multilineTextarea.style.height = '50px ';
    }
    ClearUnReadChatMessage(sender.id, ShipmentKey, ChatRoomKey).subscribe({
      next: () => {}
    });

    GetAvailableRole(ShipmentKey, ChatRoomKey).subscribe({
      next: res => {
        this.setState({
          availableRole: res
        });
        console.log({ GetAvailableRole: res });
      }
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.chatMsg.length !== this.props.chatMsg.length ||
      prevProps.msg !== this.props.msg
    ) {
      this.scrollChatToBottom();
    }
    const { ShipmentKey, ChatRoomKey, sender, chatMsg } = this.props;

    if (chatMsg.length > 0) {
      if (chatMsg[chatMsg.length - 1].id !== lastkey) {
        this.UpdateReader(ShipmentKey, ChatRoomKey, sender.id, {
          ChatRoomMessageReaderFirstName: sender.ProfileFirstname,
          ChatRoomMessageReaderSurName: sender.ProfileSurname,
          ChatRoomMessageReaderProfileImageUrl: _.get(sender, 'UserInfoProfileImageLink', ''),
          ChatRoomMessageReaderLastestMessageKey: chatMsg[chatMsg.length - 1].id
        });
        ClearUnReadChatMessage(sender.id, ShipmentKey, ChatRoomKey).subscribe({
          next: () => {}
        });
      }
      lastkey = chatMsg[chatMsg.length - 1].id;
    }
  }

  triggerSideCollapse = side => {
    this.setState({
      sideCollpase: side
    });
  };

  scrollChatToBottom = () => {
    try {
      this.msgChatRef.scrollTop = this.msgChatRef.scrollHeight;
    } catch (e) {
      console.log('is custom tab or something went wrong', e.message);
    }
  };

  toggleInviteComponent(toggle) {
    this.setState({
      toggleInvite: !toggle
    });
  }

  UpdateReader(ShipmentKey, ChatRoomKey, sender, data) {
    const refresh = _.debounce(() => {
      UpdateChatRoomMessageReader(ShipmentKey, ChatRoomKey, sender, data);
    }, 5000);
    refresh();
  }

  handleAssignCompany(e, role, ref) {
    const { ShipmentKey, ChatRoomKey, members, user } = this.props;
    const { companies } = this.props;

    const memberData = _.find(members, (item, index) => index === user.uid);
    const pickedCompany = _.find(companies, item => item.CompanyKey === e.value);
    console.log({ input: e, role, ref, pickedCompany: pickedCompany });

    AddShipmentRole(ShipmentKey, role.value, {
      ShipmentRoleCompanyName: pickedCompany.CompanyName,
      ShipmentRoleCompanyKey: pickedCompany.CompanyKey
    });
    let userRole;
    if (pickedCompany) {
      const getCompany = GetCompanyMember(e.value).subscribe({
        next: res => {
          const CompanyMember = _.map(res, item => ({
            ...item.data()
          }));
          const inviteRole = [];
          inviteRole.push(role.value);
          const inviteMember = [];
          if (memberData) {
            const result = UpdateChatRoomMember(
              ShipmentKey,
              ChatRoomKey,
              memberData.ChatRoomMemberKey,
              {
                ...memberData,
                ChatRoomMemberCompanyName: pickedCompany.CompanyName,
                ChatRoomMemberCompanyKey: pickedCompany.CompanyKey
              }
            );
          }
          _.forEach(CompanyMember, memberItem => {
            const chatMember = _.find(
              members,
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
            }
            inviteMember.push({
              Email: memberItem.UserMemberEmail,
              Image: '',
              Role: inviteRole,
              ChatRoomMemberCompanyName: pickedCompany.CompanyName,
              ChatRoomMemberCompanyKey: pickedCompany.CompanyKey
            });
          });
          if (_.get(memberData, 'ChatRoomMemberIsLeave', false) === false) {
            this.props.toggleCreateChat(true);
            CreateChatRoom(ShipmentKey, {
              ChatRoomType: 'Internal',
              ChatRoomName: 'Internal'
            }).subscribe({
              next: result => {
                console.log(inviteMember, 'inviteMember List');
                const data = result.path.split('/');
                const chatkey = result.id;
                const invite = CreateChatMultipleInvitation(
                  _.filter(inviteMember, item => item.Email !== user.email),
                  ShipmentKey,
                  chatkey,
                  this.props.sender
                ).subscribe({
                  next: res => {
                    console.log('Invite Result');
                    this.props.fetchMoreMessage(chatkey, ShipmentKey);
                  }
                });
                const ChatRoomMember = AddChatRoomMember(ShipmentKey, chatkey, {
                  ChatRoomMemberUserKey: this.props.user.uid,
                  ChatRoomMemberEmail: this.props.user.email,
                  ChatRoomMemberImageUrl: '',
                  ChatRoomMemberRole: inviteRole,
                  ChatRoomMemberCompanyName: pickedCompany.CompanyName,
                  ChatRoomMemberCompanyKey: pickedCompany.CompanyKey
                }).subscribe({
                  next: result => {},
                  complete: () => {
                    CreateShipmentReference(ShipmentKey, {
                      ShipmentReferenceID: ref,
                      ShipmentReferenceCompanyKey: pickedCompany.CompanyKey,
                      ShipmentReferenceCompanyName: pickedCompany.CompanyName,
                      ShipmentKey: ShipmentKey
                    }).subscribe({});
                    ChatRoomMember.unsubscribe();
                  }
                });
              },
              complete: result => {
                this.props.toggleCreateChat(false);
              }
            });
            getCompany.unsubscribe();
          } else {
            window.alert('You has been remove from the chat');
          }
        }
      });
    }
  }

  renderAssignCompany() {
    const { user, ShipmentData, ShipmentKey, ChatRoomKey, members: member, shipments } = this.props;
    const members = _.get(shipments, `${ShipmentKey}.ShipmentMember`, []);
    console.log('Shipments member', members);
    console.log('renderAssignCompany members', members);
    const memberData = _.find(members, (item, index) => item.ShipmentMemberEmail === user.email);
    console.log('Member Data', memberData);
    // const isHaveRole = _.get(ShipmentData, `ShipmentMember.${user.uid}`, {});
    const { companies } = this.props;

    let options = [];
    options = _.map(companies, item => ({
      value: item.CompanyKey,
      label: item.CompanyName
    }));

    let roleOption = [];
    _.forEach(this.state.availableRole, (role, index) => {
      console.log('ROLE', role, index);
      if (!role) {
        roleOption.push({
          value: index,
          label: index
        });
      }
    });
    console.log('memberData', memberData);
    let output = '';

    if (roleOption.length == 0) {
      return '';
    }
    if (_.get(memberData, 'ShipmentMemberCompanyKey', '') === '') {
      output = (
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
            You have been invite to this shipment
          </p>
          <p>Select a Company and Role, to inform your team about this shipment</p>

          <Row>
            <Col xs={4}>
              <Select
                onChange={e => {
                  this.setState({ company: e });
                }}
                name="company"
                placeholder="Select Company"
                options={options}
                value={this.state.company}
              />
            </Col>
            <Col xs={3}>
              <Select
                onChange={e => {
                  this.setState({ role: e });
                }}
                placeholder="Select Role"
                name="company"
                options={roleOption}
                value={this.state.role}
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
                disabled={
                  _.isEmpty(this.state.company) ||
                  _.isEmpty(this.state.role) ||
                  _.isEmpty(this.state.refID) ||
                  this.state.isAssign
                }
                onClick={() => {
                  this.setState({ isAssign: true });
                  this.handleAssignCompany(this.state.company, this.state.role, this.state.refID);
                }}
              >
                Confirm
              </Button>
            </Col>
          </Row>
          <br />
          <Row>
            <Col xs="auto">
              <Form inline>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Label for="exampleEmail" className="mr-sm-2">
                    REF #
                  </Label>
                  <Input
                    type="text"
                    onChange={e => {
                      this.setState({ refID: e.target.value });
                    }}
                    name="ref"
                    id="ref"
                    value={this.state.refID}
                    placeholder="Reference Number"
                  />
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </div>
      );
      return output;
    }
  }

  renderInviteComponent() {
    return (
      <ChatInviteBar
        chatRoomKey={this.props.ChatRoomKey}
        shipmentKey={this.props.ShipmentKey}
        sender={this.props.sender}
        member={this.props.members}
        shipmentData={this.props.ShipmentData}
        toggleInvite={() => this.toggleInviteComponent(true)}
      />
    );
  }

  renderRefComponent(index, ref, shipmentKey, ShipmentMember) {
    const { user, companies } = this.props;
    const userCompany = [];
    let refs = [];
    refs = _.map(ref, item => item);
    const userrefs = _.filter(ref, refItem =>
      _.some(companies, item => _.includes(refItem.ShipmentReferenceCompanyKey, item.CompanyKey))
    );
    console.log('companies', companies);
    console.log('ShipmentMember', ShipmentMember);
    const hasCompany = _.get(ShipmentMember, `${user.uid}`, {});

    const alreadyHave = !_.isEmpty(userrefs);
    return (
      <div>
        <Button id={`popover${index}`} className="text-yterminal">
          {userrefs.length > 0 ? (
            <b style={{ color: 'black' }}>{userrefs[0].ShipmentReferenceID}</b>
          ) : _.isEmpty(companies) ? (
            <b>See Refs</b>
          ) : !_.isEmpty(hasCompany.ShipmentMemberCompanyName) ? (
            <b>Input your Ref#!</b>
          ) : (
            <b>See Refs</b>
          )}
        </Button>
        <UncontrolledPopover
          trigger="legacy"
          placement="bottom"
          className="yterminalRef"
          target={`popover${index}`}
        >
          <PopoverBody>
            {!alreadyHave ? (
              <Row
                style={{
                  marginBottom: '5px'
                }}
              >
                <Col xs={1} />
                <Col xs={5} style={{ paddingTop: 5 }}>
                  <Label check>
                    {_.isEmpty(hasCompany.ShipmentMemberCompanyName)
                      ? 'Please Assign Company'
                      : hasCompany.ShipmentMemberCompanyName}
                  </Label>
                </Col>
                <Col xs={5}>
                  <Input
                    type="text"
                    name={`shipmentRefID${ref.length + 1}`}
                    id={`shipmentRefID${ref.length + 1}`}
                    disabled={_.isEmpty(hasCompany.ShipmentMemberCompanyName)}
                    value={
                      _.isEmpty(hasCompany.ShipmentMemberCompanyName)
                        ? 'N/A'
                        : this.state.input.newRef.ShipmentReferenceID
                    }
                    onChange={e => {
                      const { value } = e.target;
                      this.setState({
                        input: {
                          newRef: {
                            ...this.state.input.newRef,
                            ShipmentReferenceID: value,
                            ShipmentReferenceCompanyKey: hasCompany.ShipmentMemberCompanyKey,
                            ShipmentReferenceCompanyName: hasCompany.ShipmentMemberCompanyName,
                            ShipmentKey: shipmentKey
                          }
                        }
                      });
                    }}
                    onBlur={e => {
                      console.log('Un Focus ref trigger');
                      if (_.get(this.state.submiting, `${shipmentKey}.isSubmit`, false) === false) {
                        this.setState({
                          submiting: {
                            ...this.state.submiting,
                            [shipmentKey]: {
                              isSubmit: true
                            }
                          }
                        });
                        CreateShipmentReference(shipmentKey, this.state.input.newRef).subscribe({
                          next: res => {
                            this.setState({
                              submiting: {
                                ...this.state.submiting,
                                [shipmentKey]: {
                                  refid: res.id,
                                  isSubmit: true
                                }
                              }
                            });
                          }
                        });
                      } else if (_.get(this.state.submiting, `${shipmentKey}.refid`, 0) !== 0) {
                        UpdateShipmentReference(
                          shipmentKey,
                          _.get(this.state.submiting, `${shipmentKey}.refid`, 0),
                          this.state.input.newRef
                        );
                      }
                    }}
                    onKeyPress={_.debounce(
                      async event => {
                        if (event.key === 'Enter') {

                          const confirmation = true;
                          console.log('Enter', confirmation);
                          if (confirmation === true) {
                            if (
                              _.get(this.state.submiting, `${shipmentKey}.isSubmit`, false) ===
                              false
                            ) {
                              this.setState({
                                submiting: {
                                  ...this.state.submiting,
                                  [shipmentKey]: {
                                    isSubmit: true
                                  }
                                }
                              });
                              CreateShipmentReference(
                                shipmentKey,
                                this.state.input.newRef
                              ).subscribe({
                                next: res => {
                                  this.setState({
                                    submiting: {
                                      ...this.state.submiting,
                                      [shipmentKey]: {
                                        refid: res.id,
                                        isSubmit: true
                                      }
                                    }
                                  });
                                }
                              });
                            } else if (
                              _.get(this.state.submiting, `${shipmentKey}.refid`, 0) !== 0
                            ) {
                              UpdateShipmentReference(
                                shipmentKey,
                                _.get(this.state.submiting, `${shipmentKey}.refid`, 0),
                                this.state.input.newRef
                              );
                            }
                          }
                        }
                      },
                      2000,
                      {
                        leading: true,
                        trailing: false
                      }
                    )}
                    maxLength={50}
                    bsSize="sm"
                  />
                </Col>
              </Row>
            ) : (
              ''
            )}
            {refs.map((refItem, refIndex) => (
              <Row
                key={refIndex}
                style={{
                  marginBottom: '5px'
                }}
              >
                <Col xs={1} />
                <Col xs={5} style={{ paddingTop: 5 }}>
                  <Label check>({refItem.ShipmentReferenceCompanyName})</Label>
                </Col>
                <Col xs={5}>
                  <Input
                    type="text"
                    name={`shipmentRefID${refIndex}`}
                    id={`shipmentRefID${refIndex}`}
                    onBlur={e => {
                      const update = UpdateShipmentReference(
                        shipmentKey,
                        refItem.ShipmentReferenceKey,
                        {
                          ...refItem,
                          ShipmentReferenceID: refItem.ShipmentReferenceIDInput
                        }
                      ).subscribe({
                        next: res => {
                          console.log('Update Ref', res);
                        },
                        complete: res => {
                          this.props.editShipmentRef(shipmentKey, refItem.ShipmentReferenceKey, {
                            ...refItem,
                            ShipmentReferenceID: refItem.ShipmentReferenceIDInput,
                            ShipmentReferenceCompanyKey: hasCompany.ShipmentMemberCompanyKey,
                            ShipmentReferenceCompanyName: hasCompany.ShipmentMemberCompanyName,
                            ShipmentKey: shipmentKey
                          });
                          update.unsubscribe();
                        }
                      });
                    }}
                    value={refItem.ShipmentReferenceIDInput}
                    onChange={e => {
                      const { value } = e.target;
                      // (ShipmentKey, refKey, Data)
                      this.props.editShipmentRef(shipmentKey, refItem.ShipmentReferenceKey, {
                        ...refItem,
                        ShipmentReferenceIDInput: value,
                        ShipmentReferenceCompanyKey: hasCompany.ShipmentMemberCompanyKey,
                        ShipmentReferenceCompanyName: hasCompany.ShipmentMemberCompanyName,
                        ShipmentKey: shipmentKey
                      });
                    }}
                    onKeyPress={async event => {
                      if (event.key === 'Enter') {

                        const confirmation = true;
                        if (confirmation) {
                          const update = UpdateShipmentReference(
                            shipmentKey,
                            refItem.ShipmentReferenceKey,
                            {
                              ...refItem,
                              ShipmentReferenceID: refItem.ShipmentReferenceIDInput
                            }
                          ).subscribe({
                            next: res => {
                              console.log('Update Ref', res);
                            },
                            complete: res => {
                              this.props.editShipmentRef(
                                shipmentKey,
                                refItem.ShipmentReferenceKey,
                                {
                                  ...refItem,
                                  ShipmentReferenceID: refItem.ShipmentReferenceIDInput,
                                  ShipmentReferenceCompanyKey: hasCompany.ShipmentMemberCompanyKey,
                                  ShipmentReferenceCompanyName:
                                    hasCompany.ShipmentMemberCompanyName,
                                  ShipmentKey: shipmentKey
                                }
                              );
                              update.unsubscribe();
                            }
                          });
                        }
                      }
                    }}
                    maxLength={50}
                    bsSize="sm"
                    disabled={
                      hasCompany.ShipmentMemberCompanyKey !== refItem.ShipmentReferenceCompanyKey
                    }
                  />
                </Col>
              </Row>
            ))}
          </PopoverBody>
        </UncontrolledPopover>
      </div>
    );
    return <span style={{ color: '#b5b2b2', fontStyle: 'italic' }}>Please Assign company</span>;
  }

  render() {
    const {
      user,
      network,
      msg: sending,
      chatMsg,
      text,
      typing,
      uploadModalRef,
      fileInputRef,
      toggleBlocking,
      sender,
      ShipmentKey,
      ChatRoomMember,
      members: member,
      ChatRoomKey,
      ChatRoomFileLink,
      // Action
      sendMessage,
      fetchMoreMessage,
      browseFile,
      //   Event
      onDropChatStyle,
      onDragOver,
      onDragLeave,
      onFileDrop,
      shipments
    } = this.props;
    const ship = _.find(shipments, item => item.ShipmentID === ShipmentKey);
    console.log('Shipment data', ship);
    const members = _.get(shipments, `${ShipmentKey}.ShipmentMember`, []);

    console.log('Shipments member', members);
    const isInvited = _.find(members, item => item.ShipmentMemberEmail === user.email);
    const ChatRoomMemberData = _.find(member, item => item.ChatRoomMemberEmail === user.email);
    console.log('isInvited', isInvited);
    let ref = '';
    console.log(this.props, 'props');

    if (!_.isEmpty(isInvited)) {
      if (_.size(_.get(ship, 'ShipmentReferenceList', [])) > 0) {
        ref =
          _.find(
            _.get(ship, 'ShipmentReferenceList', []),
            item => item.ShipmentReferenceCompanyKey === isInvited.ShipmentMemberCompanyKey
          ) || 'loading';
      }
    } else {
      ref = 'loading';
    }
    console.log('refs', ref);
    return (
      <div className="inbox_msg" style={{ backgroundColor: 'rgb(247, 247, 247)' }}>
        <Row
          style={{
            backgroundColor: 'white',
            borderBottom: '1px solid #707070'
          }}
        >
          <Breadcrumb className="chat-toolbar">
            <Row style={{ width: '100%', marginLeft: 20 }}>
              {this.state.toggleInvite ? (
                this.renderInviteComponent()
              ) : (
                <React.Fragment>
                  <Col>
                    {this.renderRefComponent(
                      1,
                      _.get(ship, 'ShipmentReferenceList', []),
                      ShipmentKey,
                      _.get(ship, 'ShipmentMember', [])
                    )}
                  </Col>
                  <Col>
                    <Row>
                      <MemberModal
                        {...this.props}
                        count={
                          _.filter(
                            member,
                            item => _.get(item, 'ChatRoomMemberIsLeave', false) === false
                          ).length
                        }
                        toggleBlocking={toggleBlocking}
                        list={member}
                        network={network}
                      />
                      <Button
                        onClick={() => {
                          this.toggleInviteComponent(this.state.toggleInvite);
                        }}
                      >
                        Invite
                      </Button>
                    </Row>
                  </Col>
                </React.Fragment>
              )}
            </Row>
          </Breadcrumb>
        </Row>
        <Row
          style={{
            height: 'auto'
          }}
        >
          <Col
            xs="8"
            style={{
              backgroundColor: 'white',
              marginTop: '16px',
              paddingRight: '5px'
            }}
          >
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
                  console.log(div);
                  if (div === 0) {
                    fetchMoreMessage(ChatRoomKey, ShipmentKey);
                  }
                }}
                ref={el => {
                  this.msgChatRef = el;
                }}
              >
                {_.get(this.props.ShipmentData, 'ShipmentCreatorUserKey', false) === user.uid
                  ? this.renderAssignCompany()
                  : isInvited
                  ? this.renderAssignCompany()
                  : ''}
                {chatMsg.map((msg, i) => {
                  const t = new Date(msg.ChatRoomMessageTimestamp.seconds * 1000);
                  let type = _.get(msg, 'ChatRoomMessageType', 'sender');
                  if (_.get(sender, 'id', '0') === msg.ChatRoomMessageSenderKey) {
                    type = 'reciever';
                  } else if (type !== 'System') {
                    type = 'sender';
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

                  return (
                    <div
                      style={{
                        padding: '20px',
                        marginBottom: '-70px'
                      }}
                    >
                      <ChatMessage message={message} i={i} />
                    </div>
                  );
                })}
                {_.isEmpty(sending) ? (
                  <div
                    style={{
                      padding: '20px',
                      marginBottom: '-70px'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      padding: '20px',
                      marginBottom: '-70px'
                    }}
                  >
                    <PreMessage message={sending} callback={sendMessage} />
                  </div>
                )}
                <div className="msg_history-cover-bar" />
              </div>
              <div className="inputBox">
                <div className="type_msg">
                  <UploadModal
                    chatFile={ChatRoomFileLink}
                    sendMessage={sendMessage}
                    ref={uploadModalRef}
                  />
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <Button
                        color="default"
                        onClick={() => {
                          if (_.get(ChatRoomMemberData, 'ChatRoomMemberIsLeave', false) === false) {
                            browseFile(ShipmentKey);
                          } else {
                            window.alert('You has been remove from the chat');
                          }
                        }}
                      >
                        {' '}
                        <i className="fa fa-plus" />
                      </Button>
                      <input
                        type="file"
                        id="file"
                        multiple
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

                    <textarea
                      className="chat-message-input"
                      placeholder={
                        _.get(ChatRoomMemberData, 'ChatRoomMemberIsLeave', false)
                          ? 'You has been remove from the chat'
                          : 'type...'
                      }
                      ref={ref => (this.multilineTextarea = ref)}
                      type="textarea"
                      value={text}
                      disabled={_.get(ChatRoomMemberData, 'ChatRoomMemberIsLeave', false)}
                      onMouseEnter={() => {
                        ClearUnReadChatMessage(sender.id, ShipmentKey, ChatRoomKey).subscribe({
                          next: res => {}
                        });
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
                        this.multilineTextarea.style.height = '50px';
                        if (this.multilineTextarea.scrollHeight > 280) {
                          this.multilineTextarea.style.height = '280px';
                        } else {
                          this.multilineTextarea.style.height = `${this.multilineTextarea.scrollHeight}px`;
                        }

                        ClearUnReadChatMessage(sender.id, ShipmentKey, ChatRoomKey).subscribe({
                          next: res => {}
                        });
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
                        typing(e.target.value);
                      }}
                      onKeyPress={event => {
                        if (event.which == 13 && event.shiftKey) {
                        } else if (event.which == 13) {
                          event.preventDefault(); // Stops enter from creating a new line
                          if (
                            !_.isEmpty(_.trim(text)) &&
                            _.get(ChatRoomMemberData, 'ChatRoomMemberIsLeave', false) === false
                          ) {
                            sendMessage(
                              ChatRoomKey,
                              ShipmentKey,
                              text,
                              undefined,
                              this.scrollChatToBottom
                            );
                            this.multilineTextarea.style.height = '50px';
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
                          console.log('Input text is size', _.size(text));

                          if (
                            !_.isEmpty(_.trim(text)) &&
                            _.get(ChatRoomMemberData, 'ChatRoomMemberIsLeave', false) === false
                          ) {
                            sendMessage(
                              ChatRoomKey,
                              ShipmentKey,
                              text,
                              undefined,
                              this.scrollChatToBottom
                            );
                            this.multilineTextarea.style.height = '50px';
                          }
                        }}
                      >
                        {' '}
                        <i className="fa fa-paper-plane-o fa-lg" />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              </div>
            </div>
          </Col>
          <Col xs="4" style={{ paddingLeft: '2px', paddingTop: '14.5px' }}>
            <FileSide
              chatFile={ChatRoomFileLink}
              shipmentKey={ShipmentKey}
              chatroomKey={ChatRoomKey}
              sendMessage={sendMessage}
              collapse={this.state.sideCollpase}
              collapseTrigger={this.triggerSideCollapse}
            />
            <ShipmentSide
              mainData={this.props.ShipmentData}
              shipmentKey={ShipmentKey}
              chatroomKey={ChatRoomKey}
              collapse={this.state.sideCollpase}
              collapseTrigger={this.triggerSideCollapse}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default ChatWithHeader;
