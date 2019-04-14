import React, { Component } from 'react';
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Container,
  Button,
  Row,
  Col
} from 'reactstrap';
import classnames from 'classnames';
import TableShipment from './TableShipment';
import { connect } from 'react-redux';
import { fetchShipments } from '../../actions/shipmentActions';

class Shipment extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1'
    };
  }

  componentDidMount() {
    this.props.fetchShipments();
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    console.log('this state is', this.props);
    return (
      <Container>
        <div>
          <Nav>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '1' })}
                onClick={() => {
                  this.toggle('1');
                }}
              >
                Alert |
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '2' })}
                onClick={() => {
                  this.toggle('2');
                }}
              >
                Plan |
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '3' })}
                onClick={() => {
                  this.toggle('3');
                }}
              >
                Active |
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '4' })}
                onClick={() => {
                  this.toggle('4');
                }}
              >
                Complete |
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '5' })}
                onClick={() => {
                  this.toggle('5');
                }}
              >
                Cancel |
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col sm="12">
                  <TableShipment input={this.props.shipments} />
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="6">toolkit</Col>
              </Row>
            </TabPane>
            <TabPane tabId="3">
              <Row>
                <Col sm="6">
                  <h4>Tab 3Contentss</h4>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="4">
              <Row>
                <Col sm="6">
                  <h4>Complete</h4>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="5">
              <Row>
                <Col sm="6">
                  <h4>Cancel</h4>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    shipments: state.shipmentReducer.Shipments
  };
};

export default connect(
  mapStateToProps,
  { fetchShipments }
)(Shipment);
