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
  Row,
} from 'reactstrap';
import { combineLatest } from 'rxjs';
import _ from 'lodash';

import {
  PutFile,
  GetMetaDataFromStorageRefPath,
  GetURLFromStorageRefPath,
  GetURLFromStorageRefString,
  DeleteFileFromStorageRefPath,
} from '../service/storage/managestorage';
import { EditChatRoomFileLink } from '../service/chat/chat';

import { CreateShipmentFile } from '../service/shipment/shipment';

const UploadModal = forwardRef((props, ref) => {
  const [modal, setModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isConfirming, setConfirming] = useState(false);
  const [isInitial, setIsInitial] = useState(true);
  const [shipmentKey, setShipmentKey] = useState(null);
  const [chatRoomKey, setChatRoomKey] = useState(null);
  const [message, setMessage] = useState('');

  const messageRef = useRef();

  const toggle = (isCancel) => {
    setMessage('');
    setConfirming(false);
    if (isCancel) {
      // eslint-disable-next-line no-use-before-define
      cancelUpload('ALL');
      setIsInitial(true);
    }
    setModal(!modal);
  };

  const calProgress = (byteTransfer, byteTotal) => (byteTransfer / byteTotal) * 100;

  const upload = (files, sKey) => {
    setIsUploading(true);
    setIsInitial(false);
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
            cloneUploaded[index].refObject = shot.ref;
            setUploadedFiles(cloneUploaded);
          }
        });
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
    if (!isUploading && modal && isInitial) {
      upload(uploadedFiles, shipmentKey);
    }
  }, [uploadedFiles]);

  useImperativeHandle(ref, () => ({
    // eslint-disable-next-line no-shadow
    triggerUploading(file, shipmentKey, chatRoomKey) {
      setIsInitial(true);
      if (file !== undefined) {
        setUploadedFiles(initFileUpload(file));
      }
      setChatRoomKey(chatRoomKey);
      setShipmentKey(shipmentKey);
      toggle(false);
    },
  }));

  const generateFileMessage = () => {
    const urlObs = [];
    const msgFiles = [];
    _.forEach(uploadedFiles, (file) => {
      urlObs.push(GetURLFromStorageRefString(file.refPath));
    });

    combineLatest(urlObs).subscribe((urls) => {
      _.forEach(urls, (url, index) => {
        msgFiles.push({
          filename: uploadedFiles[index].fileName,
          type: 'pdf',
          link: url,
        });
      });
      const msg = JSON.stringify({ msg: message, files: msgFiles });
      props.sendMessage(chatRoomKey, shipmentKey, msg, true);
    });
  };

  const confirmUpload = () => {
    setConfirming(true);
    setIsUploading(true);
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
              toggle(false);
            },
          });
        },
        error: (err) => {
          console.log(err);
          alert(err.message);
        },
        complete: () => {
          setIsUploading(false);
        },
      });
    });
    generateFileMessage();
    setIsInitial(true);
  };

  const cancelUpload = (index) => {
    if (!isUploading) {
      if (index === 'ALL') {
        const files = uploadedFiles;
        _.forEach(files, (file) => {
          DeleteFileFromStorageRefPath(file.refObject);
        });
      } else {
        const uploadFiles = [...uploadedFiles];
        const cancelfile = uploadFiles[index];
        DeleteFileFromStorageRefPath(cancelfile.refObject);
        uploadFiles.splice(index, 1);
        setUploadedFiles(uploadFiles);
        if (uploadFiles.length === 0) {
          toggle(true);
        }
      }
    }
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
        <Label style={{ marginTop: '10px', marginLeft: '10px' }}>
          <b>Files</b>
        </Label>
        {_.map(uploadedFiles, (file, index) => (
          <Row className="uploading-file-row" style={{ marginLeft: '5px', marginRight: '5px' }}>
            <Col xs="6" style={{ top: '4px' }}>
              <span>{file.fileName}</span>
            </Col>
            <Col xs="4" style={{ top: '8px', margin: 'auto' }}>
              {file.status === 'uploading' ? (
                <Progress value={file.progress} className="mb-3 upload">
                  {'Uploading...'}
                </Progress>
              ) : (
                <Progress value={file.progress} className="mb-3 upload" color="success">
                  {'Complete'}
                </Progress>
              )}
            </Col>
            <Col xs="1">
              <i
                className="fa fa-times"
                role="button"
                style={{ cursor: 'pointer', marginTop: '10px' }}
                onClick={() => cancelUpload(index)}
                onKeyDown={null}
                tabIndex="-1"
              />
            </Col>
          </Row>
        ))}
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={confirmUpload}
          style={{ backgroundColor: '#16a085', margin: 'auto', width: '300px' }}
          disabled={isConfirming}
        >
          <b>Send</b>
        </Button>
        {' '}
      </ModalFooter>
    </Modal>
  );
});

export default UploadModal;
