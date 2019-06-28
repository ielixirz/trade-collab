/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
/* as it is component */
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Button, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';

const ErrorPopup = forwardRef((props, ref) => {
  const [modal, setModal] = useState(false);
  const [level, setLevel] = useState(undefined);
  const [message, setMessage] = useState(undefined);

  const toggle = () => {
    setModal(!modal);
  };

  useImperativeHandle(ref, () => ({
    triggerError(msg, lv) {
      setMessage(msg);
      setLevel(lv);
      toggle();
    },
  }));

  const renderHeader = (lv) => {
    switch (lv) {
      case 'ERROR':
        return 'An Error Occured.';
      case 'WARN':
        return 'Warning';
      default:
        return 'UNHANDLED';
    }
  };

  return (
    <Modal isOpen={modal} fade={false} toggle={toggle} className="upload-modal">
      <ModalHeader toggle={toggle}>
        <b>{renderHeader(level)}</b>
      </ModalHeader>
      <ModalBody>{message}</ModalBody>
      <ModalFooter>
        <Button color="warning" onClick={toggle}>
          OK
        </Button>
      </ModalFooter>
    </Modal>
  );
});

export default ErrorPopup;
