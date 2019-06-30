/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
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
import { CreateProfile, UpdateProfile } from '../service/user/profile';
import './style/NewProfileModal.scss';
import { isValidName } from '../utils/validation';

import {
  PutFile,
  GetMetaDataFromStorageRefPath,
  GetURLFromStorageRefPath,
} from '../service/storage/managestorage';

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
      invalid: {
        Firstname: { isInvalid: undefined, msg: '' },
        Surname: { isInvalid: undefined, msg: '' },
      },
      isWorking: false,
      selectedPic: undefined,
    };
    this.fileInput = React.createRef();
    this.previewPic = React.createRef();
    this.toggle = this.toggle.bind(this);
  }

  setInput = (field, value) => this.setState({ [field]: value });

  submit = async () => {
    this.setState({
      isWorking: true,
    });
    const { user } = this.props;
    const { ProfileFirstname, ProfileSurname } = this.state;
    if (this.validateFields()) {
      CreateProfile(user.uid, {
        ProfileFirstname,
        ProfileSurname,
      }).subscribe((result) => {
        const { selectedPic } = this.state;
        if (selectedPic !== undefined) {
          this.uploadProfilePic(selectedPic, result.id);
        } else {
          this.complete();
        }
      });
    } else {
      this.setState({
        isWorking: false,
      });
    }
  };

  complete = () => {
    this.toggle();
  };

  validateFields = () => {
    let valid = true;
    const i = { ...this.state.invalid };
    const firstname = this.state.ProfileFirstname;
    const surname = this.state.ProfileSurname;
    if (firstname !== '') {
      if (!isValidName(firstname)) {
        valid = valid && false;
        i.Firstname.isInvalid = true;
        i.Firstname.msg = '*Invalid';
      } else {
        i.Firstname.isInvalid = false;
      }
    } else {
      valid = valid && false;
      i.Firstname.isInvalid = true;
      i.Firstname.msg = '*Required';
    }

    if (surname !== '') {
      if (!isValidName(surname)) {
        valid = valid && false;
        i.Surname.isInvalid = true;
        i.Surname.msg = '*Invalid';
      } else {
        i.Surname.isInvalid = false;
      }
    } else {
      valid = valid && false;
      i.Surname.isInvalid = true;
      i.Surname.msg = '*Required';
    }

    this.setState({
      invalid: i,
    });
    return valid;
  };

  browseFile = () => {
    this.fileInput.current.value = null;
    this.fileInput.current.click();
  };

  uploadProfilePic = (file, createdId) => {
    const { user } = this.props;
    const storageRefPath = `/Profile/${createdId}/${new Date().valueOf()}${file.name}`;
    PutFile(storageRefPath, file).subscribe({
      next: () => {},
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        GetMetaDataFromStorageRefPath(storageRefPath).subscribe({
          next: (metaData) => {
            GetURLFromStorageRefPath(metaData.ref).subscribe({
              next: (url) => {
                UpdateProfile(user.uid, createdId, { UserInfoProfileImageLink: url }).subscribe(
                  this.complete,
                );
              },
              complete: () => {},
            });
          },
        });
      },
    });
  };

  selectProfilePic = (file) => {
    this.previewPic.current.src = URL.createObjectURL(file);
    this.setState({
      selectedPic: file,
    });
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
        <div role="button" tabIndex={0} onClick={this.toggle} className="add-profile-modal-link">
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
                  ref={this.previewPic}
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
                  onClick={this.browseFile}
                  role="button"
                  onKeyDown={null}
                  tabIndex="-1"
                  className="icons cui-pencil"
                  style={{
                    position: 'absolute',
                    right: 180,
                    top: 210,
                    cursor: 'pointer',
                  }}
                />
                <input
                  type="file"
                  id="file"
                  ref={this.fileInput}
                  style={{ display: 'none' }}
                  onChange={event => this.selectProfilePic(event.target.files[0])}
                />
              </div>
              <form>
                <div style={{ marginTop: '20px' }}>
                  <span style={{ fontSize: '1em', fontWeight: 'bold' }}>Name</span>
                  {this.state.invalid.Firstname.isInvalid ? (
                    <span className="field-error-msg">{this.state.invalid.Firstname.msg}</span>
                  ) : (
                    ''
                  )}
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
                  {this.state.invalid.Surname.isInvalid ? (
                    <span className="field-error-msg">{this.state.invalid.Surname.msg}</span>
                  ) : (
                    ''
                  )}
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
                <Button
                  className="create-profile-btn"
                  type="submit"
                  onClick={this.submit}
                  disabled={this.state.isWorking}
                >
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
