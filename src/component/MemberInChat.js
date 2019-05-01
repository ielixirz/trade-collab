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
          <Col xs="6" sm="6" className="text-left">
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
          <Col xs="6" sm="3" />
          <Col xs="6" sm="3" />
        </Row>
        {this.props.individual ? (
          <div />
        ) : (
          <hr style={{ borderTopWidth: 1, borderStyle: 'solid', borderColor: '#333' }} />
        )}
        <Collapse isOpen={this.state.collapse}>
          <ListGroup flush>
            <ListGroupItem disabled tag="a" href="#">
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
                  <span style={{ marginLeft: 10 }}>Kael the invoker</span>
                  <br />
                  <span style={{ marginLeft: 40, fontSize: 12 }}>invoker@dot2.com</span>
                </Col>
                <Col xs="6" sm="3">
                  <RoleBadges roleBadges="CE" />
                </Col>
                <Col xs="6" sm="2">
                  <i className="fa fa-trash-o" style={{ opacity: 0.7, marginLeft: 60 }} />
                </Col>
              </Row>
            </ListGroupItem>
          </ListGroup>
        </Collapse>
      </div>
    );
  }
}

export default MemberInChat;
