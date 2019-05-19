/* eslint-disable filenames/match-regex */
/* as it is component */
import React, { useContext, useRef } from 'react';
import {
  ListGroup, ListGroupItem, Row, Col, Button,
} from 'reactstrap';
import shipmentListContext from '../context/shipmentContext';
import MasterDetailModal from './MasterDetailModal';

export default function ShipmentList() {
  const { state } = useContext(shipmentListContext);
  const masterDetailModalRef = useRef(null);

  const preventParentCollapse = (e) => {
    e.stopPropagation();
  };

  return (
    <div>
      <MasterDetailModal ref={masterDetailModalRef} />
      {state.shipmentList.map(s => (
        <ListGroup onClick={preventParentCollapse} flush key={s.id}>
          <ListGroupItem tag="a">
            <Row style={{ float: 'right' }}>
              <Col>
                <Button
                  className="master-detail-btn edit"
                  onClick={() => masterDetailModalRef.current.triggerMasterDetail()}
                >
                  <i className="cui-pencil icons" style={{ marginRight: '0.5rem' }} />
                  Edit
                </Button>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <small>Shipper</small>
                <br />
                <b>{s.shipper}</b>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <small>consignee</small>
                <br />
                <b>{s.consignee}</b>
              </Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem disabled tag="a">
            <Row>
              <Col xs="6">
                <b>Product</b>
              </Col>
              <Col xs="6" className="text-right">
                {s.product}
              </Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem disabled tag="a">
            <Row>
              <Col xs="6">
                <b>Container No.</b>
              </Col>
              <Col xs="6" className="text-right">
                {s.container}
              </Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem disabled tag="a">
            <Row>
              <Col xs="6">
                <b>Bill of Landing No.</b>
              </Col>
              <Col xs="6" className="text-right">
                {s.bill}
              </Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem disabled tag="a">
            <Row>
              <Col xs="6">
                <b>Original Docs.Tracking No.</b>
              </Col>
              <Col xs="6" className="text-right">
                {s.track}
              </Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem disabled tag="a">
            <Row>
              <Col xs="2">
                <b>Note</b>
              </Col>
              <Col xs="8">{s.note}</Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      ))}
    </div>
  );
}
