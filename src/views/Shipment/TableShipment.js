/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/order */
/* eslint-disable filenames/match-regex */
import React from 'react';
import _ from 'lodash';
import Select from 'react-select';
import BootstrapTable from 'react-bootstrap-table-next';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { editShipmentRef, updateShipmentRef } from '../../actions/shipmentActions';
import { combineLatest } from 'rxjs';
import moment from 'moment';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {
  Row,
  Col,
  Button,
  UncontrolledPopover,
  Badge,
  Label,
  Input,
  PopoverBody,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import ShipmentInlineDate from './components/ShipmentInlineDate';
import MainDataTable from '../../component/MainDataTable';
import TableLoading from '../../component/svg/TableLoading';

import NoteShipment from './NoteShipment';
import { AlertShipment } from './AlertShipment';
import { createDataTable } from '../../utils/tool';
import {
  CreateShipmentReference,
  EditShipment,
  UpdateShipmentReference,
  GetShipmentDetail,
  GetShipmentReferenceList,
  SearchShipment,
  CombineShipmentAndShipmentReference
} from '../../service/shipment/shipment';
import { UpdateMasterData } from '../../service/masterdata/masterdata';
import { GetShipmentPin, GetShipmentTotalCount } from '../../service/personalize/personalize';
import { connect } from 'react-redux';
import { SAVE_CREDENCIAL } from '../../constants/constants';
import { GetUserCompany } from '../../service/user/user';
import BlockUi from 'react-block-ui';

const SHIPMENT_STATUS_UPDATE_OPTIONS = [
  {
    value: {
      status: 'In Transit'
    },
    label: 'In Transit'
  },
  {
    value: {
      status: 'Planning'
    },
    label: 'Planning'
  },
  {
    value: {
      status: 'Order Confirmed'
    },
    label: 'Order Confirmed'
  },
  {
    value: {
      status: 'Delayed'
    },
    label: 'Delayed'
  },
  {
    value: {
      status: 'Delivered'
    },
    label: 'Delivered'
  },
  {
    value: {
      status: 'Cancelled'
    },
    label: 'Cancelled'
  }
];

const SHIPMENT_STATUS_OPTIONS = [
  {
    value: {
      status: 'ALL'
    },
    label: 'ALL'
  },
  {
    value: {
      status: 'In Transit'
    },
    label: 'In Transit'
  },
  {
    value: {
      status: 'Planning'
    },
    label: 'Planning'
  },
  {
    value: {
      status: 'Order Confirmed'
    },
    label: 'Order Confirmed'
  },
  {
    value: {
      status: 'Delayed'
    },
    label: 'Delayed'
  },
  {
    value: {
      status: 'Delivered'
    },
    label: 'Delivered'
  },
  {
    value: {
      status: 'Cancelled'
    },
    label: 'Cancelled'
  },
  {
    value: {
      status: 'Completed'
    },
    label: 'Completed'
  }
];
const { SearchBar } = Search;

class TableShipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pinned: {},
      isEdit: false,
      input: {
        refs: [],
        newRef: {
          ShipmentReferenceID: '',
          ShipmentReferenceCompanyName: '',
          ShipmentReferenceCompanyKey: ''
        }
      },
      submiting: {},
      shipments: [],
      inlineUpdate: {},
      notification: [],
      companies: [],
      filterStatus: undefined
    };
  }

  componentDidMount() {
    this.fetchPinned();
  }

  addToPinCollection = result => {
    const { pinned } = this.state;
    const fetched = result.data();
    const data = { ...fetched, ShipmentID: result.id, PIN: true };
    const collection = { ...pinned, [result.id]: data };
    this.setState({ pinned: collection });
  };

  handleShipmentPinned = pins => {
    if (pins.length <= 0) {
      this.setState({ pinned: {} });
    } else {
      this.setState({ pinned: {} }, () => {
        pins.forEach(pinned => {
          GetShipmentDetail(pinned).subscribe({
            next: this.addToPinCollection,
            error: err => {
              console.log(err);
            },
            complete: () => {
              this.forceUpdate();
            }
          });
        });
      });
    }
  };

  handleCalendarUpdate = (date, shipmentKey, field) => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const updateObj = { ...this.state.inlineUpdate };
    if (Object.prototype.hasOwnProperty.call(updateObj, shipmentKey)) {
      if (field === 'ShipperETDDate') {
        updateObj[shipmentKey].ShipperETDDate = date;
      } else {
        updateObj[shipmentKey].ConsigneeETAPortDate = date;
      }
    } else if (field === 'ShipperETDDate') {
      updateObj[shipmentKey] = { ShipperETDDate: date };
    } else {
      updateObj[shipmentKey] = { ConsigneeETAPortDate: date };
    }

    this.setState({
      inlineUpdate: updateObj
    });
  };

  fetchPinned = () => {
    const { uid } = this.props.user;
    GetShipmentPin(uid).subscribe({
      next: res => {
        this.handleShipmentPinned(res);
      },
      error: err => {
        console.log(err);
      },
      complete: () => {
        this.forceUpdate();
      }
    });
  };

  filterShipmentStatus = (status, shipment) => {
    let filterShipment = shipment;
    if (status !== 'ALL') {
      filterShipment = shipment.filter(s => {
        if (s.ShipmentStatus !== null) {
          return s.ShipmentStatus === status;
        }
        return false;
      });
    }
    return filterShipment;
  };

  setFilterStatus = status => {
    this.setState({
      filterStatus: status
    });
  };

  editShipment() {
    this.props.toggleBlock(true);
    const updateObj = { ...this.state.inlineUpdate };
    const updateObs = [];
    Object.keys(updateObj).forEach(key => {
      updateObs.push(UpdateMasterData(key, 'DefaultTemplate', updateObj[key]));
    });

    combineLatest(updateObs).subscribe(() => {
      this.props.toggleBlock(false);
    });
    if (updateObs.length === 0) {
      this.props.toggleBlock(false);
    }
  }

  renderRefComponent(index, ref, shipmentKey, ShipmentMember) {
    const { user, companies } = this.props;
    const userCompany = [];
    let refs = [];
    refs = _.map(ref, item => item);
    const userrefs = _.filter(ref, refItem =>
      _.some(companies, item => _.includes(refItem.ShipmentReferenceCompanyKey, item.CompanyKey))
    );

    const hasCompany = _.get(ShipmentMember, `${user.uid}`, {});

    const alreadyHave = !_.isEmpty(userrefs);
    return (
      <div>
        <p id={`popover${index}`} className="text-yterminal">
          {userrefs.length > 0 ? (
            <b style={{ color: 'black' }}>{userrefs[0].ShipmentReferenceID}</b>
          ) : _.isEmpty(companies) ? (
            <TableLoading />
          ) : !_.isEmpty(hasCompany.ShipmentMemberCompanyName) ? (
            <b>Input your Ref#!</b>
          ) : (
            <b>See Refs</b>
          )}
        </p>
        <UncontrolledPopover
          trigger="legacy"
          placement="bottom"
          className="yterminalRef"
          target={`popover${index}`}
        >
          <PopoverBody>
            {!alreadyHave ? (
              <Row
                style={{
                  marginBottom: '5px'
                }}
              >
                <Col xs={1} />
                <Col xs={5} style={{ paddingTop: 5 }}>
                  <Label check>
                    {_.isEmpty(hasCompany.ShipmentMemberCompanyName)
                      ? 'Please Assign Company'
                      : hasCompany.ShipmentMemberCompanyName}
                  </Label>
                </Col>
                <Col xs={5}>
                  <Input
                    type="text"
                    name={`shipmentRefID${ref.length + 1}`}
                    id={`shipmentRefID${ref.length + 1}`}
                    disabled={_.isEmpty(hasCompany.ShipmentMemberCompanyName)}
                    value={
                      _.isEmpty(hasCompany.ShipmentMemberCompanyName)
                        ? 'N/A'
                        : this.state.input.newRef.ShipmentReferenceID
                    }
                    onChange={e => {
                      const value = e.target.value;
                      this.setState({
                        input: {
                          newRef: {
                            ...this.state.input.newRef,
                            ShipmentReferenceID: value,
                            ShipmentReferenceCompanyKey: hasCompany.ShipmentMemberCompanyKey,
                            ShipmentReferenceCompanyName: hasCompany.ShipmentMemberCompanyName,
                            ShipmentKey: shipmentKey
                          }
                        }
                      });
                    }}
                    onKeyPress={_.debounce(
                      event => {
                        if (event.key === 'Enter') {
                          if (
                            _.get(this.state.submiting, `${shipmentKey}.isSubmit`, false) === false
                          ) {
                            this.setState({
                              submiting: {
                                ...this.state.submiting,
                                [shipmentKey]: {
                                  isSubmit: true
                                }
                              }
                            });
                            CreateShipmentReference(shipmentKey, this.state.input.newRef).subscribe(
                              {
                                next: res => {
                                  this.setState({
                                    submiting: {
                                      ...this.state.submiting,
                                      [shipmentKey]: {
                                        refid: res.id,
                                        isSubmit: true
                                      }
                                    }
                                  });
                                }
                              }
                            );
                          } else if (_.get(this.state.submiting, `${shipmentKey}.refid`, 0) !== 0) {
                            UpdateShipmentReference(
                              shipmentKey,
                              _.get(this.state.submiting, `${shipmentKey}.refid`, 0),
                              this.state.input.newRef
                            );
                          }
                        }
                      },
                      2000,
                      {
                        leading: true,
                        trailing: false
                      }
                    )}
                    maxLength={50}
                    bsSize="sm"
                  />
                </Col>
              </Row>
            ) : (
              ''
            )}
            {refs.map((refItem, refIndex) => (
              <Row
                key={refIndex}
                style={{
                  marginBottom: '5px'
                }}
              >
                <Col xs={1} />
                <Col xs={5} style={{ paddingTop: 5 }}>
                  <Label check>({refItem.ShipmentReferenceCompanyName})</Label>
                </Col>
                <Col xs={5}>
                  <Input
                    type="text"
                    name={`shipmentRefID${refIndex}`}
                    id={`shipmentRefID${refIndex}`}
                    value={refItem.ShipmentReferenceIDInput}
                    onChange={e => {
                      const value = e.target.value;
                      // (ShipmentKey, refKey, Data)
                      this.props.editShipmentRef(shipmentKey, refItem.ShipmentReferenceKey, {
                        ...refItem,
                        ShipmentReferenceIDInput: value,
                        ShipmentReferenceCompanyKey: hasCompany.ShipmentMemberCompanyKey,
                        ShipmentReferenceCompanyName: hasCompany.ShipmentMemberCompanyName,
                        ShipmentKey: shipmentKey
                      });
                    }}
                    onKeyPress={event => {
                      if (event.key === 'Enter') {
                        const update = UpdateShipmentReference(
                          shipmentKey,
                          refItem.ShipmentReferenceKey,
                          {
                            ...refItem,
                            ShipmentReferenceID: refItem.ShipmentReferenceIDInput
                          }
                        ).subscribe({
                          complete: res => {
                            update.unsubscribe();
                          }
                        });
                      }
                    }}
                    maxLength={50}
                    bsSize="sm"
                    disabled={
                      hasCompany.ShipmentMemberCompanyKey !== refItem.ShipmentReferenceCompanyKey
                    }
                  />
                </Col>
              </Row>
            ))}
          </PopoverBody>
        </UncontrolledPopover>
      </div>
    );
    return <span style={{ color: '#b5b2b2', fontStyle: 'italic' }}>Please Assign company</span>;
  }

  renderStatusComponent(item) {
    return (
      <div>
        <Select
          value={_.find(
            SHIPMENT_STATUS_UPDATE_OPTIONS,
            option => option.value.status === item.ShipmentStatus
          )}
          name="colors"
          id="shipment-status-select"
          className="basic-multi-select"
          classNamePrefix="select"
          styles={{ control: styles => ({ ...styles, fontSize: '0.8vw' }) }}
          options={SHIPMENT_STATUS_UPDATE_OPTIONS}
          onChange={option => {
            EditShipment(item.ShipmentID, {
              ShipmentStatus: option.value.status
            });
          }}
        />
      </div>
    );
  }

  renderDescription(index, item) {
    return <NoteShipment key={index} item={item} id={index} />;
    // const keyword = ['Importer', 'Exporter'];
    // const canseeNote = _.some(keyword, item => _.includes(role, item));

    // return <div>{canseeNote ? <NoteShipment key={index} item={item} id={index} /> : ''}</div>;
  }

  renderAlertComponent(index, item, shipmentkey) {
    const { uid } = this.props.user;
    const notifications = _.get(this.props, `notification.${shipmentkey}`, 0);

    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {_.get(item, 'PIN') && item.PIN === true ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
              <path
                id="Path_31"
                data-name="Path 31"
                d="M-3149.048-1564.961l-3.291,3.289,3.074,3.072a.224.224,0,0,1,0,.319.223.223,0,0,1-.16.067.222.222,0,0,1-.16-.067l-3.075-3.071-3.3,3.3a.225.225,0,0,1-.16.067.216.216,0,0,1-.046-.005.225.225,0,0,1-.165-.138,5.924,5.924,0,0,1,.07-4.151l-2.883-3.385c-.062.005-.141.01-.234.01a2.444,2.444,0,0,1-1.516-.474.228.228,0,0,1-.085-.165.226.226,0,0,1,.066-.173l3.457-3.453a.235.235,0,0,1,.172-.065.226.226,0,0,1,.164.084,2.527,2.527,0,0,1,.466,1.772l3.371,2.865a5.7,5.7,0,0,1,2.2-.44,5.269,5.269,0,0,1,1.965.375.227.227,0,0,1,.139.164A.228.228,0,0,1-3149.048-1564.961Z"
                transform="translate(3160.981 1569.988)"
                fill="#6a6a6a"
                opacity="0.91"
              />
            </svg>
          ) : null}
          {notifications > 0 ? (
            <Badge color="danger" pill style={{ marginBottom: -15 }}>
              {notifications}
            </Badge>
          ) : null}
        </div>
        <div className="showdot">
          <div className="showthatdot">
            <AlertShipment
              key={index}
              item={item}
              id={index}
              profileKey={uid}
              fetchPinned={this.fetchPinned}
            />
          </div>
        </div>
      </div>
    );
  }

  renderCompanyAndPort(company, port) {
    return (
      <React.Fragment>
        <Row style={{ margin: 'auto' }}>
          {company === undefined || company === '' ? (
            <span style={{ color: 'rgb(181, 178, 178)', fontStyle: 'italic' }}>
              Company Unassigned
            </span>
          ) : (
            company
          )}
        </Row>
        <Row style={{ margin: 'auto', fontSize: '0.8em' }}>
          {port === undefined || port === '' ? '' : <b>{port}</b>}
        </Row>
      </React.Fragment>
    );
  }

  render = () => {
    const shipmentsProps = this.props;

    const { setShipments, filterKeyword, keyword } = this.props;
    let data = [];
    let columns = [];
    let input = [];
    if (_.size(this.props.input) === 0) {
      columns = [
        {
          text: 'id',
          dataField: 'id',
          sort: true,
          hidden: true
        },
        {
          text: '',
          dataField: 'alert',
          sort: false,
          style: { width: '5%' },
          headerAlign: 'center',
          headerStyle: { width: '5%' },
          classes: 'alert-column'
        },
        {
          text: 'Ref',
          dataField: 'Ref',
          sort: false,
          style: { width: '12%' },
          headerAlign: 'left',
          align: 'left',
          headerStyle: { width: '12%' }
        },
        {
          text: 'Seller',
          dataField: 'Seller',
          headerAlign: 'left',
          align: 'left',
          sort: true
        },
        {
          text: 'Buyer',
          dataField: 'Buyer',
          headerAlign: 'left',
          align: 'left',
          sort: true
        },
        {
          text: 'Product',
          dataField: 'Product',
          sort: false,
          style: { width: '15%' },
          headerAlign: 'center',
          align: 'center',
          headerStyle: { width: '15%' }
        },
        {
          text: 'ETD',
          dataField: 'ETD',
          sort: true,
          headerAlign: 'center',
          align: 'center',
          width: '15%'
        },
        {
          text: 'ETA',
          dataField: 'ETA',
          sort: true,
          headerAlign: 'center',
          align: 'center',
          width: '15%'
        },
        {
          text: '',
          dataField: '',
          sort: false,
          style: { width: '2.5%' },
          headerAlign: 'center',
          headerStyle: { width: '2.5%' }
        },
        {
          text: 'Status',
          dataField: 'Status',
          style: { width: '15%' },
          headerAlign: 'center',
          align: 'center',
          headerStyle: { width: '15%' }
        },
        {
          text: 'uid',
          dataField: 'uid',
          sort: true,
          hidden: true
        },
        {
          text: 'ShipmentMember',
          dataField: 'ShipmentMember',
          sort: true,
          hidden: true
        }
      ];
      return (
        <ToolkitProvider keyField="id" data={data} columns={columns} search>
          {props => (
            <div>
              <Row>
                <Col xs="4">{shipmentsProps.searchInput()}</Col>
                <Col xs="3">
                  <Select
                    name="colors"
                    id="role-filter"
                    className="basic-multi-select role-filter-select"
                    classNamePrefix="select"
                    placeholder="Filter Status"
                    styles={{ control: styles => ({ ...styles, width: '250px' }) }}
                    options={SHIPMENT_STATUS_OPTIONS}
                    onChange={event => this.setFilterStatus(event.value.status)}
                  />{' '}
                </Col>
                <Col xs="3" />
                <Col
                  xs="2"
                  style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}
                >
                  {this.state.isEdit ? (
                    <Button
                      hidden
                      style={{ backgroundColor: '#16A085', marginTop: 2, marginRight: 15 }}
                      onClick={() => {
                        this.editShipment();
                        this.setState({
                          isEdit: false
                        });
                      }}
                    >
                      <span style={{ fontWeight: 'bold', color: 'white' }}>Save</span>
                    </Button>
                  ) : (
                    <Button
                      hidden
                      style={{ backgroundColor: 'white', marginTop: 2, marginRight: 15 }}
                      onClick={() => {
                        this.setState({
                          isEdit: true
                        });
                      }}
                    >
                      <i className="icons cui-pencil" style={{ color: 'black' }} />
                      <span style={{ fontWeight: 'bold', color: '#707070' }}>Edit</span>
                    </Button>
                  )}
                </Col>
              </Row>
              <div
                className="table"
                onScroll={e => {
                  const obj = e.target;
                  const isTrigger = obj.scrollTop === obj.scrollHeight - obj.offsetHeight;
                  if (isTrigger) {
                    this.props.fetchMoreShipment();
                  }
                }}
              >
                <MainDataTable
                  id="tableshipment"
                  data={data}
                  toolkitbaseProps={{ ...props.baseProps }}
                  filter={this.filterShipmentStatus}
                  filterKeyword={this.state.filterStatus}
                  isFilter={this.state.filterStatus !== undefined}
                  column={columns}
                  cssClass="shipment-table"
                  wraperClass="shipment-table-wraper"
                  isBorder={false}
                  toolkit="search"
                  rowEvents={rowEvents}
                />
              </div>
            </div>
          )}
        </ToolkitProvider>
      );
    }
    // _.orderBy(myArr, [columnName], ['asc'])
    const filtered = _.map(this.props.input, shipment => {
      let output = {
        ...shipment,
        PIN: false
      };
      _.forEach(this.state.pinned, pin => {
        if (pin.ShipmentID === shipment.ShipmentID) {
          output = {
            ...shipment,
            PIN: true
          };
        }
      });
      return output;
    });
    let collection = _.orderBy(filtered, ['PIN'], ['desc']);
    collection = _.map(collection, item => {
      const notifications = _.get(this.props, `notification.${item.ShipmentID}`, 0);
      return {
        notifications,
        ...item
      };
    });
    collection = _.orderBy(collection, ['PIN', 'notifications'], ['desc', 'desc']);

    input = _.map(collection, (item, index) => {
      const etd = _.get(item, 'ShipperETDDate', 0);
      const eta = _.get(item, 'ConsigneeETAPortDate', 0);

      if (this.state.isEdit) {
        return {
          id: index,
          alert: this.renderAlertComponent(index, item, item.ShipmentID),

          Ref: this.renderRefComponent(
            index,
            item.ShipmentReferenceList,
            item.ShipmentID,
            item.ShipmentMember
          ),
          // Seller: _.get(item, 'ShipmentSellerCompanyName', ''),
          // Buyer: _.get(item, 'ShipmentBuyerCompanyName', ''),
          Seller: this.renderCompanyAndPort(
            _.get(item, 'ShipmentSellerCompanyName', undefined),
            _.get(item, 'ShipperPort', undefined)
          ),
          Buyer: this.renderCompanyAndPort(
            _.get(item, 'ShipmentBuyerCompanyName', undefined),
            _.get(item, 'ConsigneePort', undefined)
          ),
          Product: _.get(item, 'ShipmentProductName', ''),
          ETD: (
            <ShipmentInlineDate
              initialValue={etd === null || etd === '' ? null : new Date(etd.seconds * 1000)}
              id="etd-port"
              shipmentKey={item.ShipmentID}
              field="ShipperETDDate"
              updateHandle={this.handleCalendarUpdate}
            />
          ),
          ETA: (
            <ShipmentInlineDate
              initialValue={eta === null || eta === '' ? null : new Date(eta.seconds * 1000)}
              id="eta-port"
              shipmentKey={item.ShipmentID}
              field="ConsigneeETAPortDate"
              updateHandle={this.handleCalendarUpdate}
            />
          ),
          '': this.renderDescription(index, item),
          Status: this.renderStatusComponent(item),
          ShipmentStatus: item.ShipmentStatus,
          uid: item.ShipmentID
        };
      }
      return {
        id: index,
        alert: this.renderAlertComponent(index, item, item.ShipmentID),
        ShipmentReferenceList: _.join(
          _.map(item.ShipmentReferenceList, 'ShipmentReferenceID'),
          ','
        ),
        Ref: this.renderRefComponent(
          index,
          item.ShipmentReferenceList,
          item.ShipmentID,
          item.ShipmentMember
        ),
        Seller: this.renderCompanyAndPort(
          _.get(item, 'ShipmentSellerCompanyName', undefined),
          _.get(item, 'ShipperPort', undefined)
        ),
        Buyer: this.renderCompanyAndPort(
          _.get(item, 'ShipmentBuyerCompanyName', undefined),
          _.get(item, 'ConsigneePort', undefined)
        ),
        Product: _.get(item, 'ShipmentProductName', ''),
        ETD:
          etd === null || etd === ''
            ? 'Not Available'
            : moment(etd.seconds * 1000).format('DD MMM YYYY'),
        ETA:
          eta === null || eta === ''
            ? 'Not Available'
            : moment(eta.seconds * 1000).format('DD MMM YYYY'),
        '': this.renderDescription(index, item),
        Status: this.renderStatusComponent(item),
        ShipmentStatus: item.ShipmentStatus,
        uid: item.ShipmentID,
        ShipmentMember: item.ShipmentMember
      };
    });
    if (_.includes(filterKeyword, 'ShipmentReferenceList')) {
      input = _.filter(input, item =>
        _.includes(_.get(item, `${filterKeyword}`, 'ShipmentProductName'), keyword)
      );
    }

    if (_.size(input) === 0) {
      columns = [
        {
          text: 'id',
          dataField: 'id',
          sort: true,
          hidden: true
        },
        {
          text: '',
          dataField: 'alert',
          sort: false,
          style: { width: '5%' },
          headerAlign: 'center',
          headerStyle: { width: '5%' },
          classes: 'alert-column'
        },
        {
          text: 'Ref',
          dataField: 'Ref',
          sort: false,
          style: { width: '12%' },
          headerAlign: 'left',
          align: 'left',
          headerStyle: { width: '12%' }
        },
        {
          text: 'Seller',
          dataField: 'Seller',
          headerAlign: 'left',
          align: 'left',
          sort: true
        },
        {
          text: 'Buyer',
          dataField: 'Buyer',
          headerAlign: 'left',
          align: 'left',
          sort: true
        },
        {
          text: 'Product',
          dataField: 'Product',
          sort: false,
          style: { width: '15%' },
          headerAlign: 'center',
          align: 'center',
          headerStyle: { width: '15%' }
        },
        {
          text: 'ETD',
          dataField: 'ETD',
          sort: true,
          headerAlign: 'center',
          align: 'center',
          width: '15%'
        },
        {
          text: 'ETA',
          dataField: 'ETA',
          sort: true,
          headerAlign: 'center',
          align: 'center',
          width: '15%'
        },
        {
          text: '',
          dataField: '',
          sort: false,
          style: { width: '2.5%' },
          headerAlign: 'center',
          headerStyle: { width: '2.5%' }
        },
        {
          text: 'Status',
          dataField: 'Status',
          style: { width: '15%' },
          headerAlign: 'center',
          align: 'center',
          headerStyle: { width: '15%' }
        },
        {
          text: 'uid',
          dataField: 'uid',
          sort: true,
          hidden: true
        },
        {
          text: 'ShipmentMember',
          dataField: 'ShipmentMember',
          sort: true,
          hidden: true
        }
      ];
      return (
        <ToolkitProvider keyField="id" data={data} columns={columns} search>
          {props => (
            <div>
              <Row>
                <Col xs="4">{shipmentsProps.searchInput()}</Col>
                <Col xs="3">
                  <Select
                    name="colors"
                    id="role-filter"
                    className="basic-multi-select role-filter-select"
                    classNamePrefix="select"
                    placeholder="Filter Status"
                    styles={{ control: styles => ({ ...styles, width: '250px' }) }}
                    options={SHIPMENT_STATUS_OPTIONS}
                    onChange={event => this.setFilterStatus(event.value.status)}
                  />{' '}
                </Col>
                <Col xs="3" />
                <Col
                  xs="2"
                  style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}
                >
                  {this.state.isEdit ? (
                    <Button
                      hidden
                      style={{ backgroundColor: '#16A085', marginTop: 2, marginRight: 15 }}
                      onClick={() => {
                        this.editShipment();
                        this.setState({
                          isEdit: false
                        });
                      }}
                    >
                      <span style={{ fontWeight: 'bold', color: 'white' }}>Save</span>
                    </Button>
                  ) : (
                    <Button
                      hidden
                      style={{ backgroundColor: 'white', marginTop: 2, marginRight: 15 }}
                      onClick={() => {
                        this.setState({
                          isEdit: true
                        });
                      }}
                    >
                      <i className="icons cui-pencil" style={{ color: 'black' }} />
                      <span style={{ fontWeight: 'bold', color: '#707070' }}>Edit</span>
                    </Button>
                  )}
                </Col>
              </Row>
              <div
                className="table"
                onScroll={e => {
                  const obj = e.target;
                  const isTrigger = obj.scrollTop === obj.scrollHeight - obj.offsetHeight;
                  if (isTrigger) {
                    this.props.fetchMoreShipment();
                  }
                }}
              >
                <MainDataTable
                  id="tableshipment"
                  data={data}
                  toolkitbaseProps={{ ...props.baseProps }}
                  filter={this.filterShipmentStatus}
                  filterKeyword={this.state.filterStatus}
                  isFilter={this.state.filterStatus !== undefined}
                  column={columns}
                  cssClass="shipment-table"
                  wraperClass="shipment-table-wraper"
                  isBorder={false}
                  toolkit="search"
                  rowEvents={rowEvents}
                />
              </div>
            </div>
          )}
        </ToolkitProvider>
      );
    }

    input = createDataTable(input);
    data = input.data;
    columns = input.columns;

    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      hideSelectColumn: true,
      bgColor: '#F5FBFA'
    };
    const pageListRenderer = ({ pages, onPageChange }) => {
      const pageWithoutIndication = pages.filter(p => typeof p.page !== 'string');
      return (
        <div>
          <span>Page </span>
          {pageWithoutIndication.map(p => (
            <Button outline color="secondary" onClick={() => onPageChange(p.page)}>
              {p.page}
            </Button>
          ))}
        </div>
      );
    };
    const sizePerPageRenderer = ({ options, currSizePerPage, onSizePerPageChange }) => (
      <div className="btn-group" role="group">
        {options.map(option => {
          const isSelect = currSizePerPage === `${option.page}`;
          return (
            <button
              key={option.text}
              type="button"
              onClick={() => onSizePerPageChange(option.page)}
              className={`btn ${isSelect ? 'btn btn-light' : 'btn btn-dark'}`}
            >
              {option.text}
            </button>
          );
        })}
      </div>
    );
    const options = {
      pageListRenderer,
      sizePerPageRenderer
    };

    const rowEvents = {
      onClick: (e, row, rowIndex) => {
        console.log('clicked role is', e.target.tagName);
        if (
          e.target.tagName !== 'SELECT' &&
          e.target.tagName !== 'I' &&
          e.target.tagName !== 'DIV' &&
          e.target.tagName !== 'INPUT' &&
          e.target.tagName !== 'P' &&
          e.target.tagName !== 'BUTTON' &&
          e.target.tagName !== 'path' &&
          e.target.tagName !== 'svg' &&
          e.target.tagName !== 'B'
        ) {
          window.location.href = `#/chat/${row.uid}`;
        }
      }
    };
    const defaultSorted = [
      {
        dataField: 'id',
        order: 'desc'
      }
    ];
    return (
      <ToolkitProvider keyField="id" data={data} columns={columns} search>
        {props => (
          <div>
            <Row>
              <Col xs="4">{shipmentsProps.searchInput()}</Col>
              <Col xs="3">
                <Select
                  name="colors"
                  id="role-filter"
                  className="basic-multi-select role-filter-select"
                  classNamePrefix="select"
                  placeholder="Filter Status"
                  styles={{ control: styles => ({ ...styles, width: '250px' }) }}
                  options={SHIPMENT_STATUS_OPTIONS}
                  onChange={event => this.setFilterStatus(event.value.status)}
                />{' '}
              </Col>
              <Col xs="3" />
              <Col xs="2" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                {this.state.isEdit ? (
                  <Button
                    hidden
                    style={{ backgroundColor: '#16A085', marginTop: 2, marginRight: 15 }}
                    onClick={() => {
                      this.editShipment();
                      this.setState({
                        isEdit: false
                      });
                    }}
                  >
                    <span style={{ fontWeight: 'bold', color: 'white' }}>Save</span>
                  </Button>
                ) : (
                  <Button
                    hidden
                    style={{ backgroundColor: 'white', marginTop: 2, marginRight: 15 }}
                    onClick={() => {
                      this.setState({
                        isEdit: true
                      });
                    }}
                  >
                    <i className="icons cui-pencil" style={{ color: 'black' }} />
                    <span style={{ fontWeight: 'bold', color: '#707070' }}>Edit</span>
                  </Button>
                )}
              </Col>
            </Row>
            <div
              className="table"
              onScroll={e => {
                const obj = e.target;
                const isTrigger = obj.scrollTop === obj.scrollHeight - obj.offsetHeight;
                if (isTrigger) {
                  this.props.fetchMoreShipment();
                }
              }}
            >
              <BlockUi tag="div" blocking={this.props.blocking} style={{ height: '100%' }}>
                <MainDataTable
                  id="tableshipment"
                  data={data}
                  toolkitbaseProps={{ ...props.baseProps }}
                  filter={this.filterShipmentStatus}
                  filterKeyword={this.state.filterStatus}
                  isFilter={this.state.filterStatus !== undefined}
                  column={columns}
                  cssClass="shipment-table"
                  wraperClass="shipment-table-wraper"
                  isBorder={false}
                  toolkit="search"
                  defaultSort={defaultSorted}
                  rowEvents={rowEvents}
                />
              </BlockUi>
            </div>
          </div>
        )}
      </ToolkitProvider>
    );
  };
}

const mapStateToProps = state => {
  const { profileReducer, companyReducer } = state;

  const sender = _.find(
    profileReducer.ProfileList,
    item => item.id === profileReducer.ProfileDetail.id
  );

  return {
    ...state.authReducer,
    refs: state.shipmentReducer.ShipmentRefs,
    sender,
    notification: state.shipmentReducer.notification
  };
};

export default connect(
  mapStateToProps,
  {
    editShipmentRef,
    updateShipmentRef
  }
)(TableShipment);
