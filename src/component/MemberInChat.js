import React, { Component } from 'react';
import {
  Collapse, Button, CardBody, Card, Row, Col, ListGroupItem, ListGroup,
} from 'reactstrap';

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
              Cras justo odio
            </ListGroupItem>
            <ListGroupItem tag="a" href="#">
              Dapibus ac facilisis in
            </ListGroupItem>
          </ListGroup>
        </Collapse>
      </div>
    );
  }
}

export default MemberInChat;
