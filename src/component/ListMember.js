import React from 'react';
import { Button ,ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import RoleBadges from './RoleBadges.js';
import _ from 'lodash';
import { LeaveChatRoomMember } from '../service/chat/chat';
import UserCircle from '../component/svg/User';
import Trash from '../component/svg/Trash';

export default class ListMember extends React.Component {

  constructor(props) {
    super(props);
    this.state = { deleteStateEnable: false };
  }

  toggleDeleteState = () => {
    this.setState(state => ({ deleteStateEnable: !state.deleteStateEnable }));
  }

  render() {
    const { item: member, toggleBlocking , isEdit} = this.props;

    let email = _.get(member, 'ChatRoomMemberEmail', '');
    let role = _.map(member.ChatRoomMemberRole, item => {
      let matches = item.match(/\b(\w)/g); // ['J','S','O','N']
      let acronym = matches.join(''); // JSON
      return acronym;
    });

    return (
      <div>
        <ListGroup flush>
          <ListGroupItem tag="a" href="#">
            <Row>
              <Col xs="6" sm="7" className="text-left">
                <span>
                  <UserCircle/>
                </span>
                <span style={{ marginLeft: 10 }}>
                  <span className="invite-name">{member.ChatRoomMemberFirstnameFirstProfile}{' '}
                  {member.ChatRoomMemberSurnameFirstProfile}</span>
                </span>
                <br />
                <span className="invite-email" style={{ marginLeft: 40, fontSize: 12 }}>{email}</span>
              </Col>
              <Col xs="6" sm="2">
                {/* {role.map(item => {
                  return (
                    <span
                      className="badge-role"
                      style={{
                        borderColor: 'black',
                        borderStyle: 'solid',
                        color: 'black',
                        borderWidth: 0.5,
                        marginRight: '5px'
                      }}
                    >
                      {item}
                    </span>
                  );
                })} */}
              </Col>
              <Col
                style={{
                  'z-index': 10
                }}>

                { isEdit === true ? 
                 <span                 
                   onClick={e => {
                   e.preventDefault()
                   this.toggleDeleteState()
                 }}>
              {this.state.deleteStateEnable ? 
              <Row>
                  <Button 
                    className="company-shipment-button"
                    style={{borderRadius : "5px" , border : "solid 1px #070707"}}
                    color="white" onClick={this.toggleCompanyState}>
                    Cancel
                  </Button>
                  <Button 
                  className="company-shipment-button"
                  style={{marginLeft : '8px'}}
                  color="danger"
                  onClick={e => {
                    e.preventDefault();
                    toggleBlocking(true);
                    LeaveChatRoomMember(
                      this.props.ShipmentKey,
                      this.props.ChatRoomKey,
                      member.ChatRoomMemberKey
                    ).subscribe({
                      next: res => {},
                      error: res => {
                        toggleBlocking(false);
                        console.error(res);
                      },
                      complete: res => {}
                    });
                  }}>
                    Remove
                  </Button>
                </Row>: 
                <span className="float-right" style={{marginRight : '60px'}}>         
                  <Trash/>
                </span>
                }                 
               </span>
                  :
                  null}
              
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </div>
    );
  }
}
