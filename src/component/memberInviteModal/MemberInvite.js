/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable filenames/match-regex */
import _ from 'lodash';
import React from 'react';
import MemberRoleModal from './MemberRoleModal';
import './styles.scss';

class MemberInvite extends React.Component {
  onSelectRole = role => {
    const { existRoles } = this.props;
    console.log('selected role ', role, 'existRoles', existRoles);
    console.log('existRoles.includes(role)', existRoles.includes(role));
    let updated = null;
    if (existRoles.includes(role)) {
      updated = _.filter(existRoles, data => data !== role);
    } else {
      updated = [...existRoles, role];
      console.log(updated);
    }
    this.handleRoleSelected(updated);
  };

  handleRoleSelected = updated => {
    const { profile, shouldInvite } = this.props;
    const { Image, Email } = profile;
    shouldInvite({ Image, Email, Role: updated });
  };

  render() {
    const { profile, isSelected = false, existRoles } = this.props;
    const { Image, Email } = profile;
    return (
      <div key={profile.id} className="profile-member-container">
        <div className="profile-image">
          {Image ? <img src={Image} /> : <img className="profile-image-placeholder" />}
        </div>
        <div className="profile-content">{Email}</div>
        <div className="profile-assign-role">
          <MemberRoleModal roleCollection={existRoles} onSelectRole={this.onSelectRole} />
        </div>
        <div className="profile-delete">
          {isSelected ? (
            <i className="fa fa-check" style={{ opacity: 0.7, marginLeft: 60 }} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default MemberInvite;
