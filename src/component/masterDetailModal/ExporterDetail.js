/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React from 'react';
import {
  Row, Col, Input, Label,
} from 'reactstrap';
import DatePicker from 'react-date-picker';

const ExporterDetail = ({
  inputHandle, etdHandle, company, port, country, etd,
}) => (
  <React.Fragment>
    <Row className="master-detail-data-row">
      <span className="master-detail-heading-label">
        <b>Exporter</b>
      </span>
    </Row>
    <Row className="master-detail-data-row">
      <Label htmlFor="company-exporter-name">
        <b>Company Name</b>
      </Label>
      <Input
        type="text"
        id="company-exporter-name"
        placeholder="Example Co., Ltd."
        onChange={inputHandle}
        value={company}
      />
    </Row>
    <Row className="master-detail-data-row">
      <Label htmlFor="etd" style={{ marginRight: '10px' }}>
        <b>ETD</b>
      </Label>
      <DatePicker id="eta-port" onChange={etdHandle} value={etd === undefined ? new Date() : etd} />
    </Row>
    <Row className="master-detail-data-row last">
      <Col>
        <Label htmlFor="port">
          <b>Port</b>
        </Label>
        <Input type="text" id="port" placeholder="Port" onChange={inputHandle} value={port} />
      </Col>
      <Col style={{ marginLeft: '5px' }}>
        <Label htmlFor="country">
          <b>Country</b>
        </Label>
        <Input
          type="text"
          id="country"
          placeholder="Country"
          onChange={inputHandle}
          value={country}
        />
      </Col>
    </Row>
  </React.Fragment>
);

export default ExporterDetail;
