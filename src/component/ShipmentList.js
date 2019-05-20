/* eslint-disable filenames/match-regex */
/* as it is component */
import React, { useContext, useRef } from 'react';
import {
  ListGroup, ListGroupItem, Row, Col, Button,
} from 'reactstrap';
import shipmentListContext from '../context/shipmentContext';
import MasterDetailModal from './MasterDetailModal';

const shipmentListGroupStyle = {
  height: '65vh',
  overflow: 'scroll',
};

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
        <ListGroup onClick={preventParentCollapse} flush key={s.id} style={shipmentListGroupStyle}>
          <ListGroupItem tag="a" style={{ borderBottom: 0 }}>
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
              <Col xs="2" />
              <Col xs="10" className="master-detail-col-panel first">
                <small>Shipper</small>
                <br />
                <b>{s.shipper}</b>
              </Col>
            </Row>
            <Row>
              <Col xs="2">
                <i className="cui-location-pin" style={{ fontSize: '30px' }} />
              </Col>
              <Col xs="10" className="master-detail-col-panel">
                Laemchabang, Thailand
                <br />
                <b>Port ETD 27 Jan 2019</b>
              </Col>
            </Row>
            <Row>
              <Col xs="2" className="master-detail-col-panel line">
                <div className="master-detail-panel-connect-line outer">
                  <div className="master-detail-panel-connect-line inner" />
                </div>
              </Col>
              <Col xs="10" className="master-detail-col-panel line" />
            </Row>
            <Row>
              <Col xs="2">
                <i className="fa fa-ship" style={{ fontSize: '25px' }} />
              </Col>
              <Col xs="10" className="master-detail-col-panel">
                <b>Shipping</b>
                <br />
                ONE Network
              </Col>
            </Row>
            <Row>
              <Col xs="2" className="master-detail-col-panel line">
                <div className="master-detail-panel-connect-line outer">
                  <div className="master-detail-panel-connect-line inner" />
                </div>
              </Col>
              <Col xs="10" className="master-detail-col-panel line" />
            </Row>
            <Row>
              <Col xs="2">
                <i className="cui-location-pin" style={{ fontSize: '30px' }} />
              </Col>
              <Col xs="10" className="master-detail-col-panel">
                <small>Consignee</small>
                <br />
                <b>{s.consignee}</b>
              </Col>
            </Row>
            <Row>
              <Col xs="2" />
              <Col xs="10" className="master-detail-col-panel">
                Rotterdam, Natherlands
                <br />
                <b>Port ETD 27 Feb 2019</b>
                <br />
                <b>Warehouse 30 Feb 2019</b>
                {' '}
+3 Days from ETA at Port
              </Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem disabled tag="a" style={{ borderTop: 0 }}>
            <Row>
              <Col xs="11">
                <b>Price, Description of Goods</b>
              </Col>
            </Row>
            <Row>
              <Col xs="11" className="text-left">
                Coconut 20 pallets 5 USD
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
        </ListGroup>
      ))}
    </div>
  );
}
