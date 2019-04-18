/* eslint-disable filenames/match-regex */
/* as it is component */
import React, {
  useState, forwardRef, useRef, useImperativeHandle,
} from 'react';
import {
  Input, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';

import { PutFile, GetMetaDataFromStorageRefPath, GetURLFromStorageRefPath } from '../service/storage/managestorage';
import { EditChatRoomFileLink } from '../service/chat/chat';

import { CreateShipmentFile } from '../service/shipment/shipment';


const UploadModal = forwardRef((chatFile, sendMessage, ref) => {
  const [modal, setModal] = useState(false);
  const [fileName, setFileName] = useState('-');
  const [file, setFile] = useState(null);
  const [shipmentKey, setShipmentKey] = useState(null);
  const [chatRoomKey, setChatRoomKey] = useState(null);
  const [message, setMessage] = useState('');

  const messageRef = useRef();

  const toggle = () => {
    setModal(!modal);
  };

  useImperativeHandle(ref, () => ({

    // eslint-disable-next-line no-shadow
    triggerUploading(file, shipmentKey, chatRoomKey) {
      console.log(file);
      if (file !== undefined) {
        setFileName(file.name);
        setFile(file);
      }
      setChatRoomKey(chatRoomKey);
      setShipmentKey(shipmentKey);
      toggle();
    },

  }));

  const upload = () => {
    if (file !== null) {
      const storageRefPath = `/Shipment/${shipmentKey}/${new Date().valueOf()}${fileName}`;
      PutFile(storageRefPath, file).subscribe({
        next: () => { console.log('TODO: UPLOAD PROGRESS'); },
        error: (err) => {
          console.log(err);
          alert(err.message);
        },
        complete: () => {
          GetMetaDataFromStorageRefPath(storageRefPath)
            .subscribe({
              next: (metaData) => {
                CreateShipmentFile(shipmentKey,
                  {
                    FileName: metaData.name,
                    FileUrl: metaData.fullPath,
                    FileCreateTimestamp: metaData.timeCreated,
                    FileOwnerKey: 'mockKey',
                    FileStorgeReference: metaData.fullPath,
                  });

                GetURLFromStorageRefPath(metaData.ref).subscribe({
                  next: (url) => {
                    const editedChatFile = chatFile;
                    editedChatFile.push(
                      {
                        FileName: fileName,
                        FileUrl: url,
                        FileCreateTimestamp: metaData.timeCreated,
                        FilePath: metaData.fullPath,
                      },
                    );
                    EditChatRoomFileLink(shipmentKey, chatRoomKey, editedChatFile);
                  },
                  error: (err) => {
                    console.log(err);
                    alert(err.message);
                  },
                  complete: () => { 'TO DO LOG'; },
                });
              },
              error: (err) => {
                console.log(err);
                alert(err.message);
              },
              complete: () => { 'TO DO LOG'; },
            });
        },
      });
    }
    toggle();
    sendMessage(chatRoomKey, shipmentKey, `${message} [ ${fileName} ]`);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <Modal isOpen={modal} toggle={toggle} className="upload-modal">
      <ModalHeader toggle={toggle}><b>Upload a file</b></ModalHeader>
      <ModalBody>
        <Input
          type="textarea"
          name="textarea-input"
          id="textarea-input"
          rows="9"
          placeholder="Add a message about the file"
          ref={messageRef}
          value={message}
          onChange={handleMessageChange}
        />
        <Label htmlFor="filename" style={{ marginTop: '0.5rem' }}><b>File name</b></Label>
        <Input
          type="text"
          id="filename"
          placeholder=""
          disabled
          value={fileName}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={upload}>Upload</Button>
        {' '}
      </ModalFooter>
    </Modal>
  );
});

export default UploadModal;
