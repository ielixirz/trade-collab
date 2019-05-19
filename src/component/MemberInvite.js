/* eslint-disable filenames/match-regex */
import React from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, Row, Col,
} from 'reactstrap';
import './MemberModal.css';

class MemberInvite extends React.Component {
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
      <button type="submit" className="close" onClick={this.toggle}>
        &times;
      </button>
    );

    return (
      <div>
        <Button
          className="invite-btn"
          style={{
            marginLeft: '2rem',
            marginRight: '1rem',
            color: 'white',
            backgroundColor: '#16A085',
          }}
          onClick={this.toggle}
        >
          <i style={{ marginRight: '0.5rem' }} className="fa  fa-user-plus fa-lg" />
          {this.props.buttonLabel}
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle} close={closeBtn}>
            <h3>Invite your colleagues to join the company</h3>
            <br />
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col xs="6" sm="12">
                <h2>Mock up for invite members.</h2>
              </Col>
            </Row>
            <hr />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default MemberInvite;
