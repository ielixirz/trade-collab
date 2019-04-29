import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InputGroup,
  InputGroupAddon,
  Input,
  Row,
  Col,
  UncontrolledCollapse,
} from 'reactstrap';
import './MemberModal.css';
import MemberInChat from './MemberInChat';

class MemberModal extends React.Component {
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
      <button className="close" onClick={this.toggle}>
        &times;
      </button>
    );

    return (
      <div>
        <Button color="info" onClick={this.toggle}>
          {this.props.buttonLabel}
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle} close={closeBtn}>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <Button>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>Invite new member</span>
                </Button>
              </InputGroupAddon>
              <Input placeholder="...input email address" />
            </InputGroup>
            <br />
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col xs="6" sm="6">
                <span
                  style={{ color: '#3B3B3B', fontSize: 22, fontWeight: 'bold' }}
                  className="float-left"
                >
                  Members In this chat
                </span>
              </Col>
              <Col xs="6" sm="3" right>
                <span style={{ color: '#707070' }} className="float-right">
                  Role in shipment
                </span>
              </Col>
              <Col xs="6" sm="3">
                <span style={{ color: '#16A085', textAlign: 'right' }} className="float-right">
                  (what is this?)
                </span>
              </Col>
            </Row>
            <hr />
            <MemberInChat title="individual" individual />
            <MemberInChat title="fresh product" individual={false} />
            <MemberInChat title="tp venture" individual={false} />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default MemberModal;
