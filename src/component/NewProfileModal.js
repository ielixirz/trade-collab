/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable filenames/match-regex */
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import {
  Modal, ModalHeader, ModalBody, Input, Button,
} from 'reactstrap';
import './MemberModal.css';
import { CreateProfile } from '../service/user/profile';
import './style/NewProfileModal.scss';

class NewProfileModal extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    children: PropTypes.any,
  };

  static defaultProps = {
    children: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      ProfileFirstname: '',
      ProfileSurname: '',
    };

    this.toggle = this.toggle.bind(this);
  }

  setInput = (field, value) => this.setState({ [field]: value });

  submit = async () => {
    const { user } = this.props;
    const { ProfileFirstname, ProfileSurname } = this.state;
    CreateProfile(user.uid, {
      ProfileFirstname,
      ProfileSurname,
    }).subscribe(this.complete);
  };

  complete = () => {
    this.toggle();
  };

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  render() {
    const { children } = this.props;
    const { modal, ProfileFirstname, ProfileSurname } = this.state;
    const closeBtn = (
      <button className="close" onClick={this.toggle} type="submit">
        &times;
      </button>
    );
    return (
      <div>
        <div role="button" tabIndex={0} onClick={this.toggle}>
          {children}
        </div>
        <Modal isOpen={modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle} close={closeBtn} style={{ border: 0 }} />
          <ModalBody>
            <div style={{ paddingLeft: 70, paddingRight: 70, paddingBottom: 40 }}>
              <h2 style={{ textAlign: 'center', margin: 0 }}>Add New Profile!</h2>
              <div className="text-center" style={{ marginTop: '20px' }}>
                <img
                  src="//placehold.it/140"
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 140 / 2,
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                  alt="avatar"
                />
              </div>
              <div>
                <i
                  className="icons cui-pencil"
                  style={{ position: 'absolute', right: 180, top: 210 }}
                />
              </div>
              <form>
                <div style={{ marginTop: '20px' }}>
                  <span style={{ fontSize: '1em', fontWeight: 'bold' }}>Name</span>
                  <Input
                    type="text"
                    id="Firstname"
                    name="fname"
                    placeholder="Enter Firstname"
                    style={{ marginTop: 0 }}
                    value={ProfileFirstname}
                    onChange={e => this.setInput('ProfileFirstname', e.target.value)}
                  />
                </div>

                <div style={{ marginTop: '15px' }}>
                  <span style={{ fontSize: '1em', fontWeight: 'bold' }}>Surname</span>
                  <Input
                    type="text"
                    id="Surname"
                    name="sname"
                    placeholder="Enter Surname"
                    style={{ marginTop: 0 }}
                    value={ProfileSurname}
                    onChange={e => this.setInput('ProfileSurname', e.target.value)}
                  />
                </div>
              </form>
              <p style={{ color: '#16A085', marginTop: 20 }}>
                <b>Edit profile setting</b>
              </p>
              <div className="col-sm-12 text-center">
                <Button className="create-profile-btn" type="submit" onClick={this.submit}>
                  <span>Create Profile</span>
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default connect(state => ({ user: state.authReducer.user }))(NewProfileModal);
