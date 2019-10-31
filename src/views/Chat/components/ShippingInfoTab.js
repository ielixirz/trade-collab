/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';
import {
  Badge,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
} from 'reactstrap';
import _ from 'lodash';
import { UpdateMasterData } from '../../../service/masterdata/masterdata';
import {
  GetAllShipmentRole,
  GetShipmentDetail,
  isCanSeeShipmentDetail,
} from '../../../service/shipment/shipment';

class ShippingInfoTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ShipmentDetailShippingLine: '',
      ShipmentDetailContainerNumber: '',
      ShipmentDetailBillofLandingNumber: '',
      ShipmentDetailOriginalDocumentTrackingNumber: '',
      ShipmentDetailNote: '',
      ...this.props,
    };
  }

  componentDidMount() {
    if (this.orderTextarea) {
      this.orderTextarea.style.height = '100px';
    }
  }

  render() {
    return (
      <div>
        <Form
          className="form-horizontal"
          style={{
            border: 'none',
            borderColor: 'transparent',
            fontSize: '12px',
          }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              event.target.blur();
              const {
                ShipmentDetailShippingLine,
                ShipmentDetailContainerNumber,
                ShipmentDetailBillofLandingNumber,
                ShipmentDetailOriginalDocumentTrackingNumber,
                ShipmentDetailNote,
              } = this.state;
              UpdateMasterData(this.props.shipmentKey, 'DefaultTemplate', {
                ShipmentDetailShippingLine,
                ShipmentDetailContainerNumber,
                ShipmentDetailBillofLandingNumber,
                ShipmentDetailOriginalDocumentTrackingNumber,
                ShipmentDetailNote,
              }).subscribe(() => {
                console.log('Updated');
              });
            }
          }}
        >
          <FormGroup row>
            <Col lg="6">
              <Label style={{ fontSize: 12, fontWeight: 'bold' }}>
                Shipping Line
              </Label>
            </Col>
            <Col xs="6">
              <Input
                type="text"
                id="text-input"
                name="text-input"
                value={this.state.ShipmentDetailShippingLine}
                className="form-control order-info-input-inline"
                onChange={e => {
                  if (_.size(e.target.value) > 50) {
                    e.target.className =
                      'form-control order-info-input-inline-invalid';
                  } else {
                    e.target.className = 'form-control order-info-input-inline';
                    this.setState({
                      ShipmentDetailShippingLine: e.target.value,
                    });
                  }
                }}
                placeholder="e.g. Maersk, MSC"
                style={{
                  border: 'none',
                  borderColor: 'transparent',
                }}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col lg="6">
              <Label style={{ fontSize: 12, fontWeight: 'bold' }}>
                Container No.
              </Label>
            </Col>
            <Col xs="6">
              <Input
                type="text"
                id="text-input"
                name="text-input"
                className="form-control order-info-input-inline"
                value={this.state.ShipmentDetailContainerNumber}
                onChange={e => {
                  if (_.size(e.target.value) > 50) {
                    e.target.className =
                      'form-control order-info-input-inline-invalid';
                  } else {
                    e.target.className = 'form-control order-info-input-inline';
                    this.setState({
                      ShipmentDetailContainerNumber: e.target.value,
                    });
                  }
                }}
                placeholder="Input Container No."
                style={{
                  'text-transform': 'uppercase',
                  border: 'none',
                  borderColor: 'transparent',
                }}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col lg="6">
              <Label style={{ fontSize: 12, fontWeight: 'bold' }}>
                Bill of Landding No.
              </Label>
            </Col>
            <Col xs="6">
              <Input
                type="text"
                id="text-input"
                name="text-input"
                className="form-control order-info-input-inline"
                value={this.state.ShipmentDetailBillofLandingNumber}
                onChange={e => {
                  if (_.size(e.target.value) > 50) {
                    e.target.className =
                      'form-control order-info-input-inline-invalid';
                  } else {
                    e.target.className = 'form-control order-info-input-inline';
                    this.setState({
                      ShipmentDetailBillofLandingNumber: e.target.value,
                    });
                  }
                }}
                placeholder="Master Bill of Landing No."
                style={{
                  border: 'none',
                  borderColor: 'transparent',
                }}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col lg="6">
              <Label
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                }}
              >
                Original Docs. Tracking No.
              </Label>
            </Col>
            <Col xs="6">
              <Input
                type="text"
                id="text-input"
                className="form-control order-info-input-inline"
                name="text-inputt"
                placeholder="e.g. DHL Tracking No."
                value={this.state.ShipmentDetailOriginalDocumentTrackingNumber}
                onChange={e => {
                  if (_.size(e.target.value) > 50) {
                    e.target.className =
                      'form-control order-info-input-inline-invalid';
                  } else {
                    e.target.className = 'form-control order-info-input-inline';
                    this.setState({
                      ShipmentDetailOriginalDocumentTrackingNumber:
                        e.target.value,
                    });
                  }
                }}
                style={{
                  border: 'none',
                  borderColor: 'transparent',
                }}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col>
              <Label style={{ fontSize: 12, fontWeight: 'bold' }}>Note</Label>
            </Col>
            <Col>
              <textarea
                row={9}
                id="text-input"
                ref={ref => (this.orderTextarea = ref)}
                name="text-input"
                className="form-control order-info-input-inline"
                value={this.state.ShipmentDetailNote}
                maxLength={300}
                onChange={e => {
                  this.orderTextarea.style.height = '100px';
                  if (this.orderTextarea.scrollHeight > 280) {
                    this.orderTextarea.style.height = '280px';
                  } else {
                    this.orderTextarea.style.height = `${this.orderTextarea.scrollHeight}px`;
                  }
                  if (_.size(e.target.value) > 300) {
                    e.target.className =
                      'form-control order-info-input-inline-invalid';
                  } else {
                    e.target.className = 'form-control order-info-input-inline';
                    this.setState({
                      ShipmentDetailNote: e.target.value,
                    });
                  }
                }}
                placeholder="Text"
                style={{
                  border: 'none',
                  borderColor: 'transparent',
                }}
              />
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default ShippingInfoTab;
