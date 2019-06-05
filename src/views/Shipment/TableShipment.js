/* eslint-disable prefer-destructuring */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/order */
/* eslint-disable filenames/match-regex */
import React from 'react';
import './Shipment.css';

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

import { NoteShipment } from './NoteShipment';
import { AlertShipment } from './AlertShipment';
import { createDataTable } from '../../utils/tool';
import {
  CreateShipmentReference,
  EditShipment,
  UpdateShipmentReference,
  GetShipmentDetail,
  GetShipmentReferenceList
} from '../../service/shipment/shipment';
import { UpdateMasterData } from '../../service/masterdata/masterdata';
import { GetShipmentPin, GetShipmentTotalCount } from '../../service/personalize/personalize';
import { connect } from 'react-redux';
import { SAVE_CREDENCIAL } from '../../constants/constants';
import { GetUserCompany } from '../../service/user/user';

const SHIPMENT_STATUS_OPTIONS = [
  {
    value: {
      status: 'In Transit'
    },
    label: 'In Transit'
  },
  {
    value: {
      role: 'Order'
    },
    label: 'Order'
  },
  {
    value: {
      role: 'Delayed'
    },
    label: 'Delayed'
  },
  {
    value: {
      role: 'Cancelled'
    },
    label: 'Cancelled'
  },
  {
    value: {
      role: 'Deliverd'
    },
    label: 'Deliverd'
  }
];
const { SearchBar } = Search;

