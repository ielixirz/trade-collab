/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable filenames/match-regex */
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import '../MemberModal.css';
import MemberInviteList from './MemberInviteList';

const AVAILABLE_ROLES = {
  Importer: ['Importer', 'Exporter', 'Forwarder Inbound', 'Custom Broker Inbound'],
  Exporter: ['Importer', 'Exporter', 'Custom Broker Outbound', 'Forwarder Outbound'],
  'Forwarder Outbound': ['Exporter', 'Custom Broker Outbound', 'Forwarder Inbound'],
  'Custom Broker Outbound': ['Importer', 'Custom Broker Inbound'],
  'Forwarder Inbound': [
    'Importer',
    'Forwarder Outbound',
    'Forwarder Inbound',
    'Custom Broker Inbound'
  ]
};
const DEFAULT_ROLE = ['None'];

class MemberRoleModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  getRoleInitial = role => {
    const splited = role.split(' ');
    const { length } = splited;
    if (length > 1) {
      return splited[0][0] + splited[length - 1][0];
    }
    return splited[0][0];
  };

  getRoleBaseOnUserType = () => {
    const { user, usersRole } = this.props;
    const { UserInfoAccountType } = user;
    console.log('usersRole', usersRole);
    let outputRole = [];
    _.forEach(usersRole.ShipmentMemberRole, item => {
      let role = _.get(AVAILABLE_ROLES, item, DEFAULT_ROLE);
      _.forEach(role, itemrole => {
        outputRole.push(itemrole);
      });
    });

    return _.union(outputRole);
  };

  renderCloseButton = () => (
    <button className="close" onClick={this.toggle}>
      &times;
    </button>
  );

  renderRole = role => {
    const { roleCollection, onSelectRole } = this.props;
    return (
      <div key={role} className="member-role-content" onClick={() => onSelectRole(role)}>
        <div className="member-role-initial">{this.getRoleInitial(role)}</div>
        <div className="member-role-name">{role}</div>
        <div className="member-role-selected">
          {roleCollection.includes(role) ? <i className="fa fa-check" /> : null}
        </div>
      </div>
    );
  };

  render() {
    const roles = this.getRoleBaseOnUserType();
    return (
      <div>
        <Button onClick={this.toggle}>
          Assign Role
          <i className="fa fa-chevron-right" />
        </Button>
        <Modal
          size="sm"
          isOpen={this.state.modal}
          toggle={this.toggle}
          className="member-role-modal"
        >
          <ModalHeader toggle={this.toggle} close={this.renderCloseButton()}>
            <div>Assign the person a role in this shipment</div>
            <small>
              <u>
                <i>Why?</i>
              </u>
            </small>
          </ModalHeader>
          <ModalBody>{roles.map(this.renderRole)}</ModalBody>
        </Modal>
      </div>
    );
  }
}

export default connect(state => ({ user: state.userReducer.UserInfo }))(MemberRoleModal);
