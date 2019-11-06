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
      validation: {
        ShipmentDetailShippingLine: {
          size: false,
          format: false,
        },
        ShipmentDetailContainerNumber: {
          size: false,
          format: false,
        },
        ShipmentDetailBillofLandingNumber: {
          size: false,
          format: false,
        },
        ShipmentDetailOriginalDocumentTrackingNumber: {
          size: false,
          format: false,
        },
        ShipmentDetailNote: {
          size: false,
          format: false,
        },
      },
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
      this.orderTextarea.style.height = '50px';
    }
  }

  renderError(validate, limit) {
    const { format, size } = validate;
    return (
      <div>
        <p style={{ fontSize: 10, color: 'red' }}>
          {format ? 'special character not allowed' : ''}
          {size ? `text size is must lower than ${limit}` : ''}
        </p>
      </div>
    );
  }
  render() {
    let { validation } = this.state;

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
              const regex = RegExp('^[d a-zA-Z0-9 -]+$');

              if (this.state.ShipmentDetailShippingLine) event.target.blur();
              let { validation } = this.state;
              const {
                ShipmentDetailShippingLine,
                ShipmentDetailContainerNumber,
                ShipmentDetailBillofLandingNumber,
                ShipmentDetailOriginalDocumentTrackingNumber,
                ShipmentDetailNote,
              } = this.state;
              const input = {
                ShipmentDetailShippingLine,
                ShipmentDetailContainerNumber,
                ShipmentDetailBillofLandingNumber,
                ShipmentDetailOriginalDocumentTrackingNumber,
                ShipmentDetailNote,
              };
              for (const key of Object.keys(input)) {
                if (key !== ShipmentDetailNote) {
                  validation[key].format = regex.test(input[key]) === false;
                  validation[key].size = _.size(input[key]) > 50;
                } else {
                  validation[key].size = _.size(input[key]) > 300;
                }
                console.log(key, input[key]);
              }
              let passValidate = true;
              for (const validatekey of Object.keys(validation)) {
                if (_.includes(validation[validatekey], true)) {
                  passValidate = false;
                }
              }

              console.log('Validation is', passValidate);
              this.setState({ validation: validation });
              if (passValidate === true) {
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
            }
          }}
        >
          <FormGroup row>
            <Col lg="6">
              <Label
                style={{ fontSize: 12, fontWeight: 'bold', marginTop: 10 }}
              >
                Shipping Line
              </Label>
            </Col>
            <Col xs="6">
              {this.renderError(validation.ShipmentDetailShippingLine, 50)}
              <Input
                type="text"
                id="text-input"
                name="text-input"
                value={this.state.ShipmentDetailShippingLine}
                className={
                  _.includes(validation.ShipmentDetailShippingLine, true)
                    ? 'form-control order-info-input-inline-invalid'
                    : 'form-control order-info-input-inline'
                }
                onChange={e => {
                  this.setState({
                    ShipmentDetailShippingLine: e.target.value,
                  });
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
              <Label
                style={{ fontSize: 12, fontWeight: 'bold', marginTop: 10 }}
              >
                Container No.
              </Label>
            </Col>
            <Col xs="6">
              {this.renderError(validation.ShipmentDetailContainerNumber, 50)}

              <Input
                type="text"
                id="text-input"
                name="text-input"
                className={
                  _.includes(validation.ShipmentDetailContainerNumber, true)
                    ? 'form-control order-info-input-inline-invalid'
                    : 'form-control order-info-input-inline'
                }
                value={this.state.ShipmentDetailContainerNumber}
                onChange={e => {
                  this.setState({
                    ShipmentDetailContainerNumber: e.target.value,
                  });
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
              <Label
                style={{ fontSize: 12, fontWeight: 'bold', marginTop: 10 }}
              >
                Bill of Landding No.
              </Label>
            </Col>
            <Col xs="6">
              {this.renderError(
                validation.ShipmentDetailBillofLandingNumber,
                50,
              )}

              <Input
                type="text"
                id="text-input"
                name="text-input"
                className={
                  _.includes(validation.ShipmentDetailBillofLandingNumber, true)
                    ? 'form-control order-info-input-inline-invalid'
                    : 'form-control order-info-input-inline'
                }
                value={this.state.ShipmentDetailBillofLandingNumber}
                onChange={e => {
                  this.setState({
                    ShipmentDetailBillofLandingNumber: e.target.value,
                  });
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
                  marginTop: 10,
                  whiteSpace: 'nowrap',
                }}
              >
                Original Docs. Tracking No.
              </Label>
            </Col>
            <Col xs="6">
              {this.renderError(
                validation.ShipmentDetailOriginalDocumentTrackingNumber,
                50,
              )}

              <Input
                type="text"
                id="text-input"
                className={
                  _.includes(
                    validation.ShipmentDetailOriginalDocumentTrackingNumber,
                    true,
                  )
                    ? 'form-control order-info-input-inline-invalid'
                    : 'form-control order-info-input-inline'
                }
                name="text-inputt"
                placeholder="e.g. DHL Tracking No."
                value={this.state.ShipmentDetailOriginalDocumentTrackingNumber}
                onChange={e => {
                  this.setState({
                    ShipmentDetailOriginalDocumentTrackingNumber:
                      e.target.value,
                  });
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
              <Label
                style={{ fontSize: 12, fontWeight: 'bold', marginTop: 10 }}
              >
                Note
              </Label>
            </Col>
            <Col>
              {this.renderError(validation.ShipmentDetailNote, 300)}
              <textarea
                row={0}
                id="text-input"
                ref={ref => (this.orderTextarea = ref)}
                name="text-input"
                className={
                  _.includes(validation.ShipmentDetailNote, true)
                    ? 'form-control order-info-input-inline-invalid textarea'
                    : 'form-control order-info-input-inline textarea'
                }
                value={this.state.ShipmentDetailNote}
                onChange={e => {
                  this.orderTextarea.style.height = '50px';
                  if (this.orderTextarea.scrollHeight > 280) {
                    this.orderTextarea.style.height = '280px';
                  } else {
                    this.orderTextarea.style.height = `${this.orderTextarea.scrollHeight}px`;
                  }
                  this.setState({
                    ShipmentDetailNote: e.target.value,
                  });
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
