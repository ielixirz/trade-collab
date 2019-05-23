/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
/* as it is component */
import React, {
  useState, forwardRef, useRef, useImperativeHandle, useEffect,
} from 'react';
import {
  Input,
  Label,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress,
  Col,
} from 'reactstrap';
import { combineLatest } from 'rxjs';
import _ from 'lodash';

import {
  PutFile,
  GetMetaDataFromStorageRefPath,
  GetURLFromStorageRefPath,
} from '../service/storage/managestorage';
import { EditChatRoomFileLink } from '../service/chat/chat';

import { CreateShipmentFile } from '../service/shipment/shipment';

const UploadModal = forwardRef((props, ref) => {
  const [modal, setModal] = useState(false);
  // const [fileName, setFileName] = useState('-');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [shipmentKey, setShipmentKey] = useState(null);
  const [chatRoomKey, setChatRoomKey] = useState(null);
  const [message, setMessage] = useState('');

  const messageRef = useRef();

  const toggle = () => {
    setModal(!modal);
  };

  const calProgress = (byteTransfer, byteTotal) => (byteTransfer / byteTotal) * 100;

  const upload = (files, sKey) => {
    setIsUploading(true);
    const uploadObs = [];
    const refPaths = [];
    _.forEach(files, (file) => {
      const storageRefPath = `/Shipment/${sKey}/${file.file.name}_${new Date().valueOf()}`;
      uploadObs.push(PutFile(storageRefPath, file.file));
      refPaths.push(storageRefPath);
    });

    combineLatest(uploadObs).subscribe({
      next: (snapshots) => {
        _.forEach(snapshots, (shot, index) => {
          const cloneUploaded = [...uploadedFiles];
          if (cloneUploaded.length > 0) {
            cloneUploaded[index].progress = calProgress(shot.bytesTransferred, shot.totalBytes);
            cloneUploaded[index].status = cloneUploaded[index].progress === 100 ? 'done' : 'uploading';
            cloneUploaded[index].refPath = refPaths[index];
            setUploadedFiles(cloneUploaded);
          }
        });
        console.log(uploadedFiles);
      },
      error: (err) => {
        console.log(err);
        alert(err.message);
      },
      complete: () => {
        setIsUploading(false);
      },
    });
  };

  const initFileUpload = (files) => {
    const uploadingFiles = [];
    _.forEach(files, (file) => {
      uploadingFiles.push({
        status: 'uploading',
        progress: 0,
        fileName: file.name,
        file,
        refPath: '',
      });
    });
    return uploadingFiles;
  };

  useEffect(() => {
    if (!isUploading && modal) {
      upload(uploadedFiles, shipmentKey);
    }
  }, [uploadedFiles]);

  useImperativeHandle(ref, () => ({
    // eslint-disable-next-line no-shadow
    triggerUploading(file, shipmentKey, chatRoomKey) {
      if (file !== undefined) {
        setUploadedFiles(initFileUpload(file));
      }
      setChatRoomKey(chatRoomKey);
      setShipmentKey(shipmentKey);
      toggle();
    },
  }));

  const confirmUpload = () => {
    _.forEach(uploadedFiles, (file) => {
      GetMetaDataFromStorageRefPath(file.refPath).subscribe({
        next: (metaData) => {
          CreateShipmentFile(shipmentKey, {
            FileName: metaData.name,
            FileUrl: metaData.fullPath,
            FileCreateTimestamp: metaData.timeCreated,
            FileOwnerKey: 'mockKey',
            FileStorgeReference: metaData.fullPath,
          });
          GetURLFromStorageRefPath(metaData.ref).subscribe({
            next: (url) => {
              const editedChatFile = props.chatFile === undefined ? [] : props.chatFile;
              editedChatFile.push({
                FileName: file.fileName,
                FileUrl: url,
                FileCreateTimestamp: metaData.timeCreated,
                FilePath: metaData.fullPath,
              });
              EditChatRoomFileLink(shipmentKey, chatRoomKey, editedChatFile);
            },
            error: (err) => {
              console.log(err);
              alert(err.message);
            },
            complete: () => {
              'TO DO LOG';
            },
          });
        },
        error: (err) => {
          console.log(err);
          alert(err.message);
        },
        complete: () => {
          'TO DO LOG';
        },
      });
    });
    toggle();
    // props.sendMessage(chatRoomKey, shipmentKey, `${message} [ ${fileName} ]`);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <Modal isOpen={modal} toggle={toggle} className="upload-modal">
      <ModalHeader toggle={toggle}>
        <b>
Upload Files (
          {uploadedFiles.length}
)
        </b>
      </ModalHeader>
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
        <Label htmlFor="filename" style={{ marginTop: '0.5rem' }}>
          <b>Files</b>
        </Label>
        {_.map(uploadedFiles, file => (
          <Col>
            <span>{file.fileName}</span>
            {file.status === 'uploading' ? (
              <Progress value={file.progress} className="mb-3">
                {'Uploading...'}
              </Progress>
            ) : (
              <Progress value={file.progress} className="mb-3" color="success">
                {'Complete'}
              </Progress>
            )}
          </Col>
        ))}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={confirmUpload}>
          Send
        </Button>
        {' '}
      </ModalFooter>
    </Modal>
  );
});

export default UploadModal;
