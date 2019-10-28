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
import { UpdateMasterData } from '../../../service/masterdata/masterdata';

class ShippingInfoTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ShipmentDetailShippingLine: '',
      ShipmentDetailContainerNumber: '',
      ShipmentDetailBillofLandingNumber: '',
      ShipmentDetailOriginalDocumentTrackingNumber: '',
      ShipmentDetailNote: '',
    };
  }
  componentDidMount() {
    if (this.orderTextarea) {
      this.orderTextarea.style.height = '100px';
    }
    this.setState({ ...this.props });
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
          onKeyPress={event => {
            if (event.key === 'Enter') {
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
              }).subscribe(() => {});
            }
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
                onChange={e => {
                  this.setState({ ShipmentDetailShippingLine: e.target.value });
                }}
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
                value={this.state.ShipmentDetailContainerNumber}
                onChange={e => {
                  this.setState({
                    ShipmentDetailContainerNumber: e.target.value,
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
          <FormGroup row>
            <Col md="6">
              <Label htmlFor="text-input">Bill of Landding No.</Label>
            </Col>
            <Col xs="6">
              <Input
                type="text"
                id="text-input"
                name="text-input"
                value={this.state.ShipmentDetailBillofLandingNumber}
                onChange={e => {
                  this.setState({
                    ShipmentDetailBillofLandingNumber: e.target.value,
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
              <Label htmlFor="text-input">Note</Label>
            </Col>
            <Col>
              <textarea
                row={9}
                id="text-input"
                ref={ref => (this.orderTextarea = ref)}
                name="text-input"
                value={this.state.ShipmentDetailNote}
                onChange={e => {
                  this.orderTextarea.style.height = '100px';
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
