/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  UncontrolledDropdown,
  UncontrolledCollapse
} from 'reactstrap';
import classnames from 'classnames';
import { connect } from 'react-redux';
import TableShipment from './TableShipment';
import { fetchShipments, fetchMoreShipments } from '../../actions/shipmentActions';
import { CreateShipment } from '../../service/shipment/shipment';
import './Shipment.css';

class Shipment extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.dropdown = this.dropdown.bind(this);
    this.state = {
      activeTab: '1',
      typeShipment: '',
      input: {
        role: 1,
        from: '',
        to: '',
        product: '',
        ref: '',
        bound: '',
        method: '',
        type: ''
      },
      modal: false,
      dropdownOpen: false
    };
    this.writeText = this.writeText.bind(this);
    this.modal = this.modal.bind(this);
  }

  modal() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  createShipment() {
    const { input } = this.state;
    /* ex. CreateShipment
  {
      ShipmentSellerCompanyName (string)
      ShipmentSourceLocation (string)
      ShipmentBuyerCompanyName (string)
      ShipmentDestinationLocation (string)
      ShipmentProductName (string)
      ShipmentETD (timestamp)
      ShipmentETAPort (timestamp)
      ShipmentETAWarehouse (timestamp)
      ShipmentStatus (string)
      ShipmentPriceDescription (string)
      ShipmentCreatorType (string) *Importer or Exporter
      ShipmentCreatorUserKey (string)
      ShipmentCreateTimestamp (timestamp)
  }
*/
    const parameter = {};
    switch (input.role) {
      case 1:
        parameter.ShipmentCreatorType = 'Importer';
        break;
      case 2:
        parameter.ShipmentCreatorType = 'Exporter';
        break;
      case 3:
        parameter.ShipmentCreatorType = 'Freight Forwarder';
        break;
      case 4:
        parameter.ShipmentCreatorType = 'Custom Broker';
        break;
      default:
        break;
    }
    parameter.ShipmentProductName = input.product;
    parameter.ShipmentCreatorUserKey = this.props.user.uid;
    if (input.role > 2) {
      if (input.bound === 1) {
        parameter.ShipmentCreatorType = `Inbound ${parameter.ShipmentCreatorType}`;
      } else {
        parameter.ShipmentCreatorType = `Outbound ${parameter.ShipmentCreatorType}`;
      }
    }
    parameter.ShipmentCreateTimestamp = new Date().getTime();
    CreateShipment(parameter);

    this.setState(prevState => ({
      modal: !prevState.modal,
      input: {}
    }));
  }

  dropdown() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
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
        activeTab: tab
      });
    }
  }

  setRole(role) {
    this.setState({
      input: {
        ...this.state.input,
        role
      }
    });
  }

  setBound(bound) {
    this.setState({
      input: {
        ...this.state.input,
        bound
      }
    });
  }

  setMethod(method) {
    this.setState({
      input: {
        ...this.state.input,
        method
      }
    });
  }

  setType(type) {
    this.setState({
      input: {
        ...this.state.input,
        type
      }
    });
  }

  writeText(e) {
    const { name, value } = e.target;

    this.setState({
      input: {
        ...this.state.input,
        [name]: value
      }
    });
  }

  handleChange = selectedOption => {
    console.log(selectedOption);
    this.setState({
      input: {
        ...this.state.input,
        role: selectedOption.value
      }
    });
  };

  render() {
    const { role, bound, method, type } = this.state.input;
    console.log(this.props.user);
    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.modal} className={this.props.className}>
          <ModalHeader toggle={this.modal}>
            <h2>Create New Shipment</h2>
          </ModalHeader>
          <ModalBody>
            {role > 2 ? (
              <div>
                <FormGroup row>
                  <Label for="To" sm={6}>
                    Your role in this shipment
                  </Label>
                  <Col sm={6}>
                    <Input
                      type="select"
                      name="role"
                      id="role"
                      onChange={this.writeText}
                      value={this.state.input.role}
                    >
                      <option value={3}>Freight Forwarder</option>
                      <option value={4}>Custom Broker</option>
                    </Input>
                  </Col>
                </FormGroup>
                <br />
              </div>
            ) : null}
            <div>
              <span className="left">
                {role > 2
                  ? 'Is this an inbound Shipment or an Outbound Shipment'
                  : 'Are you Exporting or Importing (Select One)'}
              </span>
              <span className="right">
                <UncontrolledDropdown>
                  <DropdownToggle tag="p" caret>
                    Neither one of these?
                  </DropdownToggle>
                  {role < 3 ? (
                    <DropdownMenu>
                      <DropdownItem disabled>Switch role for this shipment</DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          this.setRole(3);
                        }}
                        style={{
                          fontWeight: role === 3 ? 'bold' : 'normal'
                        }}
                      >
                        Freight Forwarder
                      </DropdownItem>

                      <DropdownItem
                        onClick={() => {
                          this.setRole(4);
                        }}
                        style={{
                          fontWeight: role === 4 ? 'bold' : 'normal'
                        }}
                      >
                        Custom Broker
                      </DropdownItem>
                    </DropdownMenu>
                  ) : (
                    <DropdownMenu>
                      <DropdownItem disabled>Switch role for this shipment</DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          this.setRole(1);
                        }}
                        style={{
                          fontWeight: role === 1 ? 'bold' : 'normal'
                        }}
                      >
                        Importer
                      </DropdownItem>

                      <DropdownItem
                        onClick={() => {
                          this.setRole(2);
                        }}
                        style={{
                          fontWeight: role === 2 ? 'bold' : 'normal'
                        }}
                      >
                        Exporter
                      </DropdownItem>
                    </DropdownMenu>
                  )}
                </UncontrolledDropdown>
              </span>
            </div>
            <br />
            <Form>
              {role > 2 ? (
                <Row form>
                  <Col md={3}>
                    <Button
                      color="yterminal"
                      onClick={() => {
                        this.setBound(1);
                      }}
                      disabled={bound === 1}
                    >
                      Inbound
                    </Button>
                  </Col>
                  <Col md={2}>
                    <Button
                      color="yterminal"
                      onClick={() => {
                        this.setBound(2);
                      }}
                      disabled={bound === 2}
                    >
                      Outbound
                    </Button>
                  </Col>
                </Row>
              ) : (
                <Row form>
                  <Col md={3}>
                    <Button
                      color="yterminal"
                      onClick={() => {
                        this.setRole(2);
                      }}
                      disabled={role === 2}
                    >
                      Exporting
                    </Button>
                  </Col>
                  <Col md={2}>
                    <Button
                      color="yterminal"
                      onClick={() => {
                        this.setRole(1);
                      }}
                      disabled={role === 1}
                    >
                      Importing
                    </Button>
                  </Col>
                </Row>
              )}
              <br />
              <FormGroup row>
                <Label for="From" sm={2}>
                  From
                </Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    name="from"
                    id="from"
                    onChange={this.writeText}
                    value={this.state.input.from}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="To" sm={2}>
                  To
                </Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    name="to"
                    id="to"
                    onChange={this.writeText}
                    value={this.state.input.to}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="Product" sm={2}>
                  Product
                </Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    name="product"
                    id="product"
                    onChange={this.writeText}
                    value={this.state.input.product}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="Ref" sm={2}>
                  Ref
                </Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    name="ref"
                    id="ref"
                    onChange={this.writeText}
                    value={this.state.input.ref}
                  />
                </Col>
              </FormGroup>
              <Row className="show-grid">
                <Col md={3} />
                <Col md={6}>
                  <a id="toggler" href="#" style={{ marginBottom: '1rem' }}>
                    More details on Freight method and type
                  </a>
                </Col>
                <Col md={3} />
              </Row>

              <UncontrolledCollapse toggler="#toggler">
                <Row form>
                  <Col md={2} />
                  <Col md="auto">
                    <Button
                      color="yterminal"
                      onClick={() => {
                        this.setMethod(1);
                      }}
                      style={{
                        marginRight: '5px'
                      }}
                      disabled={method === 1}
                    >
                      Ocean Freight
                    </Button>{' '}
                    <Button
                      color="yterminal"
                      onClick={() => {
                        this.setMethod(2);
                      }}
                      style={{
                        marginRight: '5px'
                      }}
                      disabled={method === 2}
                    >
                      Show Both
                    </Button>{' '}
                    <Button
                      color="yterminal"
                      onClick={() => {
                        this.setMethod(3);
                      }}
                      style={{
                        marginRight: '5px'
                      }}
                      disabled={method === 3}
                    >
                      Air Freight
                    </Button>
                    <Button
                      color="yterminal"
                      onClick={() => {
                        this.setMethod(4);
                      }}
                      style={{
                        marginRight: '5px'
                      }}
                      disabled={method === 4}
                    >
                      Truck
                    </Button>
                  </Col>
                  <Col md={3} />
                </Row>
                <br />
                <FormGroup row>
                  <Label for="Ref" sm={4}>
                    Shipment Type
                  </Label>
                  <Col sm={6}>
                    <Button
                      color="yterminal"
                      onClick={() => {
                        this.setType(1);
                      }}
                      style={{
                        marginRight: '5px'
                      }}
                      disabled={type === 1}
                    >
                      LCL
                    </Button>{' '}
                    <Button
                      color="yterminal"
                      onClick={() => {
                        this.setType(2);
                      }}
                      style={{
                        marginRight: '5px'
                      }}
                      disabled={type === 2}
                    >
                      FCL
                    </Button>
                  </Col>
                </FormGroup>
              </UncontrolledCollapse>
            </Form>
          </ModalBody>
          <Row
            style={{
              marginBottom: '50px'
            }}
          >
            <Col md={4} />
            <Col md="6">
              <Button
                color="success"
                onClick={() => {
                  this.createShipment();
                }}
              >
                Create
              </Button>{' '}
            </Col>
            <Col md={3} />
          </Row>
        </Modal>
        <Nav>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => {
                this.toggle('1');
                this.setState({ typeShipment: '' });
              }}
            >
              <span style={styles.title}>Alert</span> <span style={styles.lineTab}>|</span>
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
              <span style={styles.title}>Plan</span> <span style={styles.lineTab}>|</span>
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
              <span style={styles.title}>Active</span> <span style={styles.lineTab}>|</span>
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
              <span style={styles.title}>Complete</span> <span style={styles.lineTab}>|</span>
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
              <i className="icon-close" /> <span style={styles.title}>Cancel</span>
            </NavLink>
          </NavItem>
          <Col>
            <Button
              style={{ backgroundColor: '#16A085', marginTop: 2, marginRight: 10 }}
              className="float-right"
              onClick={this.modal}
            >
              <i className="fa fa-plus-circle" style={{ color: 'white' }} />
              <span style={{ fontWeight: 'bold', color: 'white' }}>Create New Shipment</span>
            </Button>
          </Col>
        </Nav>
        <TabContent
          activeTab={this.state.activeTab}
          id="content"
          className="boo"
          onScroll={e => {
            const obj = document.getElementById('content');
            const isTrigger = obj.scrollTop === obj.scrollHeight - obj.offsetHeight;
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
    cursor: 'pointer'
  },
  lineTab: {
    color: '#EAEAEA',
    opacity: 0.8,
    marginLeft: 20
  }
};

const mapStateToProps = state => ({
  shipments: state.shipmentReducer.Shipments,
  user: state.authReducer.user
});

export default connect(
  mapStateToProps,
  { fetchShipments, fetchMoreShipments }
)(Shipment);
