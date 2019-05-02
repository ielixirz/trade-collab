import React from 'react';
import { Badge } from 'reactstrap';
import './MemberModal.css';

export default class RoleBadges extends React.Component {
  render() {
    return (
      <div>
        <span
          className="badge-role"
          style={{
            borderColor: 'black', borderStyle: 'solid', color: 'black', borderWidth: 0.5,
          }}
        >
          {this.props.roleBadges}
        </span>
      </div>
    );
  }
}
