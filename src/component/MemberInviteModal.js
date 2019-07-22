/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable filenames/match-regex */
import _ from 'lodash';
import React from 'react';
import {
  Button, Modal, ModalHeader, ModalBody,
} from 'reactstrap';
import './MemberModal.css';

import MemberSearchField from './memberInviteModal/MemberSearchField';
import MemberInviteList from './memberInviteModal/MemberInviteList';
import { CreateChatMultipleInvitation } from '../service/join/invite';
import { UpdateChatRoomMember } from '../service/chat/chat';

class MemberInviteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      collection: [],
      invitationCollection: [],
    };
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  isInvited = (email) => {
    const { invitationCollection } = this.state;
    return invitationCollection.find(profile => profile.Email === email);
  };

  shouldInvite = (invite) => {
    const { invitationCollection } = this.state;
    const exist = this.isInvited(invite.Email);
    console.log(invitationCollection);
    if (exist) {
      if (invite.Role.length <= 0) {
        const updated = _.filter(invitationCollection, profile => profile.email !== invite.email);
        this.setState({ invitationCollection: updated });
      } else {
        const updated = [];
        _.forEach(invitationCollection, (item) => {
          console.log(item);
          if (item.Email === invite.Email) {
            updated.push({
              ...item,
              ...invite,
            });
          } else {
            updated.push({
              ...item,
            });
          }
        });
        console.log(updated);
        this.setState({ invitationCollection: updated });
      }
    } else {
      this.setState({ invitationCollection: [...invitationCollection, invite] });
    }
  };

  onResultList = (collection) => {
    const oldlist = this.state.collection;

    _.forEach(collection, (member) => {
      const data = member.data();
      console.log(data);
      const { UserInfoProfileImageLink, UserInfoEmail } = data;
      if (!_.find(oldlist, item => item.Email === UserInfoEmail)) {
        oldlist.push({
          Image: UserInfoProfileImageLink,
          Email: UserInfoEmail,
        });
      }
    });
    this.setState({ collection: oldlist });
  };

  onSubmit = () => {
    const {
      ChatRoomKey, ShipmentKey, member, user,
    } = this.props;
    const memberData = _.find(member, (item, index) => item.ChatRoomMemberUserKey === user.uid);
    const { invitationCollection } = this.state;
    console.log('invitationCollection', this.state);
    console.log('member', this.props);

    let input = invitationCollection;

    _.forEach(invitationCollection, (item) => {
      _.forEach(member, (memberItem) => {
        if (memberItem.ChatRoomMemberEmail === item.Email) {
          input = _.filter(input, email => email.Email !== memberItem.ChatRoomMemberEmail);
        }
      });
    });
    if (_.get(memberData, 'ChatRoomMemberIsLeave', false) === false) {
      console.log('Updated', input);
      if (input.length > 0) {
        const result = CreateChatMultipleInvitation(
          input,
          ShipmentKey,
          ChatRoomKey,
          this.props.sender,
        );
        result.subscribe({
          next: (res) => {
            console.log(res);
          },
        });
      }
    } else {
      window.alert('You has been remove from the chat');
    }
    this.toggle();
  };

  renderCloseButton = () => (
    <button className="close" onClick={this.toggle}>
      &times;
    </button>
  );

  render() {
    const { collection, invitationCollection } = this.state;
    return (
      <div>
        <Button
          className="invite-btn"
          style={{
            marginTop: 5,
            marginLeft: '2rem',
            marginRight: '1rem',
            color: 'white',
            backgroundColor: '#16A085',
          }}
          onClick={this.toggle}
        >
          Invite
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className="member-invite-modal">
          <ModalHeader toggle={this.toggle} close={this.renderCloseButton()}>
            <span style={{ fontSize: '1.3em' }}>
              <b>Invite people to this chat</b>
            </span>
          </ModalHeader>
          <ModalBody>
            <MemberSearchField onResultList={this.onResultList} />
            <MemberInviteList
              collection={collection}
              invitationCollection={invitationCollection}
              shouldInvite={this.shouldInvite}
              isInvited={this.isInvited}
              usersRole={this.props.usersRole}
            />
            {invitationCollection.length > 0 ? (
              <Button
                className="invite-btn"
                style={{
                  marginLeft: '2rem',
                  marginRight: '1rem',
                  color: 'white',
                  backgroundColor: '#16A085',
                }}
                onClick={this.onSubmit}
              >
                Send Invitation (
                {invitationCollection.length}
)
              </Button>
            ) : null}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default MemberInviteModal;
