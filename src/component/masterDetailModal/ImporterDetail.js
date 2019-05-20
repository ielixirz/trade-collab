/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React from 'react';
import {
  Row, Col, Input, Label,
} from 'reactstrap';
import DatePicker from 'react-date-picker';

const ImporterDetail = ({
  inputHandle,
  etaWarehouseHandle,
  etaPortHandle,
  company,
  etaDays,
  port,
  country,
  etaWarehouse,
  etaPort,
}) => (
  <React.Fragment>
    <Row className="master-detail-data-row">
      <span className="master-detail-heading-label">
        <b>Importer</b>
      </span>
    </Row>
    <Row className="master-detail-data-row">
      <Label htmlFor="company-importer-name">
        <b>Company Name</b>
      </Label>
      <Input
        type="text"
        id="company-importer-name"
        placeholder="Example Co., Ltd."
        onChange={inputHandle}
        value={company}
      />
    </Row>
    <Row className="master-detail-data-row">
      <Col xs="4" style={{ padding: 0 }}>
        <Label htmlFor="etd">
          <b>ETA at Port</b>
        </Label>
        <DatePicker id="eta-port" onChange={etaPortHandle} value={etaPort} />
      </Col>
      <Col xs="7" style={{ marginLeft: '30px' }}>
        <Row>
          <Col>
            <Label style={{ marginTop: '5px', marginRight: '10px', float: 'right' }}>
              <b>ETA Warehouse</b>
            </Label>
          </Col>
          <Col>
            <DatePicker id="eta-warehouse" onChange={etaWarehouseHandle} value={etaWarehouse} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Input
              type="text"
              id="eta-warehouse-days"
              placeholder="+3 Days"
              onChange={inputHandle}
              value={etaDays}
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
        <Input
          type="text"
          id="port-importer"
          placeholder="Port"
          onChange={inputHandle}
          value={port}
        />
      </Col>
      <Col style={{ marginLeft: '5px' }}>
        <Label htmlFor="country">
          <b>Country</b>
        </Label>
        <Input
          type="text"
          id="country-importer"
          placeholder="Country"
          onChange={inputHandle}
          value={country}
        />
      </Col>
    </Row>
  </React.Fragment>
);

export default ImporterDetail;
