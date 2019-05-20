/* eslint-disable prefer-destructuring */
/* eslint-disable filenames/match-regex */
/* as it is component */
import React, {
  useState, forwardRef, useImperativeHandle, useEffect,
} from 'react';
import {
  Row, Col, Button, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import Select from 'react-select';
import ExporterDetail from './masterDetailModal/ExporterDetail';
import ImporterDetail from './masterDetailModal/ImporterDetail';
import OtherDetail from './masterDetailModal/OtherDetail';

const statusOptions = [
  {
    value: {
      status: 'In Transit',
    },
    label: 'In Transit',
  },
  {
    value: {
      status: 'Planning',
    },
    label: 'Planning',
  },
  {
    value: {
      status: 'Order Confirmed',
    },
    label: 'Order Confirmed',
  },
  {
    value: {
      status: 'Delayed',
    },
    label: 'Delayed',
  },
  {
    value: {
      status: 'Delivered',
    },
    label: 'Delivered',
  },
  {
    value: {
      status: 'Cancelled',
    },
    label: 'Cancelled',
  },
  {
    value: {
      status: 'Completed',
    },
    label: 'Completed',
  },
];

const statusStyle = {
  option: styles => ({
    ...styles,
    color: '#16A085',
  }),
  input: styles => ({ ...styles, color: '#16A085' }),
  singleValue: styles => ({ ...styles, color: '#16A085' }),
};

const MasterDetailModal = forwardRef((props, ref) => {
  const [modal, setModal] = useState(false);
  const [companyExporter, setCompanyExporter] = useState(null);
  const [portExporter, setPortExporter] = useState(null);
  const [countryExporter, setCountryExporter] = useState(null);
  const [companyImporter, setCompanyImporter] = useState(null);
  const [wareHouseETADays, setWareHouseETADays] = useState(null);
  const [portImporter, setPortImporter] = useState(null);
  const [countryImporter, setCountryImporter] = useState(null);
  const [shippingLine, setShippingLine] = useState(null);
  const [priceDesc, setPriceDesc] = useState(null);
  const [product, setProduct] = useState(null);
  const [billNo, setBillNo] = useState(null);
  const [containerNo, setContainerNo] = useState(null);
  const [originalDoc, setOriginalDoc] = useState(null);
  const [ETAWarehouse, setETAWarehouse] = useState(new Date());
  const [ETAPort, setETAPort] = useState(new Date());
  const [ETD, setETD] = useState(new Date());
  const [shipmentStatus, setShipmentStatus] = useState(null);

  useEffect(() => {}, [
    companyExporter,
    portExporter,
    countryExporter,
    companyImporter,
    wareHouseETADays,
    portImporter,
    countryImporter,
    shippingLine,
    priceDesc,
    product,
    billNo,
    containerNo,
    originalDoc,
    shipmentStatus,
    ETAWarehouse,
    ETAPort,
    ETD,
  ]);

  const toggle = () => {
    setModal(!modal);
  };

  useImperativeHandle(ref, () => ({
    triggerMasterDetail() {
      toggle();
    },
  }));

  const handleStatusSelectChange = (select) => {
    setShipmentStatus(select.value.status);
  };

  const handleDetailInputChange = (event) => {
    const field = event.target.id;
    const value = event.target.value;
    switch (field) {
      case 'company-exporter-name':
        setCompanyExporter(value);
        break;
      case 'port-expoter':
        setPortExporter(value);
        break;
      case 'country-exporter':
        setCountryExporter(value);
        break;
      case 'company-importer-name':
        setCompanyImporter(value);
        break;
      case 'eta-warehouse-days':
        setWareHouseETADays(value);
        break;
      case 'port-importer':
        setPortImporter(value);
        break;
      case 'country-importer':
        setCountryImporter(value);
        break;
      case 'shipping-line':
        setShippingLine(value);
        break;
      case 'price-desc':
        setPriceDesc(value);
        break;
      case 'product':
        setProduct(value);
        break;
      case 'bill-no':
        setBillNo(value);
        break;
      case 'container-no':
        setContainerNo(value);
        break;
      case 'original-doc':
        setOriginalDoc(value);
        break;
      default:
        break;
    }
  };

  const handleETAWarehouseInputChange = (date) => {
    setETAWarehouse(date);
  };

  const handleETAPortInputChange = (date) => {
    setETAPort(date);
  };

  const handleETDInputChange = (date) => {
    setETD(date);
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
              company={companyExporter}
              port={portExporter}
              country={countryExporter}
              inputHandle={handleDetailInputChange}
              etd={ETD}
              etdHandle={handleETDInputChange}
            />
            <ImporterDetail
              company={companyImporter}
              etaDays={wareHouseETADays}
              port={portImporter}
              country={countryImporter}
              etaWarehouse={ETAWarehouse}
              etaPort={ETAPort}
              inputHandle={handleDetailInputChange}
              etaWarehouseHandle={handleETAWarehouseInputChange}
              etaPortHandle={handleETAPortInputChange}
            />
          </Col>
          <Col xs="5">
            <OtherDetail
              shipping={shippingLine}
              price={priceDesc}
              product={product}
              bill={billNo}
              container={containerNo}
              originalDoc={originalDoc}
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
        >
          <b>Save</b>
        </Button>
      </ModalFooter>
    </Modal>
  );
});

export default MasterDetailModal;
