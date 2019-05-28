/* eslint-disable react/prop-types */
/* eslint-disable prefer-destructuring */
/* eslint-disable filenames/match-regex */
/* as it is component */
import React, { useContext, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Row, Col, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Select from 'react-select';
import ShipmentContext from '../context/ShipmentContext';
import ExporterDetail from './masterDetailModal/ExporterDetail';
import ImporterDetail from './masterDetailModal/ImporterDetail';
import OtherDetail from './masterDetailModal/OtherDetail';

import { UpdateMasterData } from '../service/masterdata/masterdata';
import { GetDiffDay } from '../utils/date';

const statusOptions = [
  {
    value: {
      status: 'In Transit'
    },
    label: 'In Transit'
  },
  {
    value: {
      status: 'Planning'
    },
    label: 'Planning'
  },
  {
    value: {
      status: 'Order Confirmed'
    },
    label: 'Order Confirmed'
  },
  {
    value: {
      status: 'Delayed'
    },
    label: 'Delayed'
  },
  {
    value: {
      status: 'Delivered'
    },
    label: 'Delivered'
  },
  {
    value: {
      status: 'Cancelled'
    },
    label: 'Cancelled'
  },
  {
    value: {
      status: 'Completed'
    },
    label: 'Completed'
  }
];

const statusStyle = {
  option: styles => ({
    ...styles,
    color: '#16A085'
  }),
  input: styles => ({ ...styles, color: '#16A085' }),
  singleValue: styles => ({ ...styles, color: '#16A085' })
};

const MasterDetailModal = forwardRef((props, ref) => {
  const { userKey, shipmentKey } = useContext(ShipmentContext);
  const [modal, setModal] = useState(false);
  const [masterData, setMasterData] = useState({});
  const [shipmentStatus, setShipmentStatus] = useState(null);
  const [etaDayDiff, setETADayDiff] = useState(undefined);

  useEffect(() => {}, [masterData, shipmentStatus, etaDayDiff]);

  const toggle = () => {
    setModal(!modal);
  };

  useImperativeHandle(ref, () => ({
    triggerMasterDetail(data) {
      setMasterData({ ...data });
      setETADayDiff(
        GetDiffDay(data.ConsigneeETAWarehouse.seconds * 1000, data.ConsigneeETAPort.seconds * 1000)
      );
      toggle();
    }
  }));

  const handleStatusSelectChange = select => {
    setShipmentStatus(select.value.status);
  };

  const handleDetailInputChange = event => {
    const newMasterData = { ...masterData };
    const field = event.target.id;
    const value = event.target.value;
    switch (field) {
      case 'company-exporter-name':
        newMasterData.ShipperCompanyName = value;
        break;
      case 'port-expoter':
        newMasterData.ShipperPort = value;
        break;
      case 'country-exporter':
        newMasterData.ShipperCountry = value;
        break;
      case 'company-importer-name':
        newMasterData.ConsigneeCompanyName = value;
        break;
      case 'eta-warehouse-days':
        // TO-DO Calculation
        break;
      case 'port-importer':
        newMasterData.ConsigneePort = value;
        break;
      case 'country-importer':
        newMasterData.ConsigneeCountry = value;
        break;
      case 'shipping-line':
        newMasterData.ShipmentDetailShippingLine = value;
        break;
      case 'price-desc':
        newMasterData.ShipmentDetailPriceDescriptionOfGoods = value;
        break;
      case 'product':
        newMasterData.ShipmentDetailProduct = value;
        break;
      case 'bill-no':
        newMasterData.ShipmentDetailBillOfLandingNunber = value;
        break;
      case 'container-no':
        newMasterData.ShipmentDetailContainerNumber = value;
        break;
      case 'original-doc':
        newMasterData.ShipmentDetailOriginalDocumentTrackingNumber = value;
        break;
      default:
        break;
    }
    setMasterData(newMasterData);
  };

  const setETADaysDiff = (etd1, etd2) => {
    setETADayDiff(GetDiffDay(etd1, etd2));
  };

  const handleETAWarehouseInputChange = date => {
    const newMasterData = { ...masterData };
    try {
      if (date !== null) {
        newMasterData.ConsigneeETAWarehouse = { seconds: date.getTime() / 1000 };
        setETADaysDiff(date.getTime(), newMasterData.ConsigneeETAPort.seconds * 1000);
      } else {
        newMasterData.ConsigneeETAWarehouse = null;
        setETADaysDiff(undefined);
      }
    } catch (e) {
      setETADaysDiff(undefined);
    }
    setMasterData(newMasterData);
  };

  const handleETAPortInputChange = date => {
    const newMasterData = { ...masterData };
    try {
      if (date !== null) {
        newMasterData.ConsigneeETAPort = { seconds: date.getTime() / 1000 };
        setETADaysDiff(newMasterData.ConsigneeETAWarehouse.seconds * 1000, date.getTime());
      } else {
        newMasterData.ConsigneeETAPort = null;
        setETADaysDiff(undefined);
      }
    } catch (e) {
      setETADaysDiff(undefined);
    }
    setMasterData(newMasterData);
  };

  const handleETDInputChange = date => {
    const newMasterData = { ...masterData };
    if (date !== null) {
      newMasterData.ShipperETD = { seconds: date.getTime() / 1000 };
    } else {
      newMasterData.ShipperETD = null;
    }
    setMasterData(newMasterData);
  };

  const save = () => {
    UpdateMasterData(shipmentKey, 'DefaultTemplate', masterData).subscribe(() => {
      props.lastUpdate({
        timestamp: new Date(),
        updaterKey: userKey
      });
      toggle();
    });
  };

  return (
    <Modal isOpen={modal} toggle={toggle} className="master-detail-modal modal-lg">
      <ModalHeader
        className="master-detail-header"
        toggle={toggle}
        style={{ border: 'none', width: '100%' }}
      >
        <h2>
          <Row>
            <Col xs="4" style={{ paddingLeft: 0 }}>
              <span style={{ float: 'right', marginTop: '5px' }}>
                <b>Shipment Update: </b>
              </span>
            </Col>
            <Col xs="6">
              <Select
                onChange={handleStatusSelectChange}
                name="company"
                id="master-detail-status-select"
                options={statusOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={statusStyle}
              />
            </Col>
          </Row>
        </h2>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col xs="6">
            <ExporterDetail
              company={
                masterData.ShipperCompanyName === undefined || masterData.ShipperCompanyName === ''
                  ? 'Unassigned'
                  : masterData.ShipperCompanyName
              }
              port={
                masterData.ShipperPort === undefined || masterData.ShipperPort === ''
                  ? null
                  : masterData.ShipperPort
              }
              country={
                masterData.ShipperCountry === undefined || masterData.ShipperCountry === ''
                  ? null
                  : masterData.ShipperCountry
              }
              inputHandle={handleDetailInputChange}
              etd={
                masterData.ShipperETD === undefined || masterData.ShipperETD === null
                  ? null
                  : new Date(masterData.ShipperETD.seconds * 1000)
              }
              etdHandle={handleETDInputChange}
            />
            <ImporterDetail
              company={
                masterData.ConsigneeCompanyName === undefined ||
                masterData.ConsigneeCompanyName === ''
                  ? 'Unassigned'
                  : masterData.ConsigneeCompanyName
              }
              etaDays={etaDayDiff}
              port={
                masterData.ConsigneePort === undefined || masterData.ConsigneePort === ''
                  ? null
                  : masterData.ConsigneePort
              }
              country={
                masterData.ConsigneeCountry === undefined || masterData.ConsigneeCountry === ''
                  ? null
                  : masterData.ConsigneeCountry
              }
              etaWarehouse={
                masterData.ConsigneeETAWarehouse === undefined ||
                masterData.ConsigneeETAWarehouse === null
                  ? null
                  : new Date(masterData.ConsigneeETAWarehouse.seconds * 1000)
              }
              etaPort={
                masterData.ConsigneeETAPort === undefined || masterData.ConsigneeETAPort === null
                  ? null
                  : new Date(masterData.ConsigneeETAPort.seconds * 1000)
              }
              inputHandle={handleDetailInputChange}
              etaWarehouseHandle={handleETAWarehouseInputChange}
              etaPortHandle={handleETAPortInputChange}
            />
          </Col>
          <Col xs="5">
            <OtherDetail
              shipping={
                masterData.ShipmentDetailShippingLine === undefined ||
                masterData.ShipmentDetailShippingLine === ''
                  ? null
                  : masterData.ShipmentDetailShippingLine
              }
              price={
                masterData.ShipmentDetailPriceDescriptionOfGoods === undefined ||
                masterData.ShipmentDetailPriceDescriptionOfGoods === ''
                  ? null
                  : masterData.ShipmentDetailPriceDescriptionOfGoods
              }
              product={
                masterData.ShipmentDetailProduct === undefined ||
                masterData.ShipmentDetailProduct === ''
                  ? null
                  : masterData.ShipmentDetailProduct
              }
              bill={
                masterData.ShipmentDetailBillOfLandingNunber === undefined ||
                masterData.ShipmentDetailBillOfLandingNunber === ''
                  ? null
                  : masterData.ShipmentDetailBillOfLandingNunber
              }
              container={
                masterData.ShipmentDetailContainerNumber === undefined ||
                masterData.ShipmentDetailContainerNumber === ''
                  ? null
                  : masterData.ShipmentDetailContainerNumber
              }
              originalDoc={
                masterData.ShipmentDetailOriginalDocumentTrackingNumber === undefined ||
                masterData.ShipmentDetailOriginalDocumentTrackingNumber === ''
                  ? null
                  : masterData.ShipmentDetailOriginalDocumentTrackingNumber
              }
              inputHandle={handleDetailInputChange}
            />
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter style={{ border: 'none' }}>
        <Button
          className="master-detail-btn save"
          style={{ margin: 'auto', width: '300px' }}
          color="primary"
          onClick={save}
        >
          <b>Save</b>
        </Button>
      </ModalFooter>
    </Modal>
  );
});

export default MasterDetailModal;
