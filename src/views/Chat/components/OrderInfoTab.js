/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable filenames/match-regex */

import React, { Component } from 'react';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import 'react-dates/initialize';
import moment from 'moment';

import DatePicker from './DatePicker';
import 'react-dates/lib/css/_datepicker.css';
import './OrderInfoTab.scss';

import OrderInfoTabProgress from './OrderInfoTabProgress';
import { UpdateMasterData } from '../../../service/masterdata/masterdata';

import { isDateBefore, isDateAfter } from '../../../utils/date';

class OrderInfoTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
  }

  handleDateChange(date, dateName) {
    const invalidMap = { ...this.state.DateInvalidMap };
    this.setState(
      {
        [dateName]: date,
      },
      () => {
        if (this.validateOrderInfoDate()) {
          console.log('fire update service here');
          Object.keys(invalidMap).forEach(key => (invalidMap[key] = false));
          this.setState({
            DateInvalidMap: invalidMap,
          });
        } else {
          invalidMap[dateName] = true;
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
    if (
      isDateAfter(
        moment(this.state.ShipperFirstReturn),
        moment(this.state.ShipperCutOff),
      )
    ) {
      rule1 = false;
    }

    if (
      isDateAfter(
        moment(this.state.ShipperCutOff),
        moment(this.state.ShipperETDDate),
      )
    ) {
      rule2 = false;
    }

    if (
      isDateBefore(
        moment(this.state.ConsigneeETAPortDate),
        moment(this.state.ShipperETDDate),
      )
    ) {
      rule3 = false;
    }

    if (
      isDateBefore(
        moment(this.state.ConsigneeEstimateDelivery),
        moment(this.state.ConsigneeETAPortDate),
      ) ||
      isDateBefore(
        moment(this.state.ConsigneeLastFreeDay),
        moment(this.state.ConsigneeETAPortDate),
      )
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
    return (
      <Row
        onKeyPress={event => {
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
        <Col
          xs={2}
          style={{ paddingLeft: 0, paddingTop: '10px', marginRight: '7px' }}
        >
          <OrderInfoTabProgress progress={10} />
        </Col>
        <Col
          xs={9}
          style={{ paddingLeft: 22.5, paddingRight: 0, paddingTop: 10 }}
        >
          {/* Detail Section */}
          <Row>
            <Col>
              <Row>
                <Col style={{ marginRight: 12 }}>
                  <Row style={{ fontSize: 14, paddingTop: '10px' }}>
                    <Col>
                      <span className="order-info-port-eta">Port ETA :</span>
                      <DatePicker
                        value={this.state.ConsigneeETAPortDate}
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
                  <Row style={{ marginLeft: 30, paddingTop: '-10px' }}>
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={this.state.ShipperCompanyName}
                      onChange={e => {
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
                          onChange={e => {
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
                    <DatePicker
                      value={this.state.ShipperFirstReturn}
                      name="ShipperFirstReturn"
                      shipmentKey={this.props.shipmentKey}
                      validator={this.validateOrderInfoDate.bind(this)}
                      changeHandler={this.handleDateChange.bind(this)}
                      invalid={this.state.DateInvalidMap}
                    />
                  </Row>
                  <Row>
                    <span className="order-info-eta-info"> Cut-off :</span>
                    <DatePicker
                      value={this.state.ShipperCutOff}
                      name="ShipperCutOff"
                      shipmentKey={this.props.shipmentKey}
                      validator={this.validateOrderInfoDate.bind(this)}
                      changeHandler={this.handleDateChange.bind(this)}
                      invalid={this.state.DateInvalidMap}
                    />
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: 30, marginBottom: 30 }}>
                <span className="line-sep-dash" />
              </Row>
              <Row>
                <Col style={{ marginRight: 12 }}>
                  <Row style={{ fontSize: 14 }}>
                    <Col>
                      <span className="order-info-port-etd">Port ETD :</span>
                      <DatePicker
                        value={this.state.ShipperETDDate}
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
                  <Row style={{ marginLeft: 30 }}>
                    {' '}
                    <input
                      type="text"
                      className="form-control order-info-input-inline"
                      placeholder="CompanyName"
                      value={this.state.ConsigneeCompanyName}
                      onChange={e => {
                        this.setState({ ConsigneeCompanyName: e.target.value });
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
                          placeholder="Port"
                          value={this.state.ConsigneePort}
                          onChange={e => {
                            this.setState({ ConsigneePort: e.target.value });
                          }}
                          className="form-control order-info-input-inline"
                        />
                      </Col>

                      <Col>
                        <input
                          type="text"
                          className="form-control order-info-input-inline"
                          placeholder="Country"
                          value={this.state.ConsigneeCountry}
                          onChange={e => {
                            this.setState({ ConsigneeCountry: e.target.value });
                          }}
                        />
                      </Col>
                    </Row>
                  </span>
                </Col>
                <Col
                  style={{ fontSize: 10, textAlign: 'right', marginRight: 27 }}
                >
                  <span className="order-info-minor-text">Consignee</span>
                </Col>
              </Row>
              <Row>
                <Col style={{ fontSize: 14 }}>
                  <Row style={{ marginBottom: 10 }}>
                    <span className="order-info-eta-info">
                      Last free day :{' '}
                    </span>
                    <DatePicker
                      value={this.state.ConsigneeLastFreeDay}
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
                      value={this.state.ConsigneeEstimateDelivery}
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
                onChange={e => {
                  this.setState({ ShipmentDetailProduct: e.target.value });
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label className="order-info-input-label" htmlFor="Details">
                Details <i className="fa fa-lock fa-lg mt-4" />
              </Label>
              <Input
                className="order-info-input"
                type="text"
                id="Details"
                placeholder="Detail"
                value={this.state.ShipmentDetailPriceDescriptionOfGoods}
                onChange={e => {
                  this.setState({
                    ShipmentDetailPriceDescriptionOfGoods: e.target.value,
                  });
                }}
              />
            </FormGroup>
          </Form>
        </Row>
      </Row>
    );
  }
}

export default OrderInfoTab;
