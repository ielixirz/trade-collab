/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
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
  GetLastestShipment,
  CreateShipmentReference,
  EditShipment,
  SearchShipment,
  UpdateShipmentReference,
  CreateShipmentBySelectCompanyWithShipmentReferenceAndShipmentMasterData
} from '../../service/shipment/shipment';
import {
  CombineCreateCompanyWithCreateCompanyMember,
} from '../../service/company/company';

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
import Airplane from '../../component/svg/Airplane';
import Boat from '../../component/svg/Boat';
import Truck from '../../component/svg/Truck';
import XCalendar from '../../component/XCalendarV3';
import XSuggest from '../../component/XSuggestV2';

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
        to: [],
        product: '',
        ref: '',
        bound: '',
        method: 1,
        type: 2,
        details: '',
        etd: 0,
        eta: 0,
        newCompanyName: '',
        importer: '',
        exporter: '',
      },
      companies: {},
      modal: false,
      dropdownOpen: false,
      blocking: true,
      inputCompany: false,
      swapRolePage: 1,
      companySelect : {}
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

  $xsuggest = null

  toggleBlocking(block) {
    this.setState({ blocking: block });
  }

  toggleSwapPage = () => {
    this.setState({ swapRolePage: !this.state.swapRolePage });
  }

  modal() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  GetLastestShipment = () => {
    GetLastestShipment(this.props.user.uid).subscribe({
      next: (data) => {
        console.log("complete" + JSON.stringify(data[0]));
        
        this.setState({
          input:{
            ...this.state.input,
            role : this.getRoleMessage(data[0].ShipmentCreatorType)
          }
        
        })
      },
      error: (error) => {
        console.log("error" + error);
      },
    });
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
    const referenceParameter = {};
    const masterParamter = {};
    switch (input.role) {
      case 1:
        parameter.ShipmentCreatorType = 'Importer';
        break;
      case 2:
        parameter.ShipmentCreatorType = 'Exporter';
        break;
      case 3:
        parameter.ShipmentCreatorType = 'Inbound Forwarder';
        break;
      case 4:
        parameter.ShipmentCreatorType = 'Outbound Forwarder';
        break;
      case 5:
        parameter.ShipmentCreatorType = 'Inbound Custom Broker';
        break;
      case 6:
        parameter.ShipmentCreatorType = 'Outbound Custom Broker';
        break;    
      default:
        break;
    }
    
    parameter.ShipmentProductName = input.product;
    parameter.ShipmentStatus = 'Planning';

    parameter.ShipmentCreatorUserKey = this.props.user.uid;
    // if (input.role > 2) {
    //   if (input.bound === 1) {
    //     parameter.ShipmentCreatorType = `Inbound ${parameter.ShipmentCreatorType}`;
    //   } else {
    //     parameter.ShipmentCreatorType = `Outbound ${parameter.ShipmentCreatorType}`;
    //   }
    // }
    // parameter.ShipmentSellerCompanyName = this.state.companySelect.CompanyName;
    parameter.ShipmentCreatorProfileFirstName = this.props.sender.ProfileFirstname;
    parameter.ShipmentCreatorProfileSurName = this.props.sender.ProfileSurname;
    parameter.ShipmentCreatorProfileKey = this.props.sender.id;
    parameter.ShipmentCreateTimestamp = new Date().getTime();

    if (isValidEmail(input.to) && this.props.user.email !== input.to) {
      parameter.ShipmentPartnerEmail = input.to;
    }

    referenceParameter.ShipmentReferenceID = this.state.input.ref
    referenceParameter.ShipmentReferenceCompanyName = this.state.companySelect.CompanyName
    referenceParameter.ShipmentReferenceCompanyKey = this.state.companySelect.CompanyKey

    masterParamter.ShipmentDetailProduct = this.state.input.product;
    masterParamter.ShipmentDetailPriceDescriptionOfGoods = this.state.input.details;
    masterParamter.ShipperETDDate = parseInt(this.state.input.etd);
    masterParamter.ConsigneeETAPortDate = parseInt(this.state.input.eta);
    masterParamter.ShipperCompanyName = this.state.input.exporter;
    masterParamter.ConsigneeCompanyName = this.state.input.importer;


    CreateShipmentBySelectCompanyWithShipmentReferenceAndShipmentMasterData(parameter, referenceParameter, masterParamter).subscribe({
      next: shipmentResult => {
        this.fetchShipmentReload();
        this.props.history.push(`/chat/${shipmentResult[0]}`);
        
        // Clear sugguest input
        this.$xsuggest && this.$xsuggest.clearSelects()     
      },
      error: (error) => {
        console.log('error' + error)
      }
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
          this.combinnfeShipment = CombineShipmentAndShipmentReference(
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

    // this.GetLastestShipment();
  }

  toggleCompanyState = () =>  {
    this.setState({
      inputComapany: !this.state.inputComapany
    });
  }

  toggleCompanyState = () =>  {
    this.setState({
      inputComapany: !this.state.inputComapany
    });
  }

  createCompany = () => {
    if (this.state.input.newCompanyName === ''){
      alert('Input name invalid');
      return;
    }

    const userData = {
      UserMemberEmail: this.props.user.email,
      UserMemberPosition: '-',
      UserMemberRoleName: 'Owner',
      CompanyUserAccessibilityRolePermissionCode: '11111111111111',
      UserMemberCompanyStandingStatus: 'Active',
      UserMemberJoinedTimestamp: new Date(),
    };

    const companyData = {
      CompanyName: this.state.input.newCompanyName,
      CompanyID: this.state.input.newCompanyName
    }

    CombineCreateCompanyWithCreateCompanyMember(companyData, this.props.user.uid, userData).subscribe(() => {
      this.toggleCompanyState();
      this.props.companies.push(companyData)
      this.setState({
        input: {
          ...this.state.input,
          newCompanyName : '',
        },
      });
    });
  };

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

  setDateState(name, timestamp) {

    this.setState({
      input: {
        ...this.state.input,
        [name]: timestamp
      },
    });
  }

  setDateState(name, timestamp) {

    this.setState({
      input: {
        ...this.state.input,
        [name]: timestamp
      },
    });
  }

  handleChange = (selectedOption) => {
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

    if (_.isEmpty(this.state.companySelect)){
      return false;
    }

    if (checkRole >= 1 && checkRole <= 6) {
      return true;
    }


    // if (checkRole === 1 || checkRole === 2) {
    //   return true;
    // }
    // if (checkRole === 3 || checkRole === 4) {
    //   if (checkBound === '' || checkBound === 0) {
    //     return false;
    //   }
    //   return true;
    // }
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

  getRoleMessage = (role) => {
    switch (role) {
      case 1:
        return 'Importer';
      case 2:
        return 'Exporter';
      case 3:
        return 'Inbound Forwarder';
      case 4:
        return 'Outbound Forwarder';
      case 5:
        return 'Inbound Custom Broker';
      case 6:
        return 'Outbound Custom Broker';
      default:
        break;
    }
  }

  getShippingMessage = (type) => {
    switch (type) {
      case 1:
        return 'Sea Ocean Freight';
      case 3:
        return 'Air Freight';
      case 4:
        return 'Truck';  
    }
  }

  getContainerMessage = (type) => {
    switch (type) {
      case 1:
        return 'LCL';
      case 2:
        return 'FCL';
    }
  }

  setSelectCompany = (company) => {
    console.log('company' + JSON.stringify(company));
    this.setState({
      companySelect: company
    });
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
    const { query: typeShipment, network ,shipments} = this.props;

    console.log('Shipment props', this.props);

    let suggestion = _.map(network, item => {
      return {
        id: item.UserMemberEmail,
        label: item.UserMemberEmail
      };
    });

    console.log('shipments', shipments);
    const result = _.filter(shipments, item => {
      let keyword = '';
      if (_.isEmpty(typeShipment)) {
        if (item.ShipmentStatus === 'Cancelled') {
          return false;
        }
        return true;
      }

      switch (typeShipment) {
        case 'All':
          keyword = [
            'Planning',
            'Order Confirmed',
            'In Transit',
            'Delayed',
            'Delivered',
            'Completed'
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
        <Modal size="lg" isOpen={this.state.modal} toggle={this.modal} className="shipment-modal">
          <ModalHeader style={{border : '0px'}} toggle={this.modal}>
            Create New Shipment
          </ModalHeader>
          <ModalBody style={{marginLeft : '40px' , marginRight : '40px'}}>
            <Row>   
            <UncontrolledDropdown style={{marginLeft:'16px'}}>
                  <DropdownToggle tag="p" style={{textDecoration:'underline' , fontWeight:'bold'}}>
                    {_.isEmpty(this.state.companySelect) ? "Select Company" : this.state.companySelect.CompanyName}
                  </DropdownToggle>
                    <DropdownMenu>

                      <DropdownItem disabled className="shipment-header">Share with shipping with people in</DropdownItem>

                      {_.map(this.props.companies, item =>                                             
                        <DropdownItem
                            onClick={() => {
                              this.setSelectCompany(item);
                            }}
                            className="shipment-item-box">
                               {item.CompanyName}
                          </DropdownItem>
                      )
                      }
                      {this.state.inputComapany ?(
                        <div>
                       <Input
                          style={{marginLeft:'8px' , marginRight:'8px', width: '90%'}}
                          type="text"
                          name="newCompanyName"
                          id="newCompanyName"
                          placeholder="Input New Company Name"
                          onChange={this.writeText}
                          value={this.state.input.newCompanyName}  
                       />

                      <Row>
                        <Col xs="4" />
                        <Col xs="3" >
                          <Button 
                            className="company-shipment-button"
                            color="white" onClick={this.toggleCompanyState}>
                            Cancel
                          </Button>
                        </Col>
                        <Col xs="3" >
                          <Button 
                          className="company-shipment-button"
                          color="danger"
                          onClick={this.createCompany}>
                            Save
                          </Button>
                        </Col>
                      </Row> 
                      </div>
                      ):(                        
                        <Button className="company-shipment" onClick={this.toggleCompanyState}>
                        + Create New Company
                        </Button>
                      )}
                    </DropdownMenu>
                </UncontrolledDropdown>

            <div style={{marginLeft:'8px', marginRight:'8px'}}>
                 is
            </div>
            <UncontrolledDropdown>
                  <DropdownToggle tag="p" style={{textDecoration:'underline', fontWeight:'bold'}}>
                    {this.getRoleMessage(this.state.input.role)}
                  </DropdownToggle>
                  {this.state.swapRolePage == 0 ? (
                    <DropdownMenu>
                      <DropdownItem disabled className="shipment-header">Switch role for this shipment</DropdownItem>
                      
                      <DropdownItem
                        onClick={() => {
                          this.setRole(3);
                        }}
                        className="shipment-item-box"
                      >
                        Inbound Forwarder
                      </DropdownItem>

                      <DropdownItem
                        onClick={() => {
                          this.setRole(4);
                        }}
                        className="shipment-item-box"
                        
                      >
                        Outbound Forwarder
                      </DropdownItem>
                      <DropdownItem
                          onClick={() => {
                            this.setRole(5);
                          }}
                          className="shipment-item-box"
                          
                        >
                        Inbound Custom Broker
                      </DropdownItem>

                      <DropdownItem
                        onClick={() => {
                          this.setRole(6);
                        }}
                        className="shipment-item-box"
                      >
                       Outbound Custom Broker
                      </DropdownItem>

                      <DropdownItem
                        toggle={false}
                        onClick={() => {
                          this.toggleSwapPage();
                        }}
                        className="shipment-item-box"
                      >
                       Neither of These
                      </DropdownItem>
                  </DropdownMenu>
                  ) : (
                    <DropdownMenu>
                      <DropdownItem disabled className="shipment-header">Switch role for this shipment</DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          this.setRole(1);
                        }}
                        className="shipment-item-box"
                        >
                        Importer
                      </DropdownItem>

                      <DropdownItem
                        onClick={() => {
                          this.setRole(2);
                        }}
                        className="shipment-item-box"
                      >
                        Exporter
                      </DropdownItem>

                      <DropdownItem
                        toggle={false}
                        onClick={() => {
                          this.toggleSwapPage();
                        }}
                        className="shipment-item-box"
                      >
                       Neither of These
                      </DropdownItem>
                    </DropdownMenu>
                  )}
                </UncontrolledDropdown>
                <div style={{marginLeft:'8px', marginRight:'8px'}}>
                  for
                </div> 
                <UncontrolledDropdown>
                  <DropdownToggle tag="p" style={{textDecoration:'underline', marginRight:'8px', fontWeight:'bold'}}>
                        {this.getShippingMessage(this.state.input.method)}
                  </DropdownToggle>
                  
                    <DropdownMenu style={{width: '200%'}}>
                      <DropdownItem disabled className="shipment-header">Freight Method</DropdownItem>
                        <DropdownItem
                          onClick={() => {
                            this.setMethod(1);
                          }}
                          className="shipment-item-box-gray-background">
                          Sea Ocean Freight
                          <span className="float-right">
                            <Boat />
                          </span>
                        </DropdownItem>

                      {/* <DropdownItem
                        onClick={() => {
                          this.setMethod(2);
                        }}
                        className="shipment-item-box-gray-background">
                        Show Both
                      </DropdownItem> */}

                      <DropdownItem                      
                        onClick={() => {
                          this.setMethod(3);
                        }}
                        className="shipment-item-box-gray-background"
                        disabled>
                        Air Freight <span style={{fontSize:'10px'}}>(Coming Soon)</span>
                        <span className="float-right">
                          <Airplane/>
                        </span>
                      </DropdownItem>

                      <DropdownItem
                        onClick={() => {
                          this.setMethod(4);
                        }}
                        className="shipment-item-box-gray-background"
                        disabled>
                        Truck <span style={{fontSize:'10px'}}>(Coming Soon)</span>
                        <span className="float-right">
                          <Truck />
                        </span>
                      </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>

                <UncontrolledDropdown>
                  <DropdownToggle tag="p" style={{textDecoration:'underline', marginRight:'8px', fontWeight:'bold'}}>
                    {this.getContainerMessage(this.state.input.type)}
                  </DropdownToggle>
                  
                    <DropdownMenu>
                      <DropdownItem disabled className="shipment-header">Container Load</DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          this.setType(2);
                        }}
                        className="shipment-item-box-gray-background">
                        FCL : Full Container Load
                      </DropdownItem>

                      <DropdownItem
                        onClick={() => {
                          this.setType(1);
                        }}
                        className="shipment-item-box-gray-background"
                        disabled>
                        LCL : Less Than Container Load <span style={{fontSize:'10px'}}>(Coming Soon)</span>
                      </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>

                <div style={{marginRight:'16px'}}>
                  Container
                </div> 
            </Row>
              {/* <div>
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
              </div> */}
            <Form style={{margin : '16px'}}  >             
              <FormGroup row>
                <Label for="From" sm={2} className="create-shipment-field-title">
                  From
                </Label>
                <Col sm={10}>
                  <Input
                    className="input-shipment"
                    type="text"
                    name="from"
                    id="from"
                    onChange={this.writeText}
                    value={`${this.props.user.email} (You)`}
                    readonly
                    disabled
                    autoCorrect="off"
                  />
                </Col>
              </FormGroup>

            {/* Send E-mail to */}
              <FormGroup row>
                <Label for="To" sm={2} className="create-shipment-field-title">
                  To
                </Label>
                <Col sm={10}>
                  {/* <Input
                    type="email"
                    name="to"
                    id="to"
                    onChange={this.writeText}
                    value={this.state.input.to}
                  /> */}
                  <XSuggest
                    ref={$el => this.$xsuggest = $el}
                    className="material"
                    placeholder="Input your Importers E-mail address"
                    datasets={suggestion}
                    idName={'id'}
                    labelName={'label'}
                    avatarName={'avatar'}
                    onAdd={item => this.state.input.to.push(item)}
                    onRemove={item => this.state.input.to.pop(item)}
                    onChange={(selects, adds, removes) => console.log(selects, adds, removes)}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="Product" sm={2} className="create-shipment-field-title">
                  Ref#
                </Label>
                <Col sm={10}>
                  <Input
                    className="input-shipment"
                    type="text"
                    name="ref"
                    id="ref"
                    placeholder="PO, Invoice No. Shipment Name etc. "
                    onChange={this.writeText}
                    value={this.state.input.ref}
                  />
                </Col>
              </FormGroup>
              <br/>

              {/* ETA & ETD Calendar */}

              <FormGroup row>
                <Col sm={{size: 9, offset: 2}}>
                  <XCalendar
                    start={this.state.input.etd}
                    startLabel="ETD Port"
                    end={this.state.input.eta}
                    endLabel="ETA Port"
                    tbaValue={'TBA'}
                    onStartChange={etd => this.setDateState('etd', etd)}
                    onEndChange={eta => this.setDateState('eta', eta)}
                  />
                </Col>
                {/* <Col sm={{size: 3, offset: 2}}>
                  <Input
                    type="text"
                    name="etd"
                    id="etd"
                    onChange={this.writeText}
                    value={this.state.input.etd}
                  />
                </Col>
                <Col sm={3}>
                  <Input
                    type="text"
                    name="eta"
                    id="eta"
                    onChange={this.writeText}
                    value={this.state.input.eta}
                  />
                </Col> */}
              </FormGroup>

              <FormGroup row>
                <Label for="Product" sm={2} className="create-shipment-field-title">
                  Product
                </Label>
                <Col sm={10}>
                  <Input
                    className="input-shipment"
                    type="text"
                    name="product"
                    id="product"
                    placeholder="Short Description of goods. "
                    onChange={this.writeText}
                    value={this.state.input.product}
                  />
                </Col>
              </FormGroup>

              {(role == 1 || role >= 3) ? 
              <FormGroup row>
                <Label for="Exporter" sm={2} className="create-shipment-field-title">
                  Exporter
                </Label>
                <Col sm={10}>
                  <Input
                    className="input-shipment"
                    type="text"
                    name="exporter"
                    id="exporter"
                    placeholder="Input Exporter Company Name"
                    onChange={this.writeText}
                    value={this.state.input.exporter}
                  />
                </Col>
              </FormGroup>
              : null}

              {(role == 2 || role >= 3) ? 
              <FormGroup row>
                <Label for="Importer" sm={2} className="create-shipment-field-title">
                  Importer
                </Label>
                <Col sm={10}>
                  <Input
                    className="input-shipment"
                    type="text"
                    name="importer"
                    id="importer"
                    placeholder="Input Importer Company Name"
                    onChange={this.writeText}
                    value={this.state.input.importer}
                  />
                </Col>
              </FormGroup>
              : null}
              <FormGroup row>
                <Label for="Details" sm={2} className="create-shipment-field-title">
                  Details
                </Label>
                <Col sm={10}>
                  <Input
                    type="textarea"
                    name="details"
                    id="details"
                    rows="4"
                    placeholder="Description of order, quantity, price of goods etc."
                    onChange={this.writeText}
                    value={this.state.input.details}
                  />
                </Col>
              </FormGroup>
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
              className={classnames({ active: typeShipment === 'All' })}
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
    search,
    network: companyReducer.NetworkEmail
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
