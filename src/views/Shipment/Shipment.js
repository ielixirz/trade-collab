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
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  UncontrolledDropdown
} from 'reactstrap';
import classnames from 'classnames';
import { connect } from 'react-redux';
import TableShipment from './TableShipment';
import { fetchShipments, fetchMoreShipments } from '../../actions/shipmentActions';
import './Shipment.css';

class Shipment extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.dropdown = this.dropdown.bind(this);
    this.state = {
      activeTab: '1',
      typeShipment: '',
      input: {
        role: '',
        from: '',
        to: '',
        product: '',
        ref: ''
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
        role: role
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
  render() {
    const { role } = this.state.input;
    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.modal} className={this.props.className}>
          <ModalHeader toggle={this.modal}>
            <h2>Create New Shipment</h2>
          </ModalHeader>
          <ModalBody>
            <div>
              <span className="left">Are you Exporting or Importing (Select One)</span>
            </div>
            <br />
            <div>
              <span className="left">Are you Exporting or Importing (Select One)</span>
              <span className="right">
                <UncontrolledDropdown>
                  <DropdownToggle tag="p" caret>
                    Neither one of these?
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem disabled>Switch role for this shipment</DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        this.setRole('Freight Forwarder');
                      }}
                      style={{
                        fontWeight: role === 'Freight Forwarder' ? 'bold' : 'normal'
                      }}
                    >
                      Freight Forwarder
                    </DropdownItem>

                    <DropdownItem
                      onClick={() => {
                        this.setRole('Custom Broker');
                      }}
                      style={{
                        fontWeight: role === 'Custom Broker' ? 'bold' : 'normal'
                      }}
                    >
                      Custom Broker
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </span>
              ​
            </div>

            <Form>
              <Row form>
                <Col md={3}>
                  <Button
                    color="yterminal"
                    onClick={() => {
                      this.setRole('Exporting');
                    }}
                    disabled={role === 'Exporting'}
                  >
                    Exporting
                  </Button>
                </Col>
                <Col md={2}>
                  <Button
                    color="yterminal"
                    onClick={() => {
                      this.setRole('Importing');
                    }}
                    disabled={role === 'Importing'}
                  >
                    Importing
                  </Button>
                </Col>
              </Row>
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
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.modal}>
              Do Something
            </Button>{' '}
            <Button color="secondary" onClick={this.modal}>
              Cancel
            </Button>
          </ModalFooter>
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
              <i className="fa fa-plus-circle" style={{ color: 'white' }} />{' '}
              <span style={{ fontWeight: 'bold', color: 'white' }}>Create New Shipment</span>
            </Button>
          </Col>
        </Nav>
        <TabContent
          activeTab={this.state.activeTab}
          id="content"
          className={'boo'}
          onScroll={e => {
            let obj = document.getElementById('content');
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
    color: '#707070'
  },
  lineTab: {
    color: '#EAEAEA',
    opacity: 0.8,
    marginLeft: 20
  }
};

const mapStateToProps = state => ({
  shipments: state.shipmentReducer.Shipments
});

export default connect(
  mapStateToProps,
  { fetchShipments, fetchMoreShipments }
)(Shipment);
