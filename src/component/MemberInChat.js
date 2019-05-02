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
  Badge,
} from 'reactstrap';
import RoleBadges from './RoleBadges.js';
import ListMember from './ListMember.js';

const styles = {
  arrow: {
    fontSize: 20,
    marginRight: 5,
    color: '#707070',
  },
  icons: { color: 'black', fontSize: 12 },
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
              {this.props.title}
            </span>
          </Col>
          <Col xs="6" sm="3">
            <div style={{ marginLeft: -5 }}>
              {this.props.individual ? null : <RoleBadges roleBadges="E" />}
            </div>
          </Col>
          <Col xs="6" sm="2" />
        </Row>
        {this.props.individual ? (
          <div />
        ) : (
          <hr style={{ borderTopWidth: 1, borderStyle: 'solid', borderColor: '#333' }} />
        )}
        <Collapse isOpen={this.state.collapse}>
          <ListMember />
          <ListMember />
        </Collapse>
      </div>
    );
  }
}

export default MemberInChat;
