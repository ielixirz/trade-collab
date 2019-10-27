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

class ShippingInfoTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ShipmentDetailShippingLine: '',
      ShipmentDetailContainerNumber: '',
      ShipmentDetailBillofLandingNumber: '',
      ShipmentDetailOriginalDocumentTrackingNumber: '',
    };
  }
  render() {
    console.log('Data', this.props);

    return (
      <div>
        <Form
          className="form-horizontal"
          style={{
            border: 'none',
            borderColor: 'transparent',
          }}
        >
          <FormGroup row>
            <Col md="6">
              <Label htmlFor="text-input">Shipping Line</Label>
            </Col>
            <Col xs="6">
              <Input
                type="text"
                id="text-input"
                name="text-input"
                value={this.state.ShipmentDetailShippingLine}
                placeholder="Text"
                style={{
                  border: 'none',
                  borderColor: 'transparent',
                }}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="6">
              <Label htmlFor="text-input">Container No.</Label>
            </Col>
            <Col xs="6">
              <Input
                type="text"
                id="text-input"
                name="text-input"
                placeholder="Text"
                style={{
                  border: 'none',
                  borderColor: 'transparent',
                }}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="6">
              <Label htmlFor="text-input">Bill of Landding No.</Label>
            </Col>
            <Col xs="6">
              <Input
                type="text"
                id="text-input"
                name="text-input"
                placeholder="Text"
                style={{
                  border: 'none',
                  borderColor: 'transparent',
                }}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="6">
              <Label htmlFor="text-input">Original Docs. Tracking No.</Label>
            </Col>
            <Col xs="6">
              <Input
                type="text"
                id="text-input"
                name="text-inputt"
                placeholder="Text"
                style={{
                  border: 'none',
                  borderColor: 'transparent',
                }}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col>
              <Label htmlFor="text-input">Note</Label>
            </Col>
            <Col>
              <Input
                type="textarea"
                id="text-input"
                name="text-input"
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
