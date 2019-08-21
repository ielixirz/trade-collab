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
          <ListGroupItem>
            <Row>
               <div style={{marginBlockStart : 'auto' , marginLeft : '40px'}}>
                  <UserCircle/>
                </div>

              <Col xs="6" sm="6" className="text-left">
                <span>
                  <span className="invite-name" style={{fontFamily : 'Muli', color: '#4a4a4a', fontSize: '14px'}}>{member.ChatRoomMemberFirstnameFirstProfile}{' '}{member.ChatRoomMemberSurnameFirstProfile}</span>
                </span>
                <br />
                <span className="invite-email" style={{ fontFamily : 'Muli', color: '#6a6a6a', fontSize: '10px' }}>{email}</span>
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
                  style={{marginLeft : '4px'}}
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
                <span className="float-right" style={{marginRight : '73px'}}>         
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
