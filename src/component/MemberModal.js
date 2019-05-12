/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable filenames/match-regex */
import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  InputGroup,
  InputGroupAddon,
  Input,
  Row,
  Col,
} from 'reactstrap';
import './MemberModal.css';
import MemberInChat from './MemberInChat';

class MemberModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  toggle = () => {
    console.log('toggle');
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  renderCloseButton = () => (
    <button className="close" onClick={this.toggle}>
      &times;
    </button>
  );

  render() {
    const { count } = this.props;
    return (
      <div>
        <Button color="link" onClick={this.toggle}>
          <i style={{ marginRight: '0.5rem' }} className="fa  fa-users fa-lg" />
          {count}
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle} close={this.renderCloseButton()}>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <Button>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>Invite new member:</span>
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
                  Role in shipment:
                </span>
              </Col>
              <Col xs="6" sm="3">
                <span style={{ color: '#16A085', textAlign: 'right' }} className="float-right">
                  <div style={{ marginBottom: -10 }}>(what is this?)</div>
                </span>
              </Col>
            </Row>
            <hr />
            <MemberInChat title="Individual" individual />
            <MemberInChat title="Fresh product" individual={false} allRows={['cd', 'ef', 'c']} />
            <MemberInChat title="Tp venture" individual={false} />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default MemberModal;
