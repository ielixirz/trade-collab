/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
/* eslint-disable filenames/match-regex */
import firebase from 'firebase';
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
  UncontrolledCollapse,
  ModalFooter,
  InputGroupAddon,
  InputGroupText,
  InputGroup
} from 'reactstrap';
import classnames from 'classnames';
import { connect } from 'react-redux';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import TableShipment from './TableShipment';
import { fetchShipments, fetchMoreShipments, searching } from '../../actions/shipmentActions';
import {
  CombineShipmentAndShipmentReference,
  CreateShipment,
  CreateShipmentReference,
  EditShipment,
  SearchShipment,
  UpdateShipmentReference
} from '../../service/shipment/shipment';
import { UpdateMasterData } from '../../service/masterdata/masterdata';
import './Shipment.scss';
import { GetUserCompany } from '../../service/user/user';
import { GetShipmentTotalCount } from '../../service/personalize/personalize';
import _ from 'lodash';
import { fetchCompany, setQuery } from '../../actions/companyAction';
import { AddChatRoomMember, CreateChatRoom } from '../../service/chat/chat';
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import { isValidEmail } from '../../utils/validation';
import { CreateChatMultipleInvitation } from '../../service/join/invite';

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;
class Shipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      activeTab: '1',
      filterKeyword: 'ShipmentProductName',
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
      companies: {},
      modal: false,
      dropdownOpen: false,
      blocking: true
    };
    this.fetchMoreShipment = this.fetchMoreShipment.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.dropdown = this.dropdown.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.triggerChange = this.triggerChange.bind(this);
    this.renderSearch = this.renderSearch.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.fetchShipment = {};
    this.combineShipment = {};
    this.timeout = null;

    this.toggleBlocking = this.toggleBlocking.bind(this);
    this.writeText = this.writeText.bind(this);
    this.modal = this.modal.bind(this);
  }

  toggleBlocking(block) {
    this.setState({ blocking: block });
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
    parameter.ShipmentStatus = 'Planning';

    parameter.ShipmentCreatorUserKey = this.props.user.uid;
    if (input.role > 2) {
      if (input.bound === 1) {
        parameter.ShipmentCreatorType = `Inbound ${parameter.ShipmentCreatorType}`;
      } else {
        parameter.ShipmentCreatorType = `Outbound ${parameter.ShipmentCreatorType}`;
      }
    }
    if (isValidEmail(input.to) && this.props.user.email !== input.to) {
      parameter.ShipmentPartnerEmail = input.to;
    }
    parameter.ShipmentCreatorProfileFirstName = this.props.sender.ProfileFirstname;
    parameter.ShipmentCreatorProfileSurName = this.props.sender.ProfileSurname;

    parameter.ShipmentCreateTimestamp = new Date().getTime();
    CreateShipment(parameter).subscribe({
      next: createdShipment => {
        this.fetchShipmentReload();
        const shipmentKey = createdShipment.id;
        const inviteMember = [];

        UpdateMasterData(createdShipment.id, 'DefaultTemplate', {
          ShipmentDetailProduct: parameter.ShipmentProductName
        }).subscribe(() => {
          this.props.history.push(`/chat/${shipmentKey}`);
        });
      },
      error: () => {}
    });

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

  fetchMoreShipment() {
    this.toggleBlocking(true);
    if (!_.isEmpty(this.fetchShipment)) {
      this.fetchShipment.unsubscribe();
      if (!_.isEmpty(this.combineShipment)) {
        this.combineShipment.unsubscribe();
      }
    }
    const { search } = this.props;

    if (_.isEmpty(search)) {
      console.log('normal fetch');
      this.fetchShipment = GetShipmentTotalCount(this.props.sender.id).subscribe({
        next: notification => {
          this.combineShipment = CombineShipmentAndShipmentReference(
            '',
            '',
            'asc',
            _.size(this.props.shipments) + 10,
            this.props.user.uid
          ).subscribe({
            next: shipment => {
              const { query: typeShipment } = this.props;
              const result = shipment;
              this.setState({ blocking: false });

              this.props.fetchShipments(result, notification);
            },
            error: err => {
              console.log(err);
              this.setState({ blocking: false });
            },
            complete: () => {}
          });
        }
      });
    } else {
      this.fetchShipment = GetShipmentTotalCount(this.props.sender.id).subscribe({
        next: notification => {
          this.combineShipment = SearchShipment(
            this.props.user.uid,
            search,
            this.state.filterKeyword,
            _.size(this.props.shipments) + 10
          ).subscribe({
            next: res => {
              let shipment = _.map(res, item => ({
                id: item.ShipmentID,
                ...item
              }));
              console.log('Search Result ', shipment);
              if (_.includes(this.state.filterKeyword, 'Date')) {
                shipment = _.filter(
                  shipment,
                  item =>
                    _.get(item, `${this.state.filterKeyword}`, 'ShipmentProductName') >= search
                );
              } else if (this.state.filterKeyword !== 'ShipmentReferenceList') {
                shipment = _.filter(shipment, item =>
                  _.includes(
                    _.get(item, `${this.state.filterKeyword}`, 'ShipmentProductName').toLowerCase(),
                    search.toLowerCase()
                  )
                );
              }

              console.log('Search Result Filtered', shipment);
              const result = shipment;
              this.setState({ blocking: false });

              this.props.fetchShipments(result, notification);
            }
          });
        }
      });
    }
  }

  fetchShipmentReload() {
    if (!_.isEmpty(this.fetchShipment)) {
      this.fetchShipment.unsubscribe();
      if (!_.isEmpty(this.combineShipment)) {
        this.combineShipment.unsubscribe();
      }
    }
    this.fetchShipment = GetShipmentTotalCount(this.props.sender.id).subscribe({
      next: notification => {
        this.combineShipment = CombineShipmentAndShipmentReference(
          '',
          '',
          'asc',
          _.size(this.props.shipments) + 10,
          this.props.user.uid
        ).subscribe({
          next: shipment => {
            const { query: typeShipment } = this.props;
            const result = shipment;
            this.setState({ blocking: false });

            this.props.fetchShipments(result, notification);
          },
          error: err => {
            console.log(err);
            this.setState({ blocking: false });
          },
          complete: () => {}
        });
      }
    });
  }

  componentWillMount() {
    this.timer = null;
  }

  componentDidMount() {
    const { search } = this.props;
    if (!_.isEmpty(this.fetchShipment)) {
      this.fetchShipment.unsubscribe();
      if (!_.isEmpty(this.combineShipment)) {
        this.combineShipment.unsubscribe();
      }
    }
    if (_.isEmpty(search)) {
      this.fetchShipment = GetShipmentTotalCount(this.props.sender.id).subscribe({
        next: notification => {
          this.combineShipment = CombineShipmentAndShipmentReference(
            '',
            '',
            'asc',
            20,
            this.props.user.uid
          ).subscribe({
            next: shipment => {
              // Alert : All Status
              // Plan : Planning, Order Confirmed
              // Active : Order Confirmed, In Transit, Delayed
              // Complete: Delivered, Completed
              // Cancel: Cancelled
              const { query: typeShipment } = this.props;
              const result = shipment;
              this.setState({ blocking: false });

              this.props.fetchShipments(result, notification);
            },
            error: err => {
              this.setState({ blocking: false });
            },
            complete: () => {}
          });
        }
      });
    } else {
      this.fetchShipment = GetShipmentTotalCount(this.props.sender.id).subscribe({
        next: notification => {
          this.combineShipment = SearchShipment(
            this.props.user.uid,
            search,
            this.state.filterKeyword,
            15
          ).subscribe({
            next: res => {
              let shipment = _.map(res, item => ({
                id: item.ShipmentID,
                ...item
              }));
              console.log('Search Result ', shipment);
              if (_.includes(this.state.filterKeyword, 'Date')) {
                shipment = _.filter(
                  shipment,
                  item =>
                    _.get(item, `${this.state.filterKeyword}`, 'ShipmentProductName') >= search
                );
              } else if (this.state.filterKeyword !== 'ShipmentReferenceList') {
                shipment = _.filter(shipment, item =>
                  _.includes(
                    _.get(item, `${this.state.filterKeyword}`, 'ShipmentProductName').toLowerCase(),
                    search.toLowerCase()
                  )
                );
              }

              console.log('Search Result Filtered', shipment);
              const result = shipment;
              this.setState({ blocking: false });

              this.props.fetchShipments(result, notification);
            }
          });
        }
      });
    }

    GetUserCompany(this.props.user.uid).subscribe({
      next: res => {
        this.props.fetchCompany(res);
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeTab !== this.state.activeTab) {
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

  validateCreateShipment() {
    const checkRole = +this.state.input.role;
    const checkBound = +this.state.input.bound;

    if (checkRole === 1 || checkRole === 2) {
      return true;
    }
    if (checkRole === 3 || checkRole === 4) {
      if (checkBound === '' || checkBound === 0) {
        return false;
      }
      return true;
    }
    return false;
  }

  handleSearchChange(evt) {
    console.log('typing', evt);
    try {
      if (this.timer) {
        clearTimeout(this.timer);
      }
    } catch (e) {
      console.log(e, this.timer);
    }
    if (evt === null) {
      this.props.searching('');
    } else {
      if (evt instanceof Date) {
        this.props.searching(evt);
        this.setState({ keyword: evt, blocking: true });
      } else {
        this.props.searching(evt.target.value);
        this.setState({ keyword: evt.target.value, blocking: true });
      }
    }

    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
  }

  handleKeyDown(e) {
    if (e.keyCode === ENTER_KEY) {
      this.triggerChange();
    }
  }

  triggerChange() {
    this.props.fetchShipments({}, []);
    let { search } = this.props;
    if (_.isEmpty(search)) {
      console.log('normal fetch');
      this.fetchShipmentReload();
    } else {
      if (_.includes(this.state.filterKeyword, 'Date')) {
        search = firebase.firestore.Timestamp.fromDate(moment(search).toDate());
        console.log(search);
      }
      if (!_.isEmpty(this.fetchShipment)) {
        this.fetchShipment.unsubscribe();
        if (!_.isEmpty(this.combineShipment)) {
          this.combineShipment.unsubscribe();
        }
      }
      const { typeShipment } = this.state;
      this.toggleBlocking(true);

      this.fetchShipment = GetShipmentTotalCount(this.props.sender.id).subscribe({
        next: notification => {
          this.combineShipment = SearchShipment(
            this.props.user.uid,
            search,
            this.state.filterKeyword,
            15
          ).subscribe({
            next: res => {
              let shipment = _.map(res, item => ({
                id: item.ShipmentID,
                ...item
              }));
              console.log('Search Result ', shipment);
              if (_.includes(this.state.filterKeyword, 'Date')) {
                shipment = _.filter(
                  shipment,
                  item =>
                    _.get(item, `${this.state.filterKeyword}`, 'ShipmentProductName') >= search
                );
              } else if (this.state.filterKeyword !== 'ShipmentReferenceList') {
                shipment = _.filter(shipment, item =>
                  _.includes(
                    _.get(item, `${this.state.filterKeyword}`, 'ShipmentProductName').toLowerCase(),
                    search.toLowerCase()
                  )
                );
              }

              console.log('Search Result Filtered', shipment);
              const result = shipment;
              this.setState({ blocking: false });

              this.props.fetchShipments(result, notification);
            }
          });
        }
      });
    }
  }

  renderSearch() {
    const { search: keyword } = this.props;

    const options = [
      { value: 'ShipperETDDate', label: 'ETD' },
      { value: 'ConsigneeETAPortDate', label: 'ETA' },
      // { value: 'ConsigneePort', label: 'Port' },
      { value: 'ShipmentProductName', label: 'Product' },
      { value: 'ShipmentBuyerCompanyName', label: 'Buyer' },
      { value: 'ShipmentSellerCompanyName', label: 'Seller' },
      // { value: 'ShipmentStatus', label: 'Status' },
      { value: 'ShipmentReferenceList', label: 'Ref' }
    ];

    const SearchShipmentFilter = () => (
      <Select
        options={options}
        className="basic-multi-select search-filter-select selectfilter"
        classNamePrefix="select"
        defaultValue={_.find(options, option => option.value === 'ShipmentProductName')}
        value={_.find(options, option => option.value === this.state.filterKeyword)}
        onChange={option => {
          this.setState({
            filterKeyword: option.value,
            keyword: ''
          });
          this.props.searching('');
        }}
      />
    );

    return (
      <div
        className="search-filter-select-container"
        style={{
          width: 'auto'
        }}
      >
        <InputGroup>
          <InputGroupAddon addonType={'prepend'}>{SearchShipmentFilter()}</InputGroupAddon>
          {_.includes(this.state.filterKeyword, 'Date') ? (
            <DatePicker
              className="search-filter-select-date"
              onChange={this.handleSearchChange}
              value={keyword}
              locale="en-GB"
            />
          ) : (
            <>
              <Input
                placeholder={` Search by ${
                  _.find(options, option => option.value === this.state.filterKeyword).label
                }`}
                type="text"
                className="search-filter-select-input"
                style={{ height: 38 }}
                onChange={this.handleSearchChange}
                onKeyDown={this.handleKeyDown}
                value={keyword}
              />
              <InputGroupAddon addonType="append">
                <Button
                  style={{
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    borderLeft: 1,
                    borderColor: ' #cccccc',
                    borderStyle: 'solid'
                  }}
                  onClick={() => {
                    this.setState({ keyword: '', blocking: true });
                    this.props.searching('');
                    this.fetchShipmentReload();
                  }}
                >
                  x
                </Button>
              </InputGroupAddon>
            </>
          )}
        </InputGroup>
      </div>
    );
  }

  render() {
    const { role, bound, method, type } = this.state.input;
    const { query: typeShipment, shipments } = this.props;
    console.log('shipments', shipments);
    const result = _.filter(shipments, item => {
      let keyword = '';
      if (_.isEmpty(typeShipment)) {
        return item.ShipmentStatus !== 'Cancelled';
      }
      //
      // Alert : All Status
      // Plan : Planning, Order Confirmed
      // Active : Order Confirmed, In Transit, Delayed
      // Complete: Delivered, Completed
      // Cancel: Cancelled
      switch (typeShipment) {
        case 'All':
          keyword = [
            'Planning',
            'Order Confirmed',
            'In Transit',
            'Delayed',
            'Delivered',
            'Completed',
            'Cancelled'
          ];
          return _.some(keyword, el => _.includes(item.ShipmentStatus, el));
        case 'Plan':
          keyword = ['Planning', 'Order Confirmed'];
          return _.some(keyword, el => _.includes(item.ShipmentStatus, el));
        case 'Active':
          keyword = ['In Transit', 'Order Confirmed', 'Delayed'];
          return _.some(keyword, el => _.includes(item.ShipmentStatus, el));
        case 'Delivered':
          keyword = ['Delivered', 'Completed'];
          return _.some(keyword, el => _.includes(item.ShipmentStatus, el));
        case 'Cancel':
          keyword = ['Cancelled'];
          return _.some(keyword, el => _.includes(item.ShipmentStatus, el));
      }
    });
    return (
      <div className="shipment-table-main-container">
        <Modal isOpen={this.state.modal} toggle={this.modal} className="create-shipment">
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
              <span className="left" style={{ fontWeight: 'bold' }}>
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
                        className="create-shipment-dropdown-item-role"
                      >
                        Freight Forwarder
                      </DropdownItem>

                      <DropdownItem
                        onClick={() => {
                          this.setRole(4);
                        }}
                        className="create-shipment-dropdown-item-role"
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
                        className="create-shipment-dropdown-item-role"
                      >
                        Importer
                      </DropdownItem>

                      <DropdownItem
                        onClick={() => {
                          this.setRole(2);
                        }}
                        className="create-shipment-dropdown-item-role"
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
                <Row form style={{ marginTop: '7px' }}>
                  <Col md={3} style={{ marginRight: '10px' }}>
                    <Button
                      color="yterminal"
                      className="create-shipment-role-btn"
                      onClick={() => {
                        this.setBound(1);
                      }}
                      disabled={bound === 1}
                    >
                      Inbound
                    </Button>
                  </Col>
                  <Col md={3}>
                    <Button
                      color="yterminal"
                      className="create-shipment-role-btn"
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
                <Row form style={{ marginTop: '7px' }}>
                  <Col md={3} style={{ marginRight: '10px' }}>
                    <Button
                      color="yterminal"
                      className="create-shipment-role-btn"
                      onClick={() => {
                        this.setRole(2);
                      }}
                      disabled={role === 2}
                    >
                      Exporting
                    </Button>
                  </Col>
                  <Col md={3}>
                    <Button
                      color="yterminal"
                      className="create-shipment-role-btn"
                      style={{ width: '100%' }}
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
                <Label for="From" sm={2} className="create-shipment-field-title">
                  From
                </Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    name="from"
                    id="from"
                    onChange={this.writeText}
                    value={`${this.props.user.email} (You)`}
                    readonly
                    disabled
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="To" sm={2} className="create-shipment-field-title">
                  To
                </Label>
                <Col sm={10}>
                  <Input
                    type="email"
                    name="to"
                    id="to"
                    onChange={this.writeText}
                    value={this.state.input.to}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="Product" sm={2} className="create-shipment-field-title">
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

              <Row className="show-grid">
                <Col md={3} />
                <Col md={6}>
                  <a id="toggler" href="#" style={{ marginBottom: '1rem' }}>
                    More details on Freight method and type
                  </a>
                </Col>
                <Col md={3} />
              </Row>

              <UncontrolledCollapse toggler="#toggler" style={{ marginLeft: '20px' }}>
                <Row form style={{ marginTop: '15px' }}>
                  <Label for="freight-method" sm={4} className="create-shipment-field-title">
                    Freight Method
                  </Label>
                </Row>
                <Row>
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
                  <Label for="Ref" sm={4} className="create-shipment-field-title">
                    Shipment Type
                  </Label>
                  <Col sm={3}>
                    <Button
                      color="yterminal"
                      onClick={() => {
                        this.setType(1);
                      }}
                      className="create-shipment-role-btn"
                      disabled={type === 1}
                    >
                      LCL
                    </Button>
                  </Col>
                  <Col sm={3}>
                    <Button
                      color="yterminal"
                      onClick={() => {
                        this.setType(2);
                      }}
                      className="create-shipment-role-btn"
                      disabled={type === 2}
                    >
                      FCL
                    </Button>
                  </Col>
                </FormGroup>
              </UncontrolledCollapse>
            </Form>
          </ModalBody>
          <ModalFooter style={{ border: 'none' }}>
            <Button
              color="success"
              onClick={() => {
                this.createShipment();
              }}
              className="create-shipment-create-btn"
              disabled={!this.validateCreateShipment()}
            >
              Create
            </Button>
          </ModalFooter>
        </Modal>
        <Nav className="shipment-navbar">
          <NavItem>
            <NavLink
              className={classnames({ active: typeShipment === '' })}
              onClick={() => {
                this.toggle('1');
                this.props.setQuery('');
              }}
            >
              <span style={styles.title}>Alert</span> <span style={styles.lineTab}>|</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: typeShipment === 'Plan' })}
              onClick={() => {
                this.toggle('1');
                this.props.setQuery('All');
              }}
            >
              <span style={styles.title}>All</span> <span style={styles.lineTab}>|</span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              className={classnames({ active: typeShipment === 'Cancel' })}
              onClick={() => {
                this.toggle('1');
                this.props.setQuery('Cancel');
              }}
            >
              <i className="icon-close" /> <span style={styles.title}>Cancel</span>
            </NavLink>
          </NavItem>
          <Col>
            <Button
              style={{ backgroundColor: '#16A085', marginTop: 2, marginRight: 29 }}
              className="float-right"
              onClick={this.modal}
            >
              <i className="fa fa-plus-circle" style={{ color: 'white' }} />
              <span style={{ fontWeight: 'bold', color: 'white', marginLeft: 5 }}>
                Create New Shipment
              </span>
            </Button>
          </Col>
        </Nav>
        <TabContent activeTab={this.state.activeTab} id="content" className="boo">
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <TableShipment
                  companies={this.props.companies}
                  input={{ ...result }}
                  typeShipment={this.props.query}
                  toggleBlock={this.toggleBlocking}
                  fetchMoreShipment={this.fetchMoreShipment}
                  fetchShipment={this.fetchShipment}
                  searchInput={this.renderSearch}
                  setShipments={this.props.fetchShipments}
                  blocking={this.state.blocking}
                  filterKeyword={this.state.filterKeyword}
                  keyword={this.state.keyword}
                />
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
    color: '#707070',
    cursor: 'pointer'
  },
  lineTab: {
    color: '#EAEAEA',
    opacity: 0.8,
    marginLeft: 20
  }
};

const mapStateToProps = state => {
  const { ChatReducer, authReducer, profileReducer, companyReducer, shipmentReducer } = state;
  const { query = '', search = '' } = shipmentReducer;
  const sender = _.find(
    profileReducer.ProfileList,
    item => item.id === profileReducer.ProfileDetail.id
  );

  return {
    shipments: state.shipmentReducer.Shipments,
    user: state.authReducer.user,
    sender,
    companies: companyReducer.UserCompany,
    query,
    search
  };
};

export default connect(
  mapStateToProps,
  {
    searching,
    fetchShipments,
    fetchMoreShipments,
    fetchCompany,
    setQuery
  }
)(Shipment);
