/* eslint-disable filenames/match-regex */
/* as it is component */
import React, {
  useState, forwardRef, useImperativeHandle, useEffect,
} from 'react';
import {
  Row,
  Col,
  Input,
  Label,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
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
  option: (styles, {
    data, isDisabled, isFocused, isSelected,
  }) => ({
    ...styles,
    color: '#16A085',
  }),
  input: styles => ({ ...styles, color: '#16A085' }),
  singleValue: styles => ({ ...styles, color: '#16A085' }),
};

const MasterDetailModal = forwardRef((props, ref) => {
  const [modal, setModal] = useState(false);

  useEffect(() => {}, []);

  const toggle = () => {
    setModal(!modal);
  };

  useImperativeHandle(ref, () => ({
    triggerMasterDetail() {
      toggle();
    },
  }));

  const handleStatusSelectChange = (value) => {
    console.log(value);
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
            <ExporterDetail />
            <ImporterDetail />
          </Col>
          <Col xs="5">
            <OtherDetail />
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
