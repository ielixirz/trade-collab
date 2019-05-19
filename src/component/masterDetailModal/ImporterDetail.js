/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React from 'react';
import {
  Row, Col, Input, Label,
} from 'reactstrap';

const ImporterDetail = ({ importerData, inputHandle }) => (
  <React.Fragment>
    <Row className="master-detail-data-row">
      <span className="master-detail-heading-label">
        <b>Importer</b>
      </span>
    </Row>
    <Row className="master-detail-data-row">
      <Label htmlFor="company-name">
        <b>Company Name</b>
      </Label>
      <Input type="text" id="company-name" placeholder="Example Co., Ltd." onChange={inputHandle} />
    </Row>
    <Row className="master-detail-data-row">
      <Col xs="4" style={{ padding: 0 }}>
        <Label htmlFor="etd">
          <b>ETA at Port</b>
        </Label>
        <Input type="text" id="eta-port" placeholder="DD/MM/YYYY" onChange={inputHandle} />
      </Col>
      <Col xs="7" style={{ marginLeft: '30px' }}>
        <Row>
          <Col>
            <Label style={{ marginTop: '5px', marginRight: '10px', float: 'right' }}>
              <b>ETA Warehouse</b>
            </Label>
          </Col>
          <Col>
            <Input type="text" id="eta-warehouse" placeholder="DD/MM/YYYY" onChange={inputHandle} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Input
              type="text"
              id="eta-warehouse-days"
              placeholder="+3 Days"
              onChange={inputHandle}
            />
          </Col>
          <Col>
            <Label style={{ marginLeft: '10px', marginTop: '5px' }}>
              <b>from ETA at Port</b>
            </Label>
          </Col>
        </Row>
      </Col>
    </Row>
    <Row className="master-detail-data-row">
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

export default ImporterDetail;
