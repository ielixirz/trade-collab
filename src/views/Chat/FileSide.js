/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';

import {
  Collapse, CardBody, Card, Row, Col,
} from 'reactstrap';
import FileList from '../../component/FileList';

const styles = {
  button: {},
  boxColor: { fontSize: 20, color: 'gold', marginRight: 7 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#707070',
  },
  arrow: {
    fontSize: 20,
    marginLeft: 5,
    color: '#707070',
  },
  status: {
    color: '#58CADB',
  },
  card: {
    marginBottom: '0.2rem',
    marginRight: '0.2rem',
  },
};

class FileSide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
    };
    this.triggerCollapse = this.triggerCollapse.bind(this);
  }

  triggerCollapse() {
    this.setState(state => ({ collapse: !state.collapse }));
  }

  render() {
    return (
      <div>
        <Card onClick={this.triggerCollapse} style={styles.card}>
          <CardBody>
            <Row>
              <Col xs="10" className="text-left">
                <span style={styles.boxColor}>
                  <i className="fa fa-file" />
                </span>
                <span style={styles.title}>Shared Files</span>
              </Col>
              <Col xs="2" className="text-right">
                {this.state.collapse ? (
                  <span style={styles.arrow}>
                    <i className="fa fa-angle-down" />
                  </span>
                ) : (
                  <span style={styles.arrow}>
                    <i className="fa fa-angle-right" />
                  </span>
                )}
              </Col>
            </Row>
            <Collapse isOpen={this.state.collapse}>
              <FileList
                chatFiles={this.props.chatFile}
                shipmentKey={this.props.shipmentKey}
                chatroomKey={this.props.chatroomKey}
              />
            </Collapse>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default FileSide;
