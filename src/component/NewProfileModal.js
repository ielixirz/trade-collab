/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable filenames/match-regex */
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import './MemberModal.css';
import { CreateProfile } from '../service/user/profile';

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
          <ModalHeader toggle={this.toggle} close={closeBtn} />
          <ModalBody>
            <div style={{ paddingLeft: 70, paddingRight: 70, paddingBottom: 40 }}>
              <h2 style={{ textAlign: 'center', margin: 0 }}>Add New Profile!</h2>
              <div className="text-center">
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
                  style={{ position: 'absolute', right: 310, top: 180 }}
                />
              </div>
              <form>
                <div>
                  <h4>Firstname</h4>
                  <input
                    type="text"
                    id="Firstname"
                    name="fname"
                    placeholder="Enter Firstname"
                    style={{ marginTop: 0 }}
                    value={ProfileFirstname}
                    onChange={e => this.setInput('ProfileFirstname', e.target.value)}
                  />
                </div>

                <div>
                  <h4>Surname</h4>
                  <input
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
              <p style={{ color: '#16A085' }}>Edit profile setting</p>
              <div className="col-sm-12 text-center">
                <button className="button button1" type="submit" onClick={this.submit}>
                  <span style={{ color: '#fff' }}>Create Profile</span>
                </button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default connect(state => ({ user: state.authReducer.user }))(NewProfileModal);
