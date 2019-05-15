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

  return (
    <Modal isOpen={modal} toggle={toggle} className="master-detail-modal">
      <ModalHeader toggle={toggle} style={{ border: 'none' }}>
        <h2>
          <b>Shipment Update: </b>
        </h2>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col>
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
          </Col>
          <Col>
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter style={{ border: 'none' }}>
        <Button className="master-detail-btn save" style={{ margin: 'auto' }} color="primary">
          Save
        </Button>
        {' '}
      </ModalFooter>
    </Modal>
  );
});

export default MasterDetailModal;
