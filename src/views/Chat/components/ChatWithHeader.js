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
  FormGroup,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
} from 'reactstrap';
import Select from 'react-select';
import MemberModal from '../../../component/MemberModal';
import UploadModal from '../../../component/UploadModal';
import FileSide from '../FileSide';
import ShipmentSide from '../ShipmentSide';
import ChatMessage from './ChatMessage';
import PreMessage from './PreMessage';
import ChatInviteBar from './ChatInviteBar';
import {
  AddChatRoomMember,
  CreateChatRoom,
  UpdateChatRoomMember,
  UpdateChatRoomMessageReader,
} from '../../../service/chat/chat';
import {
  CombineCreateCompanyWithCreateCompanyMember,
  GetCompanyMember,
} from '../../../service/company/company';
import { CreateChatMultipleInvitation } from '../../../service/join/invite';
import { ClearUnReadChatMessage } from '../../../service/personalize/personalize';
import {
  AddShipmentRole,
  CreateShipmentReference,
  GetAvailableRole,
  GetShipmentDetail,
  GetShipmentReferenceList,
  UpdateShipmentReference,
} from '../../../service/shipment/shipment';
import Send from '../../../component/svg/icon-send';
import Paperclip from '../../../component/svg/paperclip';
import BlockUi from 'react-block-ui';

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
      isLoadingShipment: true,
      input: {
        refs: [],
        newRef: {
          ShipmentReferenceID: '',
          ShipmentReferenceCompanyName: '',
          ShipmentReferenceCompanyKey: '',
        },
      },
      companyinput: {
        role: 1,
        from: '',
        to: [],
        product: '',
        ref: '',
        bound: '',
        method: 1,
        type: 1,
        details: '',
        etd: '',
        eta: '',
        newCompanyName: '',
        importer: '',
        exporter: '',
      },
      inputComapany: false,

      submiting: {},
      sideCollpase: 'SHIPMENT',
    };

    this.msgChatRef = React.createRef();
    this.writeText = this.writeText.bind(this);
  }

  toggleCompanyState = () => {
    this.setState({
      inputComapany: !this.state.inputComapany,
    });
  };

  createCompany = () => {
    const userData = {
      UserMemberEmail: this.props.user.email,
      UserMemberPosition: '-',
      UserMemberRoleName: 'Owner',
      CompanyUserAccessibilityRolePermissionCode: '11111111111111',
      UserMemberCompanyStandingStatus: 'Active',
      UserMemberJoinedTimestamp: new Date(),
    };

    const companyData = {
      CompanyName: this.state.companyinput.newCompanyName,
      CompanyID: this.state.companyinput.newCompanyName,
    };

    CombineCreateCompanyWithCreateCompanyMember(
      companyData,
      this.props.user.uid,
      userData,
    ).subscribe(res => {
      console.log('Add company res', _.compact(res));
      this.props.companies.push({
        ...companyData,
        CompanyKey: _.compact(res)[1],
      });
      this.setState({
        inputComapany: false,
        companyinput: {
          ...this.state.companyinput,
          newCompanyName: '',
        },
      });
    });
  };

  componentWillMount() {
    const { ShipmentKey } = this.props;
    GetShipmentDetail(ShipmentKey).subscribe({
      next: res => {
        const result = [];
        const shipments = res.data();

        GetShipmentReferenceList(ShipmentKey).subscribe({
          next: refres => {
            this.setState({ refs: refres });
            result[0] = {
              ...shipments,
              ShipmentID: ShipmentKey,
              ShipmentReferenceList: refres,
            };
            this.props.fetchShipments(result, {});
          },
        });
        this.setState({
          shipment: res.data(),
        });
      },
    });
  }

  componentDidMount() {
    const { ShipmentKey, ChatRoomKey, sender } = this.props;
    if (this.multilineTextarea) {
      this.multilineTextarea.style.height = '50px ';
    }
    ClearUnReadChatMessage(sender.id, ShipmentKey, ChatRoomKey).subscribe({
      next: () => {},
    });

    GetAvailableRole(ShipmentKey, ChatRoomKey).subscribe({
      next: res => {
        this.setState({
          availableRole: res,
        });
      },
    });
    setTimeout(() => {
      console.log('Toggle Loading');
      this.setState({
        isLoadingShipment: false,
      });
    }, 3000);
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
          ChatRoomMessageReaderProfileImageUrl: _.get(
            sender,
            'UserInfoProfileImageLink',
            '',
          ),
          ChatRoomMessageReaderLastestMessageKey:
            chatMsg[chatMsg.length - 1].id,
        });
        ClearUnReadChatMessage(sender.id, ShipmentKey, ChatRoomKey).subscribe({
          next: () => {},
        });
      }
      lastkey = chatMsg[chatMsg.length - 1].id;
    }
  }

  triggerSideCollapse = side => {
    this.setState({
      sideCollpase: side,
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
      toggleInvite: !toggle,
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

    const { ShipmentData } = this.props;
    const ShipmentMember = ShipmentData.ShipmentMember;

    let companyItem = _.find(
      ShipmentMember,
      item => item.ShipmentMemberCompanyKey === e.value,
    );

    const chatMember = _.find(
      members,
      item => item.ChatRoomMemberEmail === user.email,
    );
    if (companyItem) {
      UpdateChatRoomMember(
        ShipmentKey,
        ChatRoomKey,
        chatMember.ChatRoomMemberKey,
        {
          ...chatMember,
          ChatRoomMemberCompanyName: companyItem.ShipmentMemberCompanyName,
          ChatRoomMemberCompanyKey: companyItem.ShipmentMemberCompanyKey,
        },
      );
    } else {
      const pickedCompany = _.find(
        companies,
        item => item.CompanyKey === e.value,
      );

      AddShipmentRole(ShipmentKey, role.value, {
        ShipmentRoleCompanyName: pickedCompany.CompanyName,
        ShipmentRoleCompanyKey: pickedCompany.CompanyKey,
      }).subscribe({
        next: res => {},
      });

      let userRole;
      if (pickedCompany) {
        const getCompany = GetCompanyMember(e.value).subscribe({
          next: res => {
            const CompanyMember = _.map(res, item => ({
              ...item.data(),
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
                  ChatRoomMemberCompanyKey: pickedCompany.CompanyKey,
                },
              );
            }
            _.forEach(CompanyMember, memberItem => {
              const chatMember = _.find(
                members,
                item => item.ChatRoomMemberEmail === memberItem.UserMemberEmail,
              );

              if (chatMember) {
                const result = UpdateChatRoomMember(
                  ShipmentKey,
                  ChatRoomKey,
                  chatMember.ChatRoomMemberKey,
                  {
                    ...chatMember,
                    ChatRoomMemberCompanyName: pickedCompany.CompanyName,
                    ChatRoomMemberCompanyKey: pickedCompany.CompanyKey,
                  },
                );
              }
              inviteMember.push({
                Email: memberItem.UserMemberEmail,
                Image: '',
                Role: inviteRole,
                ChatRoomMemberCompanyName: pickedCompany.CompanyName,
                ChatRoomMemberCompanyKey: pickedCompany.CompanyKey,
              });
            });
            if (_.get(memberData, 'ChatRoomMemberIsLeave', false) === false) {
              this.props.toggleCreateChat(true);
              CreateChatRoom(ShipmentKey, {
                ChatRoomType: 'Internal',
                ChatRoomName: 'Internal',
              }).subscribe({
                next: result => {
                  const data = result.path.split('/');
                  const chatkey = result.id;
                  const invite = CreateChatMultipleInvitation(
                    _.filter(inviteMember, item => item.Email !== user.email),
                    ShipmentKey,
                    chatkey,
                    this.props.sender,
                  ).subscribe({
                    next: res => {
                      this.props.fetchMoreMessage(chatkey, ShipmentKey);
                    },
                  });
                  const ChatRoomMember = AddChatRoomMember(
                    ShipmentKey,
                    chatkey,
                    {
                      ChatRoomMemberUserKey: this.props.user.uid,
                      ChatRoomMemberEmail: this.props.user.email,
                      ChatRoomMemberImageUrl: '',
                      ChatRoomMemberRole: inviteRole,
                      ChatRoomMemberCompanyName: pickedCompany.CompanyName,
                      ChatRoomMemberCompanyKey: pickedCompany.CompanyKey,
                    },
                  ).subscribe({
                    next: result => {},
                    complete: () => {
                      if (!_.isEmpty(this.state.refID)) {
                        CreateShipmentReference(ShipmentKey, {
                          ShipmentReferenceID: ref,
                          ShipmentReferenceCompanyKey: pickedCompany.CompanyKey,
                          ShipmentReferenceCompanyName:
                            pickedCompany.CompanyName,
                          ShipmentKey,
                        }).subscribe({});
                      }

                      ChatRoomMember.unsubscribe();
                    },
                  });
                },
                complete: result => {
                  this.props.toggleCreateChat(false);
                },
              });
              getCompany.unsubscribe();
            } else {
              window.alert('You has been remove from the chat');
            }
          },
        });
      }
    }
  }
  writeText(e) {
    const { name, value } = e.target;

    this.setState({
      companyinput: {
        ...this.state.companyinput,
        [name]: value,
      },
    });
  }
  renderAssignCompany() {
    const {
      user,
      ShipmentData,
      ShipmentKey,
      ChatRoomKey,
      members: member,
      shipments,
    } = this.props;
    const isLoadingShipment = this.state.isLoadingShipment;
    if (isLoadingShipment) {
      return <BlockUi blocking />;
    }

    const members = _.get(shipments, `${ShipmentKey}.ShipmentMember`, []);
    const memberData = _.find(
      members,
      (item, index) => item.ShipmentMemberEmail === user.email,
    );
    // const isHaveRole = _.get(ShipmentData, `ShipmentMember.${user.uid}`, {});
    const { companies } = this.props;

    let options = [];
    options = _.map(companies, item => ({
      value: item.CompanyKey,
      label: item.CompanyName,
    }));
    const roleOption = [];
    _.forEach(this.state.availableRole, (role, index) => {
      if (!role) {
        roleOption.push({
          value: index,
          label: index,
        });
      }
    });
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
            zIndex: '100',
          }}
        >
          <p
            style={{
              fontWeight: 700,
              color: '#000000',
            }}
          >
            You have been invite to this shipment
          </p>
          <p>
            Select a Company and Role, to inform your team about this shipment
          </p>

          <Row>
            <Col xs={4}>
              <UncontrolledDropdown style={{ marginLeft: '16px' }}>
                <DropdownToggle tag={'p'}>
                  <Select
                    className={'companySelect'}
                    onChange={e => {
                      this.setState({ company: e });
                    }}
                    name="company"
                    placeholder="Select Company"
                    options={options}
                    value={this.state.company}
                    isDisabled={true}
                  />
                </DropdownToggle>

                <DropdownMenu
                  modifiers={{
                    setMaxHeight: {
                      enabled: true,
                      order: 890,
                      fn: data => {
                        return {
                          ...data,
                          styles: {
                            ...data.styles,
                            overflow: 'auto',
                            maxHeight: 500,
                          },
                        };
                      },
                    },
                  }}
                >
                  <DropdownItem disabled className="shipment-header">
                    Share with shipping with people in
                  </DropdownItem>

                  {_.map(options, item => (
                    <DropdownItem
                      onClick={() => {
                        this.setState({ company: item });
                      }}
                      className="shipment-item-box"
                    >
                      {item.label}
                    </DropdownItem>
                  ))}
                  {this.state.inputComapany ? (
                    <div>
                      <Input
                        style={{
                          marginLeft: '8px',
                          marginRight: '8px',
                          width: '90%',
                        }}
                        type="text"
                        name="newCompanyName"
                        id="newCompanyName"
                        placeholder="Input New Company Name"
                        onChange={this.writeText}
                        value={this.state.companyinput.newCompanyName}
                      />

                      <Row>
                        <Col xs="4" />
                        <Col xs="3">
                          <Button
                            className="company-shipment-button"
                            color="white"
                            onClick={this.toggleCompanyState}
                          >
                            Cancel
                          </Button>
                        </Col>
                        <Col xs="3">
                          <Button
                            className="company-shipment-button"
                            color="danger"
                            onClick={this.createCompany}
                          >
                            Save
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ) : (
                    <Button
                      className="company-shipment"
                      onClick={this.toggleCompanyState}
                    >
                      + Create New Company
                    </Button>
                  )}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
            <Col xs={3} className={'roleForm'}>
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
                  backgroundColor: '#16A085',
                }}
                disabled={
                  _.isEmpty(this.state.company) ||
                  _.isEmpty(this.state.role) ||
                  this.state.isAssign
                }
                onClick={() => {
                  this.setState({ isAssign: true });
                  this.handleAssignCompany(
                    this.state.company,
                    this.state.role,
                    this.state.refID,
                  );
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
      _.some(companies, item =>
        _.includes(refItem.ShipmentReferenceCompanyKey, item.CompanyKey),
      ),
    );
    const hasCompany = _.get(ShipmentMember, `${user.uid}`, {});

    const alreadyHave = !_.isEmpty(userrefs);
    return (
      <div>
        <Button
          id={`popover${index}`}
          className="text-yterminall"
          color={'secondary'}
        >
          {userrefs.length > 0 ? (
            <b style={{ color: 'black' }}>{userrefs[0].ShipmentReferenceID}</b>
          ) : _.isEmpty(companies) ? (
            <b style={{ color: 'red' }}>New Shipment!</b>
          ) : !_.isEmpty(hasCompany.ShipmentMemberCompanyName) ? (
            <b style={{ color: 'red' }}>Input Ref!</b>
          ) : (
            <b style={{ color: 'red' }}>New Shipment!</b>
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
                  marginBottom: '5px',
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
                            ShipmentReferenceCompanyKey:
                              hasCompany.ShipmentMemberCompanyKey,
                            ShipmentReferenceCompanyName:
                              hasCompany.ShipmentMemberCompanyName,
                            ShipmentKey: shipmentKey,
                          },
                        },
                      });
                    }}
                    onBlur={e => {
                      const { value } = e.target;
                      const input = {
                        ...this.state.input.newRef,
                        ShipmentReferenceID: value,
                        ShipmentReferenceCompanyKey:
                          hasCompany.ShipmentMemberCompanyKey,
                        ShipmentReferenceCompanyName:
                          hasCompany.ShipmentMemberCompanyName,
                        ShipmentKey: shipmentKey,
                      };
                      if (
                        _.get(
                          this.state.submiting,
                          `${shipmentKey}.isSubmit`,
                          false,
                        ) === false
                      ) {
                        this.setState({
                          submiting: {
                            ...this.state.submiting,
                            [shipmentKey]: {
                              isSubmit: true,
                            },
                          },
                        });
                        CreateShipmentReference(shipmentKey, input).subscribe({
                          next: res => {
                            this.setState({
                              submiting: {
                                ...this.state.submiting,
                                [shipmentKey]: {
                                  refid: res.id,
                                  isSubmit: true,
                                },
                              },
                            });
                          },
                        });
                      } else if (
                        _.get(
                          this.state.submiting,
                          `${shipmentKey}.refid`,
                          0,
                        ) !== 0
                      ) {
                        UpdateShipmentReference(
                          shipmentKey,
                          _.get(
                            this.state.submiting,
                            `${shipmentKey}.refid`,
                            0,
                          ),
                          this.state.input.newRef,
                        );
                      }
                    }}
                    onKeyPress={_.debounce(
                      async event => {
                        if (event.key === 'Enter') {
                          const confirmation = true;
                          if (confirmation === true) {
                            if (
                              _.get(
                                this.state.submiting,
                                `${shipmentKey}.isSubmit`,
                                false,
                              ) === false
                            ) {
                              this.setState({
                                submiting: {
                                  ...this.state.submiting,
                                  [shipmentKey]: {
                                    isSubmit: true,
                                  },
                                },
                              });
                              CreateShipmentReference(
                                shipmentKey,
                                this.state.input.newRef,
                              ).subscribe({
                                next: res => {
                                  this.setState({
                                    submiting: {
                                      ...this.state.submiting,
                                      [shipmentKey]: {
                                        refid: res.id,
                                        isSubmit: true,
                                      },
                                    },
                                  });
                                },
                              });
                            } else if (
                              _.get(
                                this.state.submiting,
                                `${shipmentKey}.refid`,
                                0,
                              ) !== 0
                            ) {
                              UpdateShipmentReference(
                                shipmentKey,
                                _.get(
                                  this.state.submiting,
                                  `${shipmentKey}.refid`,
                                  0,
                                ),
                                this.state.input.newRef,
                              );
                            }
                          }
                        }
                      },
                      2000,
                      {
                        leading: true,
                        trailing: false,
                      },
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
                  marginBottom: '5px',
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
                          ShipmentReferenceID: refItem.ShipmentReferenceIDInput,
                        },
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
                              ShipmentReferenceID:
                                refItem.ShipmentReferenceIDInput,
                              ShipmentReferenceCompanyKey:
                                hasCompany.ShipmentMemberCompanyKey,
                              ShipmentReferenceCompanyName:
                                hasCompany.ShipmentMemberCompanyName,
                              ShipmentKey: shipmentKey,
                            },
                          );
                          update.unsubscribe();
                        },
                      });
                    }}
                    value={refItem.ShipmentReferenceIDInput}
                    onChange={e => {
                      const { value } = e.target;
                      // (ShipmentKey, refKey, Data)
                      this.props.editShipmentRef(
                        shipmentKey,
                        refItem.ShipmentReferenceKey,
                        {
                          ...refItem,
                          ShipmentReferenceIDInput: value,
                          ShipmentReferenceCompanyKey:
                            hasCompany.ShipmentMemberCompanyKey,
                          ShipmentReferenceCompanyName:
                            hasCompany.ShipmentMemberCompanyName,
                          ShipmentKey: shipmentKey,
                        },
                      );
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
                              ShipmentReferenceID:
                                refItem.ShipmentReferenceIDInput,
                            },
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
                                  ShipmentReferenceID:
                                    refItem.ShipmentReferenceIDInput,
                                  ShipmentReferenceCompanyKey:
                                    hasCompany.ShipmentMemberCompanyKey,
                                  ShipmentReferenceCompanyName:
                                    hasCompany.ShipmentMemberCompanyName,
                                  ShipmentKey: shipmentKey,
                                },
                              );
                              update.unsubscribe();
                            },
                          });
                        }
                      }
                    }}
                    maxLength={50}
                    bsSize="sm"
                    disabled={
                      hasCompany.ShipmentMemberCompanyKey !==
                      refItem.ShipmentReferenceCompanyKey
                    }
                  />
                </Col>
              </Row>
            ))}
          </PopoverBody>
        </UncontrolledPopover>
      </div>
    );
    return (
      <span style={{ color: '#b5b2b2', fontStyle: 'italic' }}>
        Please Assign company
      </span>
    );
  }

  render() {
    const {
      user,
      network,
      msg: sending,

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
      shipments,
    } = this.props;
    let { chatMsg } = this.props;
    chatMsg = _.orderBy(chatMsg, ['ChatRoomMessageTimestamp'], ['asc']);
    const ship = _.find(shipments, item => item.ShipmentID === ShipmentKey);
    const members = _.get(shipments, `${ShipmentKey}.ShipmentMember`, []);

    const isInvited = _.find(
      members,
      item => item.ShipmentMemberEmail === user.email,
    );
    const ChatRoomMemberData = _.find(
      member,
      item => item.ChatRoomMemberEmail === user.email,
    );
    let ref = '';
    if (!_.isEmpty(isInvited)) {
      if (_.size(_.get(ship, 'ShipmentReferenceList', [])) > 0) {
        ref =
          _.find(
            _.get(ship, 'ShipmentReferenceList', []),
            item =>
              item.ShipmentReferenceCompanyKey ===
              isInvited.ShipmentMemberCompanyKey,
          ) || 'loading';
      }
    } else {
      ref = 'loading';
    }
    const isLoadingShipment = this.state.isLoadingShipment;
    return (
      <div
        className="inbox_msg"
        style={{ backgroundColor: 'rgb(247, 247, 247)' }}
      >
        <Row
          style={{
            backgroundColor: 'white',
            borderBottom: '1px solid #707070',
          }}
        >
          <Col
            xs="8"
            style={{
              backgroundColor: 'white',
              marginTop: '16px',
              paddingRight: '5px',
            }}
          >
            <Breadcrumb className="chat-toolbar">
              <Row style={{ width: '100%', marginLeft: 20 }}>
                {this.state.toggleInvite ? (
                  this.renderInviteComponent()
                ) : (
                  <React.Fragment>
                    <Col xs={6}>
                      {isLoadingShipment ? (
                        <BlockUi tag="div" blocking />
                      ) : (
                        this.renderRefComponent(
                          1,
                          _.get(ship, 'ShipmentReferenceList', []),
                          ShipmentKey,
                          _.get(ship, 'ShipmentMember', []),
                        )
                      )}
                    </Col>
                    <Col>
                      <Row style={{ paddingLeft: 77 }}>
                        <MemberModal
                          {...this.props}
                          count={
                            _.filter(
                              member,
                              item =>
                                _.get(item, 'ChatRoomMemberIsLeave', false) ===
                                false,
                            ).length
                          }
                          toggleBlocking={toggleBlocking}
                          list={member}
                          network={network}
                        />
                        <Button
                          className="invite-btn-trigger"
                          onClick={() => {
                            this.toggleInviteComponent(this.state.toggleInvite);
                          }}
                        >
                          <b>Invite</b>
                        </Button>
                      </Row>
                    </Col>
                  </React.Fragment>
                )}
              </Row>
            </Breadcrumb>

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
                        '',
                      ),
                      ChatRoomMessageReaderLastestMessageKey:
                        chatMsg[chatMsg.length - 1].id,
                    });
                  }
                  lastkey = chatMsg[chatMsg.length - 1].id;
                }
              }}
            >
              <div>{this.renderAssignCompany()}</div>
              <div
                id="chathistory"
                className={
                  _.get(isInvited, 'ShipmentMemberCompanyKey', '') === ''
                    ? 'msg_history'
                    : 'msg_history_full'
                }
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
                  const t = new Date(
                    msg.ChatRoomMessageTimestamp.seconds * 1000,
                  );
                  let type = _.get(msg, 'ChatRoomMessageType', 'sender');
                  if (
                    _.get(sender, 'id', '0') === msg.ChatRoomMessageSenderKey
                  ) {
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
                      files: msgJson.files,
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
                      hasFile: false,
                    };
                  }

                  return (
                    <div
                      style={{
                        padding: '20px',
                        marginBottom: '-70px',
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
                      marginBottom: '-70px',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      padding: '20px',
                      marginBottom: '-70px',
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
                        className="paperclip"
                        onClick={() => {
                          if (
                            _.get(
                              ChatRoomMemberData,
                              'ChatRoomMemberIsLeave',
                              false,
                            ) === false
                          ) {
                            browseFile(ShipmentKey);
                          } else {
                            window.alert('You has been remove from the chat');
                          }
                        }}
                      >
                        <Paperclip />
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
                            ChatRoomKey,
                          )
                        }
                      />
                    </InputGroupAddon>

                    <textarea
                      className="chat-message-input"
                      placeholder={
                        _.get(
                          ChatRoomMemberData,
                          'ChatRoomMemberIsLeave',
                          false,
                        )
                          ? 'You has been remove from the chat'
                          : 'type...'
                      }
                      ref={ref => (this.multilineTextarea = ref)}
                      type="textarea"
                      value={text}
                      disabled={_.get(
                        ChatRoomMemberData,
                        'ChatRoomMemberIsLeave',
                        false,
                      )}
                      onMouseEnter={() => {
                        ClearUnReadChatMessage(
                          sender.id,
                          ShipmentKey,
                          ChatRoomKey,
                        ).subscribe({
                          next: res => {},
                        });
                        if (chatMsg.length > 0) {
                          if (chatMsg[chatMsg.length - 1].id !== lastkey) {
                            this.UpdateReader(
                              ShipmentKey,
                              ChatRoomKey,
                              sender.id,
                              {
                                ChatRoomMessageReaderFirstName:
                                  sender.ProfileFirstname,
                                ChatRoomMessageReaderSurName:
                                  sender.ProfileSurname,
                                ChatRoomMessageReaderProfileImageUrl: _.get(
                                  sender,
                                  'UserInfoProfileImageLink',
                                  '',
                                ),
                                ChatRoomMessageReaderLastestMessageKey:
                                  chatMsg[chatMsg.length - 1].id,
                              },
                            );
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

                        ClearUnReadChatMessage(
                          sender.id,
                          ShipmentKey,
                          ChatRoomKey,
                        ).subscribe({
                          next: res => {},
                        });
                        if (chatMsg.length > 0) {
                          if (chatMsg[chatMsg.length - 1].id !== lastkey) {
                            this.UpdateReader(
                              ShipmentKey,
                              ChatRoomKey,
                              sender.id,
                              {
                                ChatRoomMessageReaderFirstName:
                                  sender.ProfileFirstname,
                                ChatRoomMessageReaderSurName:
                                  sender.ProfileSurname,
                                ChatRoomMessageReaderProfileImageUrl: _.get(
                                  sender,
                                  'UserInfoProfileImageLink',
                                  '',
                                ),
                                ChatRoomMessageReaderLastestMessageKey:
                                  chatMsg[chatMsg.length - 1].id,
                              },
                            );
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
                            _.get(
                              ChatRoomMemberData,
                              'ChatRoomMemberIsLeave',
                              false,
                            ) === false
                          ) {
                            sendMessage(
                              ChatRoomKey,
                              ShipmentKey,
                              text,
                              undefined,
                              this.scrollChatToBottom,
                            );
                            this.multilineTextarea.style.height = '50px';
                          }
                        }
                      }}
                    />
                    <InputGroupAddon addonType="append" className="sent">
                      <Button
                        color="default1"
                        onClick={() => {
                          if (
                            !_.isEmpty(_.trim(text)) &&
                            _.get(
                              ChatRoomMemberData,
                              'ChatRoomMemberIsLeave',
                              false,
                            ) === false
                          ) {
                            sendMessage(
                              ChatRoomKey,
                              ShipmentKey,
                              text,
                              undefined,
                              this.scrollChatToBottom,
                            );
                            this.multilineTextarea.style.height = '50px';
                          }
                        }}
                      >
                        <Send />
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
