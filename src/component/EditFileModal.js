/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
/* as it is component */
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Input, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { EditChatRoomFileLink } from '../service/chat/chat';

const EditFileModal = forwardRef((props, ref) => {
  const [modal, setModal] = useState(false);
  const [fileName, setFileName] = useState('-');
  const [chatFile, setChatFile] = useState(null);
  const [editedFileName, setEditedFileName] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const toggle = () => {
    setModal(!modal);
  };

  const handleInputFileNameChange = event => {
    setEditedFileName(event.target.value);
  };

  const edit = () => {
    const editedChatRoomFileLink = chatFile;
    editedChatRoomFileLink[editIndex].FileName = editedFileName;
    EditChatRoomFileLink(props.shipmentKey, props.chatroomKey, editedChatRoomFileLink);
    toggle();
  };

  useImperativeHandle(ref, () => ({
    // eslint-disable-next-line no-shadow
    triggerEditing(editIndex, chatFile) {
      setFileName(chatFile[editIndex].FileName);
      setEditIndex(editIndex);
      setChatFile(chatFile);
      toggle();
    }
  }));

  return (
    <Modal isOpen={modal} toggle={toggle} className="upload-modal">
      <ModalHeader toggle={toggle}>
        <b>Rename a file</b>
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
        </Button>{' '}
      </ModalFooter>
    </Modal>
  );
});

export default EditFileModal;
