/* eslint-disable filenames/match-regex */
import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import './MemberModal.css';

class NewProfileModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  render() {
    const closeBtn = (
      <button className="close" onClick={this.toggle} type="submit">
        &times;
      </button>
    );
    return (
      <div>
        <div onClick={this.toggle}>{this.props.children}</div>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
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
                  />
                </div>
              </form>
              <p style={{ color: '#16A085' }}>Edit profile setting</p>
              <div className="col-sm-12 text-center">
                <button className="button button1" type="submit">
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

export default NewProfileModal;
