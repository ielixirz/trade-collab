/* eslint-disable filenames/match-regex */
/* as it is component */
import React, {
  useContext, useRef, useEffect, useState,
} from 'react';
import {
  ListGroup, ListGroupItem, Row, Col, Button,
} from 'reactstrap';
import moment from 'moment';
import ShipmentContext from '../context/ShipmentContext';
import MasterDetailModal from './MasterDetailModal';

import { GetMasterDataChatRoom } from '../service/masterdata/masterdata';
import { GetDiffDay } from '../utils/date';

const shipmentListGroupStyle = {
  height: '65vh',
  overflow: 'scroll',
};

const ShipmentList = () => {
  const { chatroomKey, shipmentKey, mainData } = useContext(ShipmentContext);
  const [masterData, setMasterData] = useState(undefined);
  const [lastUpdate, setLastUpdate] = useState(undefined);
  const masterDetailModalRef = useRef(null);

  useEffect(() => {
    GetMasterDataChatRoom(shipmentKey, chatroomKey).subscribe((doc) => {
      const data = doc[0].data();
      setMasterData([data]);
    });
  }, [lastUpdate]);

  const updateLastUpdate = (lastUpdateData) => {
    setLastUpdate(lastUpdateData);
  };

  const preventParentCollapse = (e) => {
    e.stopPropagation();
  };

  return (
    <div>
      <MasterDetailModal ref={masterDetailModalRef} lastUpdate={updateLastUpdate} />
      {masterData === undefined
        ? ''
        : masterData.map(data => (
          <ListGroup onClick={preventParentCollapse} flush style={shipmentListGroupStyle}>
            <ListGroupItem tag="a" style={{ borderBottom: 0 }}>
              <Row style={{ float: 'right' }}>
                <Col>
                  <Button
                    className="master-detail-btn edit"
                    onClick={() => masterDetailModalRef.current.triggerMasterDetail(data)}
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
                  <b>
                    {data.ShipperCompanyName === '' || data.ShipperCompanyName === undefined ? (
                      <span style={{ color: '#B3B3B3' }}>Unassigned</span>
                    ) : (
                      data.ShipperCompanyName
                    )}
                  </b>
                </Col>
              </Row>
              <Row>
                <Col xs="2">
                  <i className="cui-location-pin" style={{ fontSize: '30px' }} />
                </Col>
                <Col xs="10" className="master-detail-col-panel">
                  {data.ShipperPort === undefined || data.ShipperPort === '' ? (
                    <span style={{ color: '#B3B3B3' }}>Port</span>
                  ) : (
                    data.ShipperPort
                  )}
                  {' , '}
                  {data.ShipperCountry === undefined || data.ShipperCountry === '' ? (
                    <span style={{ color: '#B3B3B3' }}>Country</span>
                  ) : (
                    data.ShipperCountry
                  )}
                  <br />
                  <b>
                    {data.ShipperETDDate === null ? (
                      <span style={{ color: '#B3B3B3' }}>Est. Time of Departure from Port</span>
                    ) : (
                      `Port ETD: ${moment(data.ShipperETDDate.seconds * 1000).format(
                        'DD MMM YYYY',
                      )}`
                    )}
                  </b>
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
                  <b>Shipping Line</b>
                  <br />
                  {data.ShipmentDetailShippingLine === undefined || ''
                    ? ''
                    : data.ShipmentDetailShippingLine}
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
                  <b>
                    {data.ConsigneeCompanyName === '' ? (
                      <span style={{ color: '#B3B3B3' }}>Unassigned</span>
                    ) : (
                      data.ConsigneeCompanyName
                    )}
                  </b>
                </Col>
              </Row>
              <Row>
                <Col xs="2" />
                <Col xs="10" className="master-detail-col-panel">
                  {data.ConsigneePort === undefined || data.ConsigneePort === '' ? (
                    <span style={{ color: '#B3B3B3' }}>Port</span>
                  ) : (
                    data.ConsigneePort
                  )}
                  {' , '}
                  {data.ConsigneeCountry === undefined || data.ConsigneeCountry === '' ? (
                    <span style={{ color: '#B3B3B3' }}>Country</span>
                  ) : (
                    data.ConsigneeCountry
                  )}
                  <br />
                  <b>
                    {data.ConsigneeETAPortDate === null ? (
                      <span style={{ color: '#B3B3B3' }}>Est. Time of Arrive to Port</span>
                    ) : (
                      `Port ETA: ${moment(data.ConsigneeETAPortDate.seconds * 1000).format(
                        'DD MMM YYYY',
                      )}`
                    )}
                  </b>
                  <br />
                  <b>
                    {data.ConsigneeETAWarehouseDate === null ? (
                      <span style={{ color: '#B3B3B3' }}>Est. Time of Arrive to Warehouse</span>
                    ) : (
                      `Warehouse ETA: ${moment(
                        data.ConsigneeETAWarehouseDate.seconds * 1000,
                      ).format('DD MMM YYYY')}`
                    )}
                  </b>
                  {' '}
                  {data.ShipperETDDate === null
                    || data.ConsigneeETAPortDate === null
                    || data.ConsigneeETAWarehouseDate === null
                    ? ''
                    : `+${GetDiffDay(
                      data.ConsigneeETAWarehouseDate.seconds * 1000,
                      data.ConsigneeETAPortDate.seconds * 1000,
                    )} Days from ETA at Port`}
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
                  {data.ShipmentDetailPriceDescriptionOfGoods === undefined
                    || data.ShipmentDetailPriceDescriptionOfGoods === ''
                    ? '-'
                    : data.ShipmentDetailPriceDescriptionOfGoods}
                </Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem disabled tag="a">
              <Row>
                <Col xs="6">
                  <b>Product</b>
                </Col>
                <Col xs="6" className="text-right">
                  {data.ShipmentDetailProduct === undefined || data.ShipmentDetailProduct === ''
                    ? '-'
                    : data.ShipmentDetailProduct}
                </Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem disabled tag="a">
              <Row>
                <Col xs="6">
                  <b>Container No.</b>
                </Col>
                <Col xs="6" className="text-right">
                  {data.ShipmentDetailContainerNumber === undefined
                    || data.ShipmentDetailContainerNumber === ''
                    ? '-'
                    : data.ShipmentDetailContainerNumber}
                </Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem disabled tag="a">
              <Row>
                <Col xs="6">
                  <b>Bill of Landing No.</b>
                </Col>
                <Col xs="6" className="text-right">
                  {data.ShipmentDetailBillOfLandingNunber === undefined
                    || data.ShipmentDetailBillOfLandingNunber === ''
                    ? '-'
                    : data.ShipmentDetailBillOfLandingNunber}
                </Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem disabled tag="a">
              <Row>
                <Col xs="6">
                  <b>Original Docs.Tracking No.</b>
                </Col>
                <Col xs="6" className="text-right">
                  {data.ShipmentDetailOriginalDocumentTrackingNumber === undefined
                    || data.ShipmentDetailOriginalDocumentTrackingNumber === ''
                    ? '-'
                    : data.ShipmentDetailOriginalDocumentTrackingNumber}
                </Col>
              </Row>
            </ListGroupItem>
          </ListGroup>
        ))}
    </div>
  );
};

export default ShipmentList;
