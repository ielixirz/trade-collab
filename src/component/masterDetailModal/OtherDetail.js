/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React from 'react';
import {
  Row, Col, Input, Label,
} from 'reactstrap';

const OtherDetail = ({ otherData, inputHandle }) => (
  <React.Fragment>
    <Row className="master-detail-data-row other">
      <Col>
        <Row className="master-detail-data-row">
          <Label htmlFor="shipping-line">
            <b>Shipping Line</b>
          </Label>
          <Input
            type="text"
            id="shipping-line"
            placeholder="Name of Shipping Line"
            onChange={inputHandle}
          />
        </Row>
        <Row className="master-detail-data-row">
          <Label htmlFor="price-desc">
            <b>Price, Description of Goods</b>
          </Label>
          <Input type="textarea" id="price-desc" placeholder="Message...." onChange={inputHandle} />
        </Row>
        <Row className="master-detail-data-row">
          <Label htmlFor="product">
            <b>Product</b>
          </Label>
          <Input type="text" id="product" placeholder="Product" onChange={inputHandle} />
        </Row>
        <Row className="master-detail-data-row">
          <Label htmlFor="bill-no">
            <b>Bill of Landing No.</b>
          </Label>
          <Input type="text" id="bill-no" placeholder="Landing No." onChange={inputHandle} />
        </Row>
        <Row className="master-detail-data-row">
          <Label htmlFor="container-no">
            <b>Container No.</b>
          </Label>
          <Input type="text" id="container-no" placeholder="Container No." onChange={inputHandle} />
        </Row>
        <Row className="master-detail-data-row">
          <Label htmlFor="original-doc">
            <b>Original Docs. Tracking No.</b>
          </Label>
          <Input
            type="text"
            id="original-doc"
            placeholder="Original Docs. Tracking No."
            onChange={inputHandle}
          />
        </Row>
      </Col>
    </Row>
  </React.Fragment>
);

export default OtherDetail;
