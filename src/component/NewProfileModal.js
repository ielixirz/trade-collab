/* eslint-disable filenames/match-regex */
import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

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
          <ModalHeader toggle={this.toggle} close={closeBtn}>
            <br />
          </ModalHeader>
          <ModalBody>add profile</ModalBody>
        </Modal>
      </div>
    );
  }
}

export default NewProfileModal;
