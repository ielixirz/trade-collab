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
  Col
} from 'reactstrap';
import './MemberModal.css';
import MemberInChat from './MemberInChat';
import * as _ from 'lodash';

class MemberModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }

  toggle = () => {
    console.log('toggle');
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  renderCloseButton = () => (
    <button className="close" onClick={this.toggle}>
      &times;
    </button>
  );

  render() {
    const { count, list: member } = this.props;
    let shipmentMember = [];
    console.log(this.props);
    _.forEach(member, item => {
      if (item.ChatRoomMemberCompanyName === '') {
        if (_.isEmpty(shipmentMember['Individual'])) {
          shipmentMember['Individual'] = [];
          shipmentMember['Individual'].push(item);
        } else {
          shipmentMember['Individual'].push(item);
        }
      } else {
        if (_.isEmpty(shipmentMember[item.ChatRoomMemberCompanyName])) {
          shipmentMember[item.ChatRoomMemberCompanyName] = [];
          shipmentMember[item.ChatRoomMemberCompanyName].push(item);
        } else {
          shipmentMember[item.ChatRoomMemberCompanyName].push(item);
        }
      }
    });
    let props = this.props;
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
              <Col xs="6" sm="3">
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
            {Object.keys(shipmentMember).map(function(key, index) {
              return <MemberInChat title={key} member={shipmentMember[key]} {...props} />;
            })}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default MemberModal;
