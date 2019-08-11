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
import { EditShipment } from '../service/shipment/shipment';
import { GetDiffDay, AddDay } from '../utils/date';

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
  const [etaDayDiff, setETADayDiff] = useState(0);

  useEffect(() => {}, [masterData, shipmentStatus, etaDayDiff]);

  const toggle = () => {
    setModal(!modal);
  };

  useImperativeHandle(ref, () => ({
    triggerMasterDetail(data, status) {
      setShipmentStatus(status);
      setMasterData({ ...data });
      if (
        data.ConsigneeETAWarehouseDate === undefined ||
        data.ConsigneeETAPortDate === '' ||
        data.ConsigneeETAWarehouseDate === undefined ||
        data.ConsigneeETAPortDate === ''
      ) {
        setETADayDiff(0);
      } else {
        setETADayDiff(
          GetDiffDay(
            data.ConsigneeETAWarehouseDate.seconds * 1000,
            data.ConsigneeETAPortDate.seconds * 1000
          )
        );
      }
      toggle();
    }
  }));

  const handleStatusSelectChange = select => {
    setShipmentStatus(select.value.status);
    EditShipment(shipmentKey, { ShipmentStatus: select.value.status });
  };

  const calWarehouseETA = (data, diffDay) => {
    const d = data;
    const calETA = AddDay(masterData.ConsigneeETAPortDate.seconds * 1000, diffDay);
    d.ConsigneeETAWarehouseDate = { seconds: +calETA / 1000 };
    setMasterData(d);
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
        if (value) {
          calWarehouseETA(newMasterData, value);
        }
        setETADayDiff(value);
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
    const diff = GetDiffDay(etd1, etd2);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(diff)) {
      setETADayDiff(0);
    } else {
      setETADayDiff(diff);
    }
  };

  const handleETAWarehouseInputChange = date => {
    const newMasterData = { ...masterData };
    try {
      if (date !== null) {
        newMasterData.ConsigneeETAWarehouseDate = { seconds: date.getTime() / 1000 };
        setETADaysDiff(date.getTime(), newMasterData.ConsigneeETAPortDate.seconds * 1000);
      } else {
        newMasterData.ConsigneeETAWarehouseDate = null;
        setETADaysDiff(0, 0);
      }
    } catch (e) {
      setETADaysDiff(0, 0);
    }
    setMasterData(newMasterData);
  };

  const handleETAPortInputChange = date => {
    const newMasterData = { ...masterData };
    try {
      if (date !== null) {
        newMasterData.ConsigneeETAPortDate = { seconds: date.getTime() / 1000 };
        setETADaysDiff(newMasterData.ConsigneeETAWarehouseDate.seconds * 1000, date.getTime());
      } else {
        newMasterData.ConsigneeETAPortDate = null;
        setETADaysDiff(0, 0);
      }
    } catch (e) {
      setETADaysDiff(0, 0);
    }
    setMasterData(newMasterData);
  };

  const handleETDInputChange = date => {
    const newMasterData = { ...masterData };
    if (date !== null) {
      newMasterData.ShipperETDDate = { seconds: date.getTime() / 1000 };
    } else {
      newMasterData.ShipperETDDate = null;
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

  const setDefaultStatusOptions = defaultStatus =>
    statusOptions.find(option => option.value.status === defaultStatus);

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
                defaultValue={setDefaultStatusOptions(shipmentStatus)}
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
              company={masterData.ShipperCompanyName}
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
                masterData.ShipperETDDate === undefined ||
                masterData.ShipperETDDate === null ||
                masterData.ShipperETDDate === ''
                  ? null
                  : new Date(masterData.ShipperETDDate.seconds * 1000)
              }
              etdHandle={handleETDInputChange}
            />
            <ImporterDetail
              company={masterData.ConsigneeCompanyName}
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
                masterData.ConsigneeETAWarehouseDate === undefined ||
                masterData.ConsigneeETAWarehouseDate === null ||
                masterData.ConsigneeETAWarehouseDate === ''
                  ? null
                  : new Date(masterData.ConsigneeETAWarehouseDate.seconds * 1000)
              }
              etaPort={
                masterData.ConsigneeETAPortDate === undefined ||
                masterData.ConsigneeETAPortDate === null ||
                masterData.ConsigneeETAPortDate === ''
                  ? null
                  : new Date(masterData.ConsigneeETAPortDate.seconds * 1000)
              }
              etd={
                masterData.ShipperETDDate === undefined ||
                masterData.ShipperETDDate === null ||
                masterData.ShipperETDDate === ''
                  ? null
                  : new Date(masterData.ShipperETDDate.seconds * 1000)
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
