import React from 'react';
import {
  ListGroup, ListGroupItem, Row, Col,
} from 'reactstrap';
import RoleBadges from './RoleBadges.js';

export default class ListMember extends React.Component {
  render() {
    return (
      <div>
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
                <RoleBadges roleBadges="E" />
              </Col>
              <Col xs="6" sm="2">
                <i className="fa fa-trash-o" style={{ opacity: 0.7, marginLeft: 60 }} />
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
        <hr className="listHr" />
      </div>
    );
  }
}
