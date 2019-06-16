/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable filenames/match-regex */
import _ from 'lodash';
import React from 'react';
import MemberInvite from './MemberInvite';
import './styles.scss';

class MemberInviteList extends React.Component {
  exist = email => {
    const { invitationCollection } = this.props;
    return invitationCollection.find(profile => profile.Email === email);
  };

  renderProfile = profile => {
    const { isInvited, shouldInvite } = this.props;
    const exist = isInvited(profile.Email);
    const existRoles = _.get(exist, 'Role', []);
    return (
      <MemberInvite
        key={profile.Email}
        profile={profile}
        existRoles={existRoles}
        shouldInvite={shouldInvite}
        isSelected={this.exist(profile.Email)}
        usersRole={this.props.usersRole}
      />
    );
  };

  render() {
    const { collection } = this.props;
    return collection.map(profile => this.renderProfile(profile));
  }
}

export default MemberInviteList;
