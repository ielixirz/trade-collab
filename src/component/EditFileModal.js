/* eslint-disable filenames/match-regex */
/* as it is component */
import React, {
  useState, forwardRef, useImperativeHandle, useCallback,
} from 'react';
import {
  Input, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import Select from 'react-select';
import { useMappedState } from 'redux-react-hook';
import _ from 'lodash';
import { EditChatRoomFileLink } from '../service/chat/chat';

const EditFileModal = forwardRef((props, ref) => {
  const [modal, setModal] = useState(false);
  const [fileName, setFileName] = useState('-');
  const [file, setFile] = useState(null);
  const [editedFileName, setEditedFileName] = useState('');
  const [shipmentKey, setShipmentKey] = useState(null);
  const [chatRoomKey, setChatRoomKey] = useState(null);

  const toggle = () => {
    setModal(!modal);
  };

  const handleInputFileNameChange = (event) => {
    setEditedFileName(event.target.value);
  };

  const edit = () => {
    // const editedChatRoomFileLink = _.find(file, (f) => {
    //   f.FileName === fileName;
    // });
    // EditChatRoomFileLink(shipmentKey, chatRoomKey, copiedChatRoomFileLink);
  };

  useImperativeHandle(ref, () => ({
    // eslint-disable-next-line no-shadow
    triggerEditing(chatFile, shipmentKey, chatRoomKey) {
      if (chatFile !== undefined) {
        setFileName(chatFile.FileName);
        setFile(chatFile);
      }
      setChatRoomKey(chatRoomKey);
      setShipmentKey(shipmentKey);
      toggle();
    },
  }));

  return (
    <Modal isOpen={modal} toggle={toggle} className="upload-modal">
      <ModalHeader toggle={toggle}>
        <b>Edit a file</b>
      </ModalHeader>
      <ModalBody>
        <Label htmlFor="chatroom-editFile">
          <b>New File Name</b>
        </Label>
        <Input
          type="text"
          id="chatroom-editFile"
          placeholder={fileName}
          value={editedFileName}
          onChange={handleInputFileNameChange}
        />
        <Label htmlFor="filename" style={{ marginTop: '0.5rem' }}>
          <b>Current File name</b>
        </Label>
        <Input type="text" id="filename" placeholder="" disabled value={fileName} />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={edit}>
          Edit
        </Button>
        {' '}
      </ModalFooter>
    </Modal>
  );
});

export default EditFileModal;
