/* eslint-disable react/prefer-stateless-function */
/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import 'react-dates/initialize';
import DatePicker from './DatePicker';
import 'react-dates/lib/css/_datepicker.css';
import './OrderInfoTab.scss';
import OrderInfoTabProgress from './OrderInfoTabProgress';

class OrderInfoTab extends Component {
  render() {
    return (
      <Row>
        <Col xs={2} style={{ paddingLeft: 0 }}>
          <OrderInfoTabProgress progress={1} />
        </Col>
        <Col xs={10} style={{ paddingLeft: 22.5, paddingRight: 0 }}>
          {/* Detail Section */}
          <Row>
            <Col>
              <Row>
                <Col style={{ marginRight: 12 }}>
                  <Row style={{ fontSize: 14 }}>
                    <Col>
                      <span className="order-info-port-eta">Port ETA :</span>
                      <DatePicker />
                    </Col>
                  </Row>
                </Col>
                <Col style={{ fontSize: 14 }}>
                  <Row style={{ marginLeft: 30 }}>Fluke Company</Row>
                </Col>
              </Row>
              <Row style={{ marginTop: 5, marginBottom: 20 }}>
                <Col style={{ fontSize: 10 }}>
                  <span className="order-info-minor-text">Port , Country</span>
                </Col>
                <Col
                  style={{ fontSize: 10, textAlign: 'right', marginRight: 27 }}
                >
                  <span className="order-info-minor-text">Shipper</span>
                </Col>
              </Row>
              <Row>
                <Col style={{ fontSize: 14 }}>
                  <Row style={{ marginBottom: 10 }}>
                    <span className="order-info-eta-info">First Return :</span>
                    <DatePicker />
                  </Row>
                  <Row>
                    <span className="order-info-eta-info"> Cut-off :</span>
                    <DatePicker />
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
                      <DatePicker />
                    </Col>
                  </Row>
                </Col>
                <Col style={{ fontSize: 14 }}>
                  <Row style={{ marginLeft: 30 }}>Fluke Company</Row>
                </Col>
              </Row>
              <Row style={{ marginTop: 5, marginBottom: 20 }}>
                <Col style={{ fontSize: 10 }}>
                  <span className="order-info-minor-text">Port , Country</span>
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
                    <span className="order-info-eta-info">Last free day :</span>
                    <DatePicker />
                  </Row>
                  <Row>
                    <span className="order-info-eta-info">Est. Delivery :</span>
                    <DatePicker />
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
                value="Young Fresh Coconut"
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
              />
            </FormGroup>
          </Form>
        </Row>
      </Row>
    );
  }
}

export default OrderInfoTab;
