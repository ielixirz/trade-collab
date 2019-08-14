import React, { Component } from 'react';
import {
  Collapse,
  Button,
  CardBody,
  Card,
  Row,
  Col,
  ListGroupItem,
  ListGroup,
  Media,
  Badge
} from 'reactstrap';
import RoleBadges from './RoleBadges.js';
import ListMember from './ListMember.js';
import * as _ from 'lodash';

const styles = {
  arrow: {
    fontSize: 20,
    marginRight: 5,
    color: '#707070'
  },
  icons: { color: 'black', fontSize: 12 }
};

class MemberInChat extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle() {
    this.setState(state => ({ collapse: !state.collapse }));
  }

  render() {
    let { member, isEdit, toggleBlocking } = this.props;    
    let roleStringList = [];
    var message = ""
    
    _.forEach(member, item => {
      if (!roleStringList.indexOf(item.ChatRoomMemberRole) > -1){
        message = message + item.ChatRoomMemberRole + ", "
      }
    })

    return (
      <div>
        <Row>
          <Col xs="6" sm="7" className="text-left">
            {this.state.collapse ? (
              <span style={styles.arrow}>
                <i className="fa fa-caret-up" style={styles.icons} />
              </span>
            ) : (
              <span style={styles.arrow}>
                <i className="fa fa-caret-down" style={styles.icons} />
              </span>
            )}
            <span onClick={this.toggle} style={{}}>
              <span style={{ cursor: 'pointer' }}>{this.props.title} ({member.length})    {message.slice(0, -1)}</span>
            </span>
          </Col>
          <Col xs="6" sm="3" />
          <Col xs="6" sm="2" />
        </Row>
        <Collapse isOpen={this.state.collapse}>
          {member.map(item => {
            return <ListMember toggleBlocking={toggleBlocking} item={item} {...this.props} isEdit={isEdit}/>;
          })}
        </Collapse>

      </div>
    );
  }
}

export default MemberInChat;
