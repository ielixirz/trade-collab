/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
/* as it is component */
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Button, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';

const ConfirmPopup = forwardRef((props, ref) => {
  const [modal, setModal] = useState(false);
  const [header, setHeader] = useState(undefined);
  const [message, setMessage] = useState(undefined);
  const [callback, setCallback] = useState(undefined);

  const toggle = () => {
    setModal(!modal);
  };

  const ok = () => {
    toggle();
    callback(true);
  };

  const cancel = () => {
    toggle();
    callback(false);
  };

  useImperativeHandle(ref, () => ({
    triggerError(msg, head, cb) {
      setMessage(msg);
      setHeader(head);
      setCallback(() => cb);
      toggle();
    },
  }));

  const renderHeader = () => header;

  const yesStyle = {
    color: 'white',
    backgroundColor: '#16a085',
  };

  const noStyle = {
    backgroundColor: 'white',
    color: '#16a085',
    borderColor: '#16a085',
  };

  return (
    <Modal isOpen={modal} fade={false} toggle={toggle} className="upload-modal">
      <ModalHeader toggle={toggle} style={{ border: 'none' }}>
        <b>{renderHeader()}</b>
      </ModalHeader>
      <ModalBody>{message}</ModalBody>
      <ModalFooter style={{ border: 'none' }}>
        <Button color="primary" onClick={ok} style={yesStyle}>
          Yes
        </Button>
        <Button color="warning" onClick={cancel} style={noStyle}>
          No
        </Button>
      </ModalFooter>
    </Modal>
  );
});

export default ConfirmPopup;