class TableShipment extends React.Component {
  data = {
    products: [
      {
        ref: 'INVPT',
        seller: 'ExportA',
        buyer: 'ExportB',
        product: 'coconut',
        etd: 'date',
        eta: 'date',
        status: ['intransit', 'planning']
      },
      {
        ref: 'INVPT',
        seller: 'ExportA',
        buyer: 'ExportB',
        product: 'coconut',
        etd: 'date',
        eta: 'date',
        status: ['intransit', 'planning']
      },
      {
        ref: 'INVPT',
        seller: 'ExportA',
        buyer: 'ExportC',
        product: 'coconut',
        etd: 'date',
        eta: 'date',
        status: ['intransit', 'planning']
      },
      {
        ref: 'INVPT',
        seller: 'ExportA',
        buyer: 'ExportC',
        product: 'coconut',
        etd: 'date',
        eta: 'date',
        status: ['intransit', 'planning']
      },
      {
        ref: 'INVPT',
        seller: 'ExportA',
        buyer: 'ExportC',
        product: 'coconut',
        etd: 'date',
        eta: 'date',
        status: ['intransit', 'planning']
      },
      {
        ref: 'INVPT',
        seller: 'ExportA',
        buyer: 'ExportC',
        product: 'coconut',
        etd: 'date',
        eta: 'date',
        status: ['intransit', 'planning']
      }
    ],
    columns: [
      {
        dataField: 'ref',
        text: 'Ref:'
      },
      {
        dataField: 'seller',
        text: 'Seller',
        sort: true
      },
      {
        dataField: 'buyer',
        text: 'Buyer',
        sort: true
      },
      {
        dataField: 'product',
        text: 'Product'
      },
      {
        dataField: 'etd',
        text: 'ETD',
        sort: true
      },
      {
        dataField: 'eta',
        text: 'ETA',
        sort: true
      },
      {
        dataField: 'status',
        text: 'Status'
      }
    ]
  };

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
      companies: []
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
        console.log('Updated');
        this.forceUpdate();
      }
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
      this.props.fetchShipments();
      this.props.toggleBlock(false);
    });
    if (updateObs.length === 0) {
      this.props.toggleBlock(false);
    }
  }

  renderRefComponent(index, ref, shipmentKey, ShipmentMember) {
    const { user, companies } = this.props;
    let refs = [];
    console.log('this shipments ref', ref);
    _.forEach(companies, item => {
      _.forEach(ref, refitem => {
        if (shipmentKey === '5MvYnwSeAhtlA5EfqUaJ') {
          console.log(
            'isSameKey',
            shipmentKey,
            item.CompanyKey,
            refitem.ShipmentReferenceCompanyKey
          );
        }

        if (item.CompanyKey === refitem.ShipmentReferenceCompanyKey) {
          refs.push(refitem);
        }
      });
    });
    const hasCompany = _.get(ShipmentMember, `${user.uid}`, {});
    let alreadyHave = refs.length > 0;
    if (!_.isEmpty(hasCompany.ShipmentMemberCompanyName)) {
      return (
        <div>
          <p id={`popover${index}`} className="text-yterminal">
            {refs.length > 0 ? refs[0].ShipmentReferenceID : 'Input your Ref#!'}
          </p>
          <UncontrolledPopover
            trigger="legacy"
            placement="bottom"
            className="yterminalRef"
            target={`popover${index}`}
          >
            <PopoverBody>
              {refs.map((refItem, refIndex) => {
                return (
                  <Row>
                    <Col xs={1} />
                    <Col xs={5} style={{ paddingTop: 5 }}>
                      <Label check>
                        <Input
                          style={{ paddingTop: 5 }}
                          type="radio"
                          name={`shipmentRef${refIndex}`}
                          value={refItem.ShipmentReferenceKey}
                        />
                        Ref #{refIndex + 1}: ({refItem.ShipmentReferenceCompanyName})
                      </Label>
                    </Col>
                    <Col xs={5}>
                      <Input
                        type="text"
                        name={`shipmentRefID${refIndex}`}
                        id={`shipmentRefID${refIndex}`}
                        value={refItem.ShipmentReferenceID}
                        onChange={e => {
                          const value = e.target.value;
                          // (ShipmentKey, refKey, Data)
                          this.props.editShipmentRef(shipmentKey, refItem.ShipmentReferenceKey, {
                            ...refItem,
                            ShipmentReferenceID: value,
                            ShipmentReferenceCompanyKey: hasCompany.ShipmentMemberCompanyKey,
                            ShipmentReferenceCompanyName: hasCompany.ShipmentMemberCompanyName
                          });
                        }}
                        onKeyPress={event => {
                          if (event.key === 'Enter') {
                            let update = UpdateShipmentReference(
                              shipmentKey,
                              refItem.ShipmentReferenceKey,
                              refItem
                            ).subscribe({
                              complete: res => {
                                console.log(res);
                                update.unsubscribe();
                              }
                            });
                          }
                        }}
                        maxLength={50}
                        bsSize="sm"
                        disabled={
                          hasCompany.ShipmentMemberCompanyKey !==
                          refItem.ShipmentReferenceCompanyKey
                        }
                      />
                    </Col>
                  </Row>
                );
              })}
              {!alreadyHave ? (
                <Row>
                  <Col xs={1} />
                  <Col xs={5} style={{ paddingTop: 5 }}>
                    <Label check>
                      <Input
                        style={{ paddingTop: 5 }}
                        type="radio"
                        name={`shipmentRef${ref.length}`}
                        value
                      />
                      Ref #{refs.length + 1}: {hasCompany.ShipmentMemberCompanyName}
                    </Label>
                  </Col>
                  <Col xs={5}>
                    <Input
                      type="text"
                      name={`shipmentRefID${ref.length + 1}`}
                      id={`shipmentRefID${ref.length + 1}`}
                      value={this.state.input.newRef.ShipmentReferenceID}
                      onChange={e => {
                        const value = e.target.value;
                        this.setState({
                          input: {
                            newRef: {
                              ...this.state.input.newRef,
                              ShipmentReferenceID: value,
                              ShipmentReferenceCompanyKey: hasCompany.ShipmentMemberCompanyKey,
                              ShipmentReferenceCompanyName: hasCompany.ShipmentMemberCompanyName
                            }
                          }
                        });
                      }}
                      onKeyPress={_.debounce(
                        event => {
                          if (event.key === 'Enter') {
                            console.log('is Submitting ', this.state.submiting);

                            if (
                              _.get(this.state.submiting, `${shipmentKey}.isSubmit`, false) ===
                              false
                            ) {
                              this.setState({
                                submiting: {
                                  ...this.state.submiting,
                                  [shipmentKey]: {
                                    isSubmit: true
                                  }
                                }
                              });
                              CreateShipmentReference(
                                shipmentKey,
                                this.state.input.newRef
                              ).subscribe({
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
                              });
                            } else {
                              console.log('update', this.state.input.newRef);
                              if (_.get(this.state.submiting, `${shipmentKey}.refid`, 0) !== 0) {
                                UpdateShipmentReference(
                                  shipmentKey,
                                  _.get(this.state.submiting, `${shipmentKey}.refid`, 0),
                                  this.state.input.newRef
                                );
                              }
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
            </PopoverBody>
          </UncontrolledPopover>
        </div>
      );
    }
    return <span style={{ color: '#b5b2b2', fontStyle: 'italic' }}>Please Assign company</span>;
  }

  renderStatusComponent(item) {
    return (
      <div>
        <Input
          type="select"
          value={item.ShipmentStatus}
          onChange={e => {
            const value = e.target.value;
            EditShipment(item.ShipmentID, {
              ShipmentStatus: value
            });
          }}
        >
          <option value="Planning">Planning</option>
          <option value="Order Confirmed">Order Confirmed</option>
          <option value="In-Transit">In-Transit</option>
          <option value="Delayed">Delayed</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </Input>
      </div>
    );
  }

  renderDescription(index, item) {
    return (
      <div>
        <NoteShipment key={index} item={item} id={index} />
      </div>
    );
  }

  renderAlertComponent(index, item, shipmentkey) {
    const { uid } = this.props.user;
    const notifications = _.get(this.props, `notification.${shipmentkey}`, 0);

    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {_.get(item, 'PIN') && item.PIN === true ? (
            <i className="fa fa-map-pin" style={{ marginBottom: 5, opacity: 0.8 }} />
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

  render() {
    let data = [];
    let columns = [];
    let input = [];
    console.log(_.size(this.props.input));
    console.log('Props', this.props);
    if (_.size(this.props.input) === 0) {
      return '';
    }
    // _.orderBy(myArr, [columnName], ['asc'])
    console.log('Pin', this.state.pinned);

    let filtered = _.map(this.props.input, shipment => {
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
    console.log('collection', collection);
    input = _.map(collection, (item, index) => {
      const etd = _.get(item, 'ShipperETDDate', 0);
      const eta = _.get(item, 'ConsigneeETAPortDate', 0);

      if (this.state.isEdit) {
        return {
          alert: this.renderAlertComponent(index, item, item.ShipmentID),
          Ref: this.renderRefComponent(
            index,
            item.ShipmentReferenceList,
            item.ShipmentID,
            item.ShipmentMember
          ),
          Seller: _.get(item, 'ShipmentSellerCompanyName', ''),
          Buyer: _.get(item, 'ShipmentBuyerCompanyName', ''),
          Product: _.get(item, 'ShipmentProductName', ''),
          ETD: (
            <ShipmentInlineDate
              initialValue={etd === null ? null : new Date(etd.seconds * 1000)}
              id="etd-port"
              shipmentKey={item.ShipmentID}
              field="ShipperETDDate"
              updateHandle={this.handleCalendarUpdate}
            />
          ),
          ETA: (
            <ShipmentInlineDate
              initialValue={etd === null ? null : new Date(eta.seconds * 1000)}
              id="eta-port"
              shipmentKey={item.ShipmentID}
              field="ConsigneeETAPortDate"
              updateHandle={this.handleCalendarUpdate}
            />
          ),
          '': this.renderDescription(index, item),
          Status: this.renderStatusComponent(item),
          uid: item.ShipmentID
        };
      }
      return {
        alert: this.renderAlertComponent(index, item, item.ShipmentID),
        Ref: this.renderRefComponent(
          index,
          _.get(item, 'ShipmentReferenceList', {}),
          item.ShipmentID,

          item.ShipmentMember
        ),
        Seller: _.get(item, 'ShipmentSellerCompanyName', ''),
        Buyer: _.get(item, 'ShipmentBuyerCompanyName', ''),
        Product: _.get(item, 'ShipmentProductName', ''),
        ETD: etd === null ? 'Not Available' : moment(etd.seconds * 1000).format('DD MMM YYYY'),
        ETA: eta === null ? 'Not Available' : moment(eta.seconds * 1000).format('DD MMM YYYY'),
        '': this.renderDescription(index, item),
        Status: this.renderStatusComponent(item),
        uid: item.ShipmentID,
        ShipmentMember: item.ShipmentMember
      };
    });
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
    const MySearch = props => {
      let input;
      const handleClick = event => {
        const query = event.target.value;
        props.onSearch(query);
      };
      return (
        <div>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText style={{ backgroundColor: 'white' }}>
                <i className="fa fa-filter" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              className="form-control"
              id="statusSelect"
              ref={n => (input = n)}
              name="select"
              type="select"
              style={{ width: 170 }}
              onChange={handleClick}
            >
              <option>Intransit</option>
              <option>Order</option>
              <option>Delayed</option>
              <option>Cancelled</option>
              <option>Delivered</option>
            </Input>
          </InputGroup>
        </div>
      );
    };
    const rowEvents = {
      onClick: (e, row, rowIndex) => {
        if (
          e.target.tagName !== 'SELECT' &&
          e.target.tagName !== 'I' &&
          e.target.tagName !== 'DIV' &&
          e.target.tagName !== 'INPUT' &&
          e.target.tagName !== 'P'
        ) {
          window.location.href = `#/chat/${row.uid}`;
        }
      }
    };
    return (
      <ToolkitProvider keyField="id" data={data} columns={columns} search>
        {props => (
          <div>
            <Row>
              <Col xs="2">
                <SearchBar
                  {...props.searchProps}
                  placeholder="&#xF002; Typing"
                  id="search"
                  style={{ width: 200, height: 38 }}
                />
              </Col>
              <Col xs="3">
                <Select
                  name="colors"
                  id="role-filter"
                  className="basic-multi-select role-filter-select"
                  classNamePrefix="select"
                  placeholder="Filter Status"
                  styles={{ control: styles => ({ ...styles, width: '250px' }) }}
                  options={SHIPMENT_STATUS_OPTIONS}
                  onChange={null}
                />{' '}
              </Col>
              <Col xs="5" />
              <Col xs="2" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                {this.state.isEdit ? (
                  <Button
                    style={{ backgroundColor: '#16A085', marginTop: 2, marginRight: 10 }}
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
                    style={{ backgroundColor: 'white', marginTop: 2, marginRight: 10 }}
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
              <BootstrapTable
                id="tableshipment"
                {...props.baseProps}
                bordered={false}
                rowEvents={rowEvents}
                columns={columns}
                wrapperClasses="shipment-table-wraper"
                classes="shipment-table"
              />
            </div>
          </div>
        )}
      </ToolkitProvider>
    );
  }
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
