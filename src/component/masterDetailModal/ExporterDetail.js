/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React from 'react';
import {
  Row, Col, Input, Label,
} from 'reactstrap';

const ExporterDetail = ({ exporterData, inputHandle }) => (
  <React.Fragment>
    <Row className="master-detail-data-row">
      <span className="master-detail-heading-label">
        <b>Exporter</b>
      </span>
    </Row>
    <Row className="master-detail-data-row">
      <Label htmlFor="company-name">
        <b>Company Name</b>
      </Label>
      <Input type="text" id="company-name" placeholder="Example Co., Ltd." onChange={inputHandle} />
    </Row>
    <Row className="master-detail-data-row">
      <Label htmlFor="etd">
        <b>ETD</b>
      </Label>
      <Input type="text" id="etd" placeholder="DD/MM/YYYY" onChange={inputHandle} />
    </Row>
    <Row className="master-detail-data-row last">
      <Col>
        <Label htmlFor="port">
          <b>Port</b>
        </Label>
        <Input type="text" id="port" placeholder="Port" onChange={inputHandle} />
      </Col>
      <Col style={{ marginLeft: '5px' }}>
        <Label htmlFor="country">
          <b>Country</b>
        </Label>
        <Input type="text" id="country" placeholder="Country" onChange={inputHandle} />
      </Col>
    </Row>
  </React.Fragment>
);

export default ExporterDetail;
