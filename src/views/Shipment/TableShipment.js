/* eslint-disable class-methods-use-this */
/* eslint-disable import/order */
/* eslint-disable filenames/match-regex */
import React from 'react';
import './Shipment.css';

import _ from 'lodash';
import BootstrapTable from 'react-bootstrap-table-next';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { editShipmentRef, fetchMoreShipments } from '../../actions/shipmentActions';

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

import { NoteShipment } from './NoteShipment';
import { AlertShipment } from './AlertShipment';
import { createDataTable } from '../../utils/tool';
import {
  CreateShipmentReference,
  EditShipment,
  UpdateShipmentReference
} from '../../service/shipment/shipment';
import { connect } from 'react-redux';

const { SearchBar } = Search;

class TableShipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: {
        refs: [],
        newRef: {
          ShipmentReferenceID: '',
          ShipmentReferenceCompanyName: '',
          ShipmentReferenceCompanyKey: ''
        }
      }
    };
  }

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

  componentDidMount() {
    const table = document.getElementById('tableshipment');
    table.setAttribute('onScroll', e => {
      console.log(e);
    });
  }

  renderRefComponent(index, ref, shipmentKey) {
    const {
      input: { refs }
    } = this.state;
    const user = this.props.user;
    const userref = _.get(this.state, `input.refs.${user.uid}`, {
      ShipmentReferenceKey: user.uid,
      ShipmentReferenceID: '',
      ShipmentReferenceCompanyName: '',
      ShipmentReferenceCompanyKey: ''
    });

    let alreadyHave = false;
    return (
      <div>
        <p id={`popover${index}`} className="text-yterminal">
          {ref.length > 0
            ? _.get(this.props, `refs.${shipmentKey}.${ref[0].id}`, {}).ShipmentReferenceID
            : 'Input your Ref#!'}
        </p>
        <UncontrolledPopover
          trigger="legacy"
          placement="bottom"
          className="yterminalRef"
          target={`popover${index}`}
        >
          <PopoverBody>
            {ref.map((ref, refIndex) => {
              const item = _.get(this.props, `refs.${shipmentKey}.${ref.id}`, {});
              if (user.uid === item.ShipmentReferenceCompanyKey) {
                alreadyHave = true;
              }
              const refItem = item;
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
                      Ref #{refIndex + 1} : ({refItem.ShipmentReferenceCompanyName})
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
                        console.log('input data is ', value);
                        this.props.editShipmentRef(shipmentKey, item.ShipmentReferenceKey, {
                          ...item,
                          ShipmentReferenceID: value,
                          ShipmentReferenceCompanyKey: refItem.ShipmentReferenceCompanyKey,
                          ShipmentReferenceCompanyName: refItem.ShipmentReferenceCompanyName
                        });
                      }}
                      onKeyPress={event => {
                        if (event.key === 'Enter') {
                          console.log('Update Ref for ', shipmentKey, item);
                          UpdateShipmentReference(shipmentKey, item.ShipmentReferenceKey, item);
                        }
                      }}
                      maxLength={50}
                      bsSize="sm"
                      disabled={user.uid !== refItem.ShipmentReferenceCompanyKey}
                    />
                  </Col>
                </Row>
              );
            })}

            {alreadyHave === false ? (
              <Row>
                <Col xs={1} />
                <Col xs={5} style={{ paddingTop: 5 }}>
                  <Label check>
                    <Input
                      style={{ paddingTop: 5 }}
                      type="radio"
                      name={`shipmentRef${ref.length}`}
                      value={true}
                    />
                    Ref #{ref.length + 1} : Exporter
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
                      console.log('input data is ', value);
                      this.setState({
                        input: {
                          newRef: {
                            ...this.state.input.newRef,
                            ShipmentReferenceID: value,
                            ShipmentReferenceCompanyKey: user.uid,
                            ShipmentReferenceCompanyName: user.email
                          }
                        }
                      });
                    }}
                    onKeyPress={event => {
                      if (event.key === 'Enter') {
                        console.log('Create Ref for ', shipmentKey, this.state.input.newRef);
                        CreateShipmentReference(shipmentKey, this.state.input.newRef);
                      }
                    }}
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

  renderAlertComponent(index, item) {
    return (
      <div>
        {item.seen ? (
          <Badge color="danger" pill style={{ marginBottom: -15 }}>
            2
          </Badge>
        ) : null}
        <div className="showdot">
          <div className="showthatdot">
            <AlertShipment key={index} item={item} id={index} />
          </div>
        </div>
      </div>
    );
  }

  render() {
    let data = [];
    let columns = [];

    let input = [];
    if (this.props.input.length === 0) {
      input = this.data;
      data = input.products;
      columns = input.columns;
    } else {
      input = _.map(this.props.input, (item, index) => {
        const etd = _.get(item, 'ShipmentETD', 0);
        const eta = _.get(item, 'ShipmentETAPort', 0);
        return {
          alert: this.renderAlertComponent(index, item),
          Ref: this.renderRefComponent(
            index,
            _.get(item, 'ShipmentReferenceList', []),
            item.ShipmentID
          ),
          Seller: _.get(item, 'ShipmentSellerCompanyName', ''),
          Buyer: _.get(item, 'ShipmentBuyerCompanyName', ''),
          Product: _.get(item, 'ShipmentProductName', ''),
          ETD: new Date(etd.seconds * 1000).toLocaleString(),
          ETA: new Date(eta.seconds * 1000).toLocaleString(),
          '': this.renderDescription(index, item),
          Status: this.renderStatusComponent(item),
          uid: _.get(item, 'ShipmentID', '')
        };
      });
      input = createDataTable(input);
      data = input.data;
      columns = input.columns;
    }
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
        console.log('targetrow', e.target.tagName);

        if (
          e.target.tagName !== 'SELECT' &&
          e.target.tagName !== 'I' &&
          e.target.tagName !== 'DIV' &&
          e.target.tagName !== 'INPUT' &&
          e.target.tagName !== 'P'
        ) {
          window.location.replace(`#/chat/${row.uid}`);
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
                  style={{ width: 250, height: 38 }}
                />
              </Col>
              <Col xs="2">
                <MySearch {...props.searchProps} />
              </Col>
              <Col xs="6" />
              <Col xs="2" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                <Button style={{ backgroundColor: '#16A085', marginTop: 2, marginRight: 10 }}>
                  <span style={{ fontWeight: 'bold', color: 'white' }}>Save</span>
                </Button>
                <Button style={{ backgroundColor: 'white', marginTop: 2, marginRight: 10 }}>
                  <i className="icons cui-pencil" style={{ color: 'black' }} />{' '}
                  <span style={{ fontWeight: 'bold', color: '#707070' }}>Edit</span>
                </Button>
              </Col>
            </Row>
            <div className="table">
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
  return {
    ...state.authReducer,
    refs: state.shipmentReducer.ShipmentRefs
  };
};

export default connect(
  mapStateToProps,
  { fetchMoreShipments, editShipmentRef }
)(TableShipment);
