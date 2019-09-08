/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  InputGroup,
  InputGroupAddon,
  Input,
  Row,
  Col
} from 'reactstrap';
import Autocomplete from 'react-autocomplete';
import './MemberModal.css';
import * as _ from 'lodash';
import TextLoading from './svg/TextLoading';
import MemberInChat from './MemberInChat';
import { CreateChatMultipleInvitation } from '../service/join/invite';
import XSuggest from '../component/XSuggestV2';

class MemberModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      isEdit: false,
      state: 1,
      inviteEmailList: []
    };
  }

  xsuggest = null;

  toggle = () => {
    console.log('toggle');
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  renderCloseButton = () => (
    <button className="close" onClick={this.toggle}>
      &times;
    </button>
  );

  toggleEdit = () => {
    this.setState(state => ({ isEdit: !state.isEdit }));
  };

  render() {
    let {
      count,
      list: member,
      toggleBlocking,
      network,
      ShipmentKey,
      ChatRoomKey,
      user
    } = this.props;
    const shipmentMember = [];
    console.log('Member Modal props', this.props);

    let suggestion = _.map(network, item => {
      return {
        id: item.UserMemberEmail,
        label: item.UserMemberEmail
      };
    });
    const memberData = _.find(member, (item, index) => item.ChatRoomMemberUserKey === user.uid);
    member = _.filter(member, item => _.get(item, 'ChatRoomMemberIsLeave', false) === false);

    _.forEach(member, item => {
      if (!_.isEmpty(item.ChatRoomMemberCompanyName)) {
        if (_.isEmpty(shipmentMember[item.ChatRoomMemberCompanyName])) {
          shipmentMember[item.ChatRoomMemberCompanyName] = [];
          shipmentMember[item.ChatRoomMemberCompanyName].push(item);
        } else {
          shipmentMember[item.ChatRoomMemberCompanyName].push(item);
        }
      }
    });

    _.forEach(member, item => {
      if (_.isEmpty(item.ChatRoomMemberCompanyName)) {
        if (_.isEmpty(shipmentMember.Individual)) {
          shipmentMember.Individual = [];
          shipmentMember.Individual.push(item);
        } else {
          shipmentMember.Individual.push(item);
        }
      }
    });

    const props = this.props;
    return (
      <div>
        <Button className="btn-see-chatmember" onClick={this.toggle}>
          {/* <i style={{ marginRight: '0.5rem' }} className="fa  fa-users fa-lg" /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14.4"
            height="12"
            viewBox="0 0 14.4 12"
            style={{ marginRight: '0.5rem', paddingBottom: '0.75px' }}
          >
            <path
              id="Combined-Shape"
              d="M10.8,13.4a.6.6,0,0,1-1.2,0V12.2a1.8,1.8,0,0,0-1.8-1.8H3a1.8,1.8,0,0,0-1.8,1.8v1.2a.6.6,0,0,1-1.2,0V12.2a3,3,0,0,1,3-3H7.8a3,3,0,0,1,3,3ZM5.4,8a3,3,0,1,1,3-3A3,3,0,0,1,5.4,8Zm9,5.4a.6.6,0,0,1-1.2,0V12.2a1.8,1.8,0,0,0-1.35-1.741.6.6,0,1,1,.3-1.162,3,3,0,0,1,2.25,2.9ZM9.451,3.259a.6.6,0,1,1,.3-1.163,3,3,0,0,1,0,5.813.6.6,0,1,1-.3-1.163,1.8,1.8,0,0,0,0-3.487ZM5.4,6.8A1.8,1.8,0,1,0,3.6,5,1.8,1.8,0,0,0,5.4,6.8Z"
              transform="translate(0 -2)"
              fill="#6a6a6a"
            />
          </svg>

          {count === 0 ? <TextLoading /> : count}
        </Button>
        <Modal
          size="lg"
          style={{ height: '80%'}}
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle} close={this.renderCloseButton()} className="border-0">
            <div className="ml-3">Members in this chat room</div>
          </ModalHeader>

          <div className="ml-3 px-3">
            <hr style={{margin: '0', borderTop: 'solid 2px #9b9b9b'}}/>
          </div>

          <ModalBody
            style={{
              height: '500px',
              overflowY: 'auto',
              marginLeft: '16px',
              marginRight: '16px'
            }}
          >
            <div
              style={{
                backgroundColor: '#f4f4f4',
                borderRadius: '3px',
                paddingTop: '16px',
                paddingLeft: '8px',
                paddingRight: '8px',
                paddingBottom: '16px'
              }}
            >
              <div style={{ marginLeft: '16px', textDecorationLine: 'underline' }}>
                Invite by E-mail
              </div>
              <InputGroup style={{ marginTop: '4px' }}>
                <Col sm={10}>
                  {/* <Autocomplete
                  className="member-search-container"
                  items={suggestion}
                  shouldItemRender={(item, value) =>
                    item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                  }
                  getItemValue={item => item.label}
                  renderItem={(item, highlighted) => (
                    <div
                      key={item.id}
                      style={{ backgroundColor: highlighted ? '#eee' : 'transparent' }} >
                      {item.label}
                    </div>
                  )}
                  value={this.state.value}
                  placeholder="...input email address"
                  onChange={e => this.setState({ value: e.target.value })}
                  onSelect={value => this.setState({ value })}
                /> */}

                <XSuggest
                    ref={$el => (this.xsuggest = $el)}
                    style={{}}
                    placeholder="Invite via e-mail to join this chat of this shipment only"
                    datasets={suggestion}
                    multiple={true}
                    idName={'id'}
                    labelName={'label'}
                    avatarName={'avatar'}
                    onAdd={item => this.state.inviteEmailList.push(item)}
                    onRemove={item => this.state.inviteEmailList.pop(item)}
                    onChange={(selects, adds, removes) => console.log(selects, adds, removes)}
                  />
                </Col>

                <Button
                  className="invite-btn"
                  style={{
                    color: 'white',
                    borderRadius: '3px',
                    backgroundColor: '#16A085',
                    height: 'max-content'
                  }}
                  onClick={() => {
                    const inviteMember = [];
                    const role = [];
                    role.push(this.props.ChatRoomData.ChatRoomType);
                    _.forEach(this.state.inviteEmailList, invite => {
                      console.log('email' + JSON.stringify(invite));

                      const hasMember = _.find(
                        member,
                        (item, index) => item.ChatRoomMemberEmail === invite.label
                      );

                      if (_.isEmpty(hasMember)) {
                        inviteMember.push({
                          Email: invite.label,
                          Image: '',
                          Role: role,
                          ChatRoomMemberCompanyName: '',
                          ChatRoomMemberCompanyKey: ''
                        });
                      }
                    });

                    if (inviteMember.length > 0) {
                      if (_.get(memberData, 'ChatRoomMemberIsLeave', false) === false) {
                        const invite = CreateChatMultipleInvitation(
                          inviteMember,
                          ShipmentKey,
                          ChatRoomKey,
                          this.props.sender
                        ).subscribe({
                          next: res => {
                            this.setState({
                              inviteEmailList: []
                            });
                            // Clear sugguest input
                            this.xsuggest && this.xsuggest.clearSelects();
                          }
                        });
                      } else {
                        window.alert('You has been remove from the chat');
                      }
                    } else {
                      window.alert('already in chatroom');
                    }
                  }}
                >
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>Send Invite</span>
                </Button>
              </InputGroup>
            </div>
            <div style={{ textAlign: 'end', marginRight: '60px' }}>
              <Button
                style={{
                  backgroundColor: '#FFFFFFFF',
                  border: '0px',
                  marginTop: '8px',
                  textDecoration: 'underline',
                  fontWeight: 'bold'
                }}
                onClick={() => {
                  this.toggleEdit();
                }}
              >
                Edit
              </Button>
            </div>

            {Object.keys(shipmentMember).map((key, index) => (
              <MemberInChat
                toggleBlocking={toggleBlocking}
                title={key}
                member={shipmentMember[key]}
                isEdit={this.state.isEdit}
                {...props}
              />
            ))}
            <br/>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default MemberModal;
