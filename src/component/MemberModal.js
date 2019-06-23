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
import * as _ from 'lodash';
import TextLoading from './svg/TextLoading';
import MemberInChat from './MemberInChat';

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
    const shipmentMember = [];
    console.log('Member Modal props', this.props);
    _.forEach(member, item => {
      if (_.isEmpty(item.ChatRoomMemberCompanyName)) {
        if (_.isEmpty(shipmentMember.Individual)) {
          shipmentMember.Individual = [];
          shipmentMember.Individual.push(item);
        } else {
          shipmentMember.Individual.push(item);
        }
      } else if (_.isEmpty(shipmentMember[item.ChatRoomMemberCompanyName])) {
        shipmentMember[item.ChatRoomMemberCompanyName] = [];
        shipmentMember[item.ChatRoomMemberCompanyName].push(item);
      } else {
        shipmentMember[item.ChatRoomMemberCompanyName].push(item);
      }
    });
    const props = this.props;
    return (
      <div>
        <Button className="btn-see-chatmember" onClick={this.toggle}>
          {/* <i style={{ marginRight: '0.5rem' }} className="fa  fa-users fa-lg" /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14.4"
            height="12"
            viewBox="0 0 14.4 12"
            style={{ marginRight: '0.5rem', paddingBottom: '0.75px' }}
          >
            <path
              id="Combined-Shape"
              d="M10.8,13.4a.6.6,0,0,1-1.2,0V12.2a1.8,1.8,0,0,0-1.8-1.8H3a1.8,1.8,0,0,0-1.8,1.8v1.2a.6.6,0,0,1-1.2,0V12.2a3,3,0,0,1,3-3H7.8a3,3,0,0,1,3,3ZM5.4,8a3,3,0,1,1,3-3A3,3,0,0,1,5.4,8Zm9,5.4a.6.6,0,0,1-1.2,0V12.2a1.8,1.8,0,0,0-1.35-1.741.6.6,0,1,1,.3-1.162,3,3,0,0,1,2.25,2.9ZM9.451,3.259a.6.6,0,1,1,.3-1.163,3,3,0,0,1,0,5.813.6.6,0,1,1-.3-1.163,1.8,1.8,0,0,0,0-3.487ZM5.4,6.8A1.8,1.8,0,1,0,3.6,5,1.8,1.8,0,0,0,5.4,6.8Z"
              transform="translate(0 -2)"
              fill="#6a6a6a"
            />
          </svg>

          {count === 0 ? <TextLoading /> : count}
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
            {Object.keys(shipmentMember).map((key, index) => (
              <MemberInChat title={key} member={shipmentMember[key]} {...props} />
            ))}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default MemberModal;
