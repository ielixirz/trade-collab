/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable filenames/match-regex */
import React from 'react';
import { Input } from 'reactstrap';
import { GetUserInfoFromEmail } from '../../service/user/user';
import './styles.scss';

class MemberSearchField extends React.Component {
  state = {
    search: '',
  };

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.fetchUserEmail();
      return false;
    }
    return true;
  };

  fetchUserEmail = () => {
    const { search } = this.state;
    GetUserInfoFromEmail(search).subscribe(this.complete);
  };

  complete = (response) => {
    const { onResultList } = this.props;
    if (onResultList) onResultList(response);
    console.log(response);
  };

  render() {
    const { search } = this.state;
    return (
      <div className="member-search-container">
        <Input
          value={search}
          placeholder="...input email address"
          onKeyDown={this.onKeyDown}
          onChange={e => this.setState({ search: e.target.value })}
        />
        {search.length > 0 ? <small>*Press enter to search</small> : null}
      </div>
    );
  }
}

export default MemberSearchField;
