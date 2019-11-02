/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable filenames/match-regex */

import React, { Component } from 'react';
import {
  Col, Form, FormGroup, Input, Label, Row,
} from 'reactstrap';
import 'react-dates/initialize';
import moment from 'moment';
import _ from 'lodash';

import DatePicker from './DatePicker';
import 'react-dates/lib/css/_datepicker.css';
import './OrderInfoTab.scss';

import OrderInfoTabProgress from './OrderInfoTabProgress';
import { UpdateMasterData } from '../../../service/masterdata/masterdata';
import ErrorPopup from '../../../component/commonPopup/ErrorPopup';

import { isDateBefore, isDateAfter } from '../../../utils/date';
import firebase from 'firebase';
import { GetShipmentDetail, isCanSeeShipmentDetail } from '../../../service/shipment/shipment';

class OrderInfoTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: 0,
      isImporter: false,
      ConsigneeETAPortDate: new Date(),
      ShipperFirstReturn: new Date(),
      ShipperETDDate: new Date(),
      ShipperCutOff: new Date(),
      ConsigneeLastFreeDay: new Date(),
      ConsigneeEstimateDelivery: new Date(),
      ShipperPort: '',
      ShipperCompanyName: '',
      ConsigneeCompanyName: '',
      ShipperCountry: '',
      ConsigneeCountry: '',
      ConsigneePort: '',
      ShipmentDetailProduct: '',
      ShipmentDetailPriceDescriptionOfGoods: '',
      DateInvalidMap: {
        ConsigneeETAPortDate: false,
        ShipperFirstReturn: false,
        ShipperETDDate: false,
        ShipperCutOff: false,
        ConsigneeLastFreeDay: false,
        ConsigneeEstimateDelivery: false,
      },
      ...this.props,
    };
    this.errorPopupRef = React.createRef();
  }

  componentDidMount() {
    GetShipmentDetail(this.props.shipmentKey).subscribe({
      next: (shipment) => {
        console.log('Shipments', shipment.data(), this.props);
        const shipmentData = shipment.data();
        let start = moment();
        let end = moment();
        const today = moment().startOf('day');

        start = moment(
          shipmentData.ShipperETDDate === undefined
            ? today
            : shipmentData.ShipperETDDate.seconds * 1000,
        );
        end = moment(
          shipmentData.ConsigneeETAPortDate === undefined
            ? today
            : shipmentData.ConsigneeETAPortDate.seconds * 1000,
        );

        const total = end.diff(start, 'days');
        const current = today.diff(start, 'days');

        this.setState({
          progress: ((current / total) * 100) / 10,
        });
        const currentMember = _.get(shipment.data().ShipmentMember, this.props.userKey, false);
        if (currentMember) {
          isCanSeeShipmentDetail(
            this.props.shipmentKey,
            currentMember.ShipmentMemberCompanyKey,
          ).subscribe({
            next: (res) => {
              console.log('result lock is', res);
              this.setState({
                isImporter: res,
              });
            },
          });
        }
      },
    });
  }

  handleDateChange(date, dateName) {
    const invalidMap = { ...this.state.DateInvalidMap };
    this.setState(
      {
        [dateName]: date,
      },
      () => {
        if (this.validateOrderInfoDate()) {
          UpdateMasterData(this.props.shipmentKey, 'DefaultTemplate', {
            [dateName]: firebase.firestore.Timestamp.fromDate(date.toDate()),
          }).subscribe(() => {
            console.log('Done');
          });

          Object.keys(invalidMap).forEach(key => (invalidMap[key] = false));
          this.setState({
            DateInvalidMap: invalidMap,
          });
        } else {
          invalidMap[dateName] = true;
          let invalidMsg = '';

          switch (dateName) {
            case 'ConsigneeETAPortDate':
              invalidMsg = (
                <span>
                  <b>ETA is invalid.</b>
                  <br />
                  ETA must be after ETD or before Estimate Delivery and Last Free Day.
                </span>
              );
              break;
            case 'ShipperFirstReturn':
              invalidMsg = (
                <span>
                  <b>First Return date is invalid.</b>
                  <br />
                  First Return date must be before Cut-off date.
                </span>
              );
              break;
            case 'ShipperETDDate':
              invalidMsg = (
                <span>
                  <b>ETD is invalid.</b>
                  <br />
                  ETD must be after Cut-off date and after ETA.
                </span>
              );
              break;
            case 'ShipperCutOff':
              invalidMsg = (
                <span>
                  <b>Cut-off date is invalid.</b>
                  <br />
                  Cut-off date must be before ETD and after First Return date.
                </span>
              );
              break;
            case 'ConsigneeLastFreeDay':
              invalidMsg = (
                <span>
                  <b>Last Free day date is invalid.</b>
                  <br />
                  Last Free day date must be after ETA.
                </span>
              );
              break;
            case 'ConsigneeEstimateDelivery':
              invalidMsg = (
                <span>
                  <b>Estimate Delivery date is invalid.</b>
                  <br />
                  Estimate Delivery date must be after ETA.
                </span>
              );
              break;

            default:
              break;
          }
          this.errorPopupRef.current.triggerError(invalidMsg, 'WARN');
          this.setState({
            DateInvalidMap: invalidMap,
          });
        }
      },
    );
  }

  validateOrderInfoDate() {
    let rule1 = true;
    let rule2 = true;
    let rule3 = true;
    let rule4 = true;

    const firstReturnDate = moment.isMoment(this.state.ShipperFirstReturn)
      ? this.state.ShipperFirstReturn
      : new Date(this.state.ShipperFirstReturn.seconds * 1000);

    const shipperCutOffDate = moment.isMoment(this.state.ShipperCutOff)
      ? this.state.ShipperCutOff
      : new Date(this.state.ShipperCutOff.seconds * 1000);

    const etdDate = moment.isMoment(this.state.ShipperETDDate)
      ? this.state.ShipperETDDate
      : new Date(this.state.ShipperETDDate.seconds * 1000);

    const etaPortDate = moment.isMoment(this.state.ConsigneeETAPortDate)
      ? this.state.ConsigneeETAPortDate
      : new Date(this.state.ConsigneeETAPortDate.seconds * 1000);

    const estimateDeliveryDate = moment.isMoment(this.state.ConsigneeEstimateDelivery)
      ? this.state.ConsigneeEstimateDelivery
      : new Date(this.state.ConsigneeEstimateDelivery.seconds * 1000);

    const lastFreeDayDate = moment.isMoment(this.state.ConsigneeLastFreeDay)
      ? this.state.ConsigneeLastFreeDay
      : new Date(this.state.ConsigneeLastFreeDay.seconds * 1000);

    if (isDateAfter(moment(firstReturnDate), moment(shipperCutOffDate))) {
      rule1 = false;
    }

    if (isDateAfter(moment(shipperCutOffDate), moment(etdDate))) {
      rule2 = false;
    }

    if (isDateBefore(moment(etaPortDate), moment(this.state.ShipperETDDate))) {
      rule3 = false;
    }

    if (
      isDateBefore(moment(estimateDeliveryDate), moment(etaPortDate))
      || isDateBefore(moment(lastFreeDayDate), moment(etaPortDate))
    ) {
      rule4 = false;
    }

    this.setState({
      OrderInfoDateRule1: rule1,
      OrderInfoDateRule2: rule2,
      OrderInfoDateRule3: rule3,
      OrderInfoDateRule4: rule4,
    });

    return rule1 && rule2 && rule3 && rule4;
  }

  render() {
    console.log('State', this.state);
    const dateInput = {};
    _.forEach(this.state.DateInvalidMap, (item, index) => {
      if (_.isEmpty(this.state[index])) {
        dateInput[index] = new Date();
      } else {
        dateInput[index] = new Date(this.state[index].seconds * 1000);
      }
    });
    return (
      <Row
        onKeyPress={(event) => {
          console.log('Keypressed', event);

          if (event.key === 'Enter') {
            event.target.blur();
            const {
              ShipperPort,
              ShipperCompanyName,
              ConsigneeCompanyName,
              ShipperCountry,
              ConsigneeCountry,
              ConsigneePort,
              ShipmentDetailProduct,
              ShipmentDetailPriceDescriptionOfGoods,
            } = this.state;
            UpdateMasterData(this.props.shipmentKey, 'DefaultTemplate', {
              ShipperPort,
              ShipperCompanyName,
              ConsigneeCompanyName,
              ShipperCountry,
              ConsigneeCountry,
              ConsigneePort,
              ShipmentDetailProduct,
              ShipmentDetailPriceDescriptionOfGoods,
            }).subscribe(() => {});
          }
        }}
      >
        <Col xs={2} style={{ paddingLeft: 0, paddingTop: '15px', marginRight: '7px' }}>
          <OrderInfoTabProgress progress={this.state.progress} />
        </Col>
        <Col xs={9} style={{ paddingLeft: 22.5, paddingRight: 0, paddingTop: 10 }}>
          {/* Detail Section */}
          <Row>
            <Col>
              <Row>
                <Col style={{ marginRight: 12 }}>
                  <Row style={{ fontSize: 14, paddingTop: '10px' }}>
                    <Col>
                      <span className="order-info-port-etd">Port ETD :</span>
                      <DatePicker
                        value={dateInput.ShipperETDDate}
                        name="ShipperETDDate"
                        shipmentKey={this.props.shipmentKey}
                        validator={this.validateOrderInfoDate.bind(this)}
                        changeHandler={this.handleDateChange.bind(this)}
                        invalid={this.state.DateInvalidMap}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col style={{ fontSize: 14 }}>
                  <Row style={{ marginLeft: 30, marginTop: '5px' }}>
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={this.state.ShipperCompanyName}
                      onChange={(e) => {
                        this.setState({ ShipperCompanyName: e.target.value });
                      }}
                      className="form-control order-info-input-inline"
                      style={{
                        textAlign: 'right',
                        fontSize: 14,
                      }}
                    />
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: 5, marginBottom: 20 }}>
                <Col style={{ fontSize: 10 }}>
                  <span className="order-info-minor-text">
                    <Row
                      style={{
                        marginTop: '-10px',
                      }}
                    >
                      <Col>
                        <input
                          type="text"
                          placeholder="Port,Country"
                          value={this.state.ShipperPort}
                          onChange={(e) => {
                            this.setState({ ShipperPort: e.target.value });
                          }}
                          className="form-control order-info-input-noborder"
                          style={{
                            fontSize: 10,
                            borderBottom: '0px ',
                          }}
                        />
                      </Col>
                    </Row>
                  </span>
                </Col>
                <Col style={{ fontSize: 10, textAlign: 'right' }}>
                  <span className="order-info-minor-text">Shipper</span>
                </Col>
              </Row>
              <Row>
                <Col style={{ fontSize: 14 }}>
                  <Row style={{ marginBottom: 10 }}>
                    <span className="order-info-eta-info">First Return :</span>

                    <Col>
                      <DatePicker
                        value={dateInput.ShipperFirstReturn}
                        name="ShipperFirstReturn"
                        shipmentKey={this.props.shipmentKey}
                        validator={this.validateOrderInfoDate.bind(this)}
                        changeHandler={this.handleDateChange.bind(this)}
                        invalid={this.state.DateInvalidMap}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <span className="order-info-eta-info"> Cut-off :</span>
                    <Col>
                      <DatePicker
                        value={dateInput.ShipperCutOff}
                        name="ShipperCutOff"
                        shipmentKey={this.props.shipmentKey}
                        validator={this.validateOrderInfoDate.bind(this)}
                        changeHandler={this.handleDateChange.bind(this)}
                        invalid={this.state.DateInvalidMap}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: 30, marginBottom: 30 }}>
                <span className="line-sep-dash" />
              </Row>
              <Row>
                <Col style={{ marginRight: 12, marginTop: 5 }}>
                  <Row style={{ fontSize: 14 }}>
                    <Col>
                      <span className="order-info-port-eta">Port ETA :</span>
                      <DatePicker
                        value={dateInput.ConsigneeETAPortDate}
                        name="ConsigneeETAPortDate"
                        shipmentKey={this.props.shipmentKey}
                        validator={this.validateOrderInfoDate.bind(this)}
                        changeHandler={this.handleDateChange.bind(this)}
                        invalid={this.state.DateInvalidMap}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col style={{ fontSize: 14 }}>
                  <Row style={{ marginLeft: 30 }}>
                    {' '}
                    <input
                      type="text"
                      className="form-control order-info-input-inline"
                      placeholder="CompanyName"
                      value={this.state.ConsigneeCompanyName}
                      onChange={(e) => {
                        this.setState({ ConsigneeCompanyName: e.target.value });
                      }}
                      style={{
                        textAlign: 'right',
                      }}
                    />
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: 5, marginBottom: 20 }}>
                <Col style={{ fontSize: 10 }}>
                  <span className="order-info-minor-text">
                    <Row>
                      <Col>
                        <input
                          type="text"
                          placeholder="Port,Country"
                          value={this.state.ConsigneePort}
                          onChange={(e) => {
                            this.setState({ ConsigneePort: e.target.value });
                          }}
                          className="form-control order-info-input-noborder"
                        />
                      </Col>
                    </Row>
                  </span>
                </Col>
                <Col style={{ fontSize: 10, textAlign: 'right' }}>
                  <span className="order-info-minor-text">Consignee</span>
                </Col>
              </Row>
              <Row>
                <Col style={{ fontSize: 14 }}>
                  <Row style={{ marginBottom: 10 }}>
                    <span className="order-info-eta-info">Last free day : </span>
                    <DatePicker
                      value={dateInput.ConsigneeLastFreeDay}
                      name="ConsigneeLastFreeDay"
                      shipmentKey={this.props.shipmentKey}
                      validator={this.validateOrderInfoDate.bind(this)}
                      changeHandler={this.handleDateChange.bind(this)}
                      invalid={this.state.DateInvalidMap}
                    />
                  </Row>
                  <Row>
                    <span className="order-info-eta-info">Est. Delivery :</span>
                    <DatePicker
                      value={dateInput.ConsigneeEstimateDelivery}
                      name="ConsigneeEstimateDelivery"
                      shipmentKey={this.props.shipmentKey}
                      validator={this.validateOrderInfoDate.bind(this)}
                      changeHandler={this.handleDateChange.bind(this)}
                      invalid={this.state.DateInvalidMap}
                    />
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        {/* Input Section */}
        <Row style={{ marginLeft: 10, marginTop: 30 }}>
          <Form
            style={{
              width: '100%',
            }}
          >
            <FormGroup>
              <Label className="order-info-input-label" htmlFor="Product">
                Product
              </Label>
              <Input
                className="order-info-input"
                type="text"
                id="Product"
                placeholder="Your Shipment Product"
                value={this.state.ShipmentDetailProduct}
                onChange={(e) => {
                  if (_.size(e.target.value) > 50) {
                    e.target.className = 'form-control  order-info-input-invalid';
                  } else {
                    e.target.className = 'form-control  order-info-input';
                    this.setState({ ShipmentDetailProduct: e.target.value });
                  }
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label className="order-info-input-label" htmlFor="Details">
                Details
                {' '}
                {!this.state.isImporter ? <i className="fa fa-lock fa-lg mt-4" /> : ''}
              </Label>
              <Input
                className="order-info-input"
                type="text"
                id="Details"
                placeholder="Detail"
                value={this.state.ShipmentDetailPriceDescriptionOfGoods}
                readOnly={!this.state.isImporter}
                onChange={(e) => {
                  if (_.size(e.target.value) > 600) {
                    e.target.className = 'form-control order-info-input-invalid';
                  } else {
                    e.target.className = 'form-control order-info-input';
                    this.setState({
                      ShipmentDetailPriceDescriptionOfGoods: e.target.value,
                    });
                  }
                }}
              />
            </FormGroup>
          </Form>
        </Row>
        <ErrorPopup ref={this.errorPopupRef} />
      </Row>
    );
  }
}

export default OrderInfoTab;
