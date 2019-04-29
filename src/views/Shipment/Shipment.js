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
  Col,
} from 'reactstrap';
import classnames from 'classnames';
import { connect } from 'react-redux';
import TableShipment from './TableShipment';
import { fetchShipments, fetchMoreShipments } from '../../actions/shipmentActions';
import MemberModal from '../../component/MemberModal';

class Shipment extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      typeShipment: '',
    };
  }

  componentDidMount() {
    this.props.fetchShipments(this.state.typeShipment);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeTab !== this.state.activeTab) {
      console.log('fetch shipment');
      this.props.fetchShipments(this.state.typeShipment);
    }
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    console.log('this state is', this.props);
    return (
      <div>
        <Nav>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => {
                this.toggle('1');
                this.setState({ typeShipment: '' });
              }}
            >
              <span style={styles.title}>Alert</span>
              {' '}
              <span style={styles.lineTab}>|</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => {
                this.toggle('2');
                this.setState({ typeShipment: 'Planning' });
              }}
            >
              <span style={styles.title}>Plan</span>
              {' '}
              <span style={styles.lineTab}>|</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => {
                this.toggle('3');
                this.setState({ typeShipment: 'active' });
              }}
            >
              <span style={styles.title}>Active</span>
              {' '}
              <span style={styles.lineTab}>|</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '4' })}
              onClick={() => {
                this.toggle('4');
                this.setState({ typeShipment: 'Delivered' });
              }}
            >
              <span style={styles.title}>Complete</span>
              {' '}
              <span style={styles.lineTab}>|</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '5' })}
              onClick={() => {
                this.toggle('5');
                this.setState({ typeShipment: 'Cancelled' });
              }}
            >
              <i className="icon-close" />
              {' '}
              <span style={styles.title}>Cancel</span>
            </NavLink>
          </NavItem>
          <Col>
            <Button
              style={{ backgroundColor: '#16A085', marginTop: 2, marginRight: 10 }}
              className="float-right"
            >
              <i className="fa fa-plus-circle" style={{ color: 'white' }} />
              <span style={{ fontWeight: 'bold', color: 'white' }}>Create New Shipment</span>
            </Button>
            <MemberModal />
          </Col>
        </Nav>
        <TabContent
          activeTab={this.state.activeTab}
          id="content"
          className="boo"
          onScroll={(e) => {
            const obj = document.getElementById('content');
            const isTrigger = obj.scrollTop == obj.scrollHeight - obj.offsetHeight;
            if (isTrigger) {
              this.props.fetchMoreShipments();
            }
          }}
        >
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <TableShipment input={this.props.shipments} />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                {' '}
                <TableShipment input={this.props.shipments} />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <Col sm="12">
                <TableShipment input={this.props.shipments} />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="4">
            <Row>
              <Col sm="12">
                <TableShipment input={this.props.shipments} />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="5">
            <Row>
              <Col sm="12">
                <TableShipment input={this.props.shipments} />
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}
const styles = {
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#707070',
  },
  lineTab: {
    color: '#EAEAEA',
    opacity: 0.8,
    marginLeft: 20,
  },
};

const mapStateToProps = state => ({
  shipments: state.shipmentReducer.Shipments,
});

export default connect(
  mapStateToProps,
  { fetchShipments, fetchMoreShipments },
)(Shipment);
