import React from 'react';
import { ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import RoleBadges from './RoleBadges.js';
import _ from 'lodash';
import { LeaveChatRoomMember } from '../service/chat/chat';

export default class ListMember extends React.Component {
  render() {
    const { item: member } = this.props;
    console.log(member.ChatRoomMemberKey);
    console.log(this.props);
    let email = _.get(member, 'ChatRoomMemberEmail', '');
    let role = _.map(member.ChatRoomMemberRole, item => {
      let matches = item.match(/\b(\w)/g); // ['J','S','O','N']
      let acronym = matches.join(''); // JSON
      return acronym;
    });
    console.log(role);
    return (
      <div>
        <ListGroup flush>
          <ListGroupItem tag="a" href="#">
            <Row>
              <Col xs="6" sm="7" className="text-left">
                <span>
                  <img
                    style={{ borderRadius: 15 }}
                    src="https://image.flaticon.com/icons/svg/21/21104.svg"
                    alt="image"
                    width="30"
                    height="30"
                  />
                </span>

                <span style={{ marginLeft: 40, fontSize: 12 }}>{email}</span>
              </Col>
              <Col xs="6" sm="3">
                {role.map(item => {
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
                })}
              </Col>
              <Col
                style={{
                  'z-index': 10
                }}
              >
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();

                    let result = LeaveChatRoomMember(
                      this.props.ShipmentKey,
                      this.props.ChatRoomKey,
                      member.ChatRoomMemberKey
                    ).subscribe({
                      next: res => {
                        console.log(res);
                      },
                      complete: res => {
                        result.unsubscribe();
                      }
                    });
                  }}
                >
                  <i className="fa fa-trash-o" style={{ opacity: 0.7, marginLeft: 60 }} />
                </a>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
        <hr className="listHr" />
      </div>
    );
  }
}
