/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
/* as it is component */
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Button, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';

const ConfirmPopup = forwardRef((props, ref) => {
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
    },
  }));

  const renderBody = () => {
    switch (level) {
      case 'ERROR':
        return 'An Error Occured.';
      case 'WARN':
        return 'Warning';
      default:
        return 'UNHANDLED';
    }
  };

  return (
    <Modal isOpen={modal} toggle={toggle} className="upload-modal">
      <ModalHeader toggle={toggle}>
        <b>{renderBody}</b>
      </ModalHeader>
      <ModalBody>{message}</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle}>
          OK
        </Button>
      </ModalFooter>
    </Modal>
  );
});

export default ConfirmPopup;
