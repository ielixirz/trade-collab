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

const style = {
  optionStyle: role => {
    fontWeight: role === 'Freight Forwarder' ? 'bold' : 'normal';
  }
};
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
        form: '',
        to: '',
        product: '',
        ref: ''
      },
      modal: false,
      dropdownOpen: false
    };

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
  render() {
    console.log('this state is', this.state);
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
                      style={style.optionStyle(role)}
                    >
                      Freight Forwarder
                    </DropdownItem>

                    <DropdownItem
                      onClick={() => {
                        this.setRole('Custom Broker');
                      }}
                      style={style.optionStyle(role)}
                    >
                      Custom Broker {role === 'Custom Broker' ? '/' : null}
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
              <FormGroup>
                <Label for="exampleAddress">Address</Label>
                <Input type="text" name="address" id="exampleAddress" placeholder="1234 Main St" />
              </FormGroup>
              <FormGroup>
                <Label for="exampleAddress2">Address 2</Label>
                <Input
                  type="text"
                  name="address2"
                  id="exampleAddress2"
                  placeholder="Apartment, studio, or floor"
                />
              </FormGroup>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="exampleCity">City</Label>
                    <Input type="text" name="city" id="exampleCity" />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="exampleState">State</Label>
                    <Input type="text" name="state" id="exampleState" />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Label for="exampleZip">Zip</Label>
                    <Input type="text" name="zip" id="exampleZip" />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup check>
                <Input type="checkbox" name="check" id="exampleCheck" />
                <Label for="exampleCheck" check>
                  Check me out
                </Label>
              </FormGroup>
              <Button>Sign in</Button>
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
