/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
/* as it is component */
import React, { useEffect, useState, useRef } from 'react';
import {
  ListGroup, ListGroupItem, Row, Col, Input,
} from 'reactstrap';
import _ from 'lodash';
import ThreeDotDropdown from './ThreeDotDropdown';
import CopyModal from './CopyModal';
import EditFileModal from './EditFileModal';
import { EditChatRoomFileLink } from '../service/chat/chat';

const FileList = ({
  chatFiles,
  shipmentKey,
  chatroomKey,
  selectFileHandler,
  selectedFile,
  isDeleteMode,
  sendMessage,
}) => {
  const [chatFile, setChatFile] = useState(false);
  const [hoveringFile, setHoveringFile] = useState(undefined);
  const copyModalRef = useRef(null);
  const editModalRef = useRef(null);

  useEffect(() => {
    setChatFile(
      isDeleteMode
        ? chatFiles
          .map((file, index) => {
            const f = { ...file };
            f.originalIndex = index;
            return f;
          })
          .filter(file => file.FileIsDelete === true)
        : _.filter(
          chatFiles,
          file => file.FileIsDelete === undefined || file.FileIsDelete === false,
        ),
    );
  });

  const preventParentCollapse = (e) => {
    e.stopPropagation();
  };

  const onFileHover = (index) => {
    setHoveringFile(index);
  };

  const onFileLeave = () => {
    setHoveringFile(undefined);
  };

  const openFile = (url) => {
    window.open(url, '_blank');
  };

  const restoreFile = (restoreIndex) => {
    console.log(restoreIndex);
    const updatingFile = [...chatFiles];
    updatingFile[restoreIndex].FileIsDelete = false;
    EditChatRoomFileLink(shipmentKey, chatroomKey, updatingFile);
  };

  const downloadFile = (url) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.open('GET', url);
    xhr.send();
  };

  const fileListDateStyle = {
    position: 'absolute',
    top: 0,
    right: '6px',
    bottom: 0,
    fontSize: 'xx-small',
    color: 'grey',
  };

  const fileListGroupStyle = {
    height: '25vh',
    overflow: 'scroll',
    overflowX: 'hidden',
    fontSize: '0.9em',
  };

  return (
    <div>
      <ListGroup onClick={preventParentCollapse} flush style={fileListGroupStyle}>
        <CopyModal ref={copyModalRef} sendMessage={sendMessage} />
        <EditFileModal ref={editModalRef} shipmentKey={shipmentKey} chatroomKey={chatroomKey} />
        {_.map(chatFile, (s, index) => (
          <ListGroupItem className="file-row" tag="a">
            <span style={fileListDateStyle}>{new Date(s.FileCreateTimestamp).toDateString()}</span>
            <Row
              onMouseOver={() => onFileHover(index)}
              onFocus={() => null}
              onMouseLeave={() => onFileLeave()}
              onDoubleClick={() => openFile(s.FileUrl)}
            >
              {isDeleteMode ? (
                <Col xs="1">
                  <svg
                    id="icon_file-text"
                    data-name="icon/file-text"
                    xmlns="http://www.w3.org/2000/svg"
                    width="9.818"
                    height="12"
                    viewBox="0 0 9.818 12"
                  >
                    <path
                      id="Combined-Shape"
                      d="M11.727,5.364H9a.545.545,0,0,1-.545-.545V2.091H4.636a.545.545,0,0,0-.545.545v8.727a.545.545,0,0,0,.545.545h6.545a.545.545,0,0,0,.545-.545v-6h.545a.546.546,0,0,0,.5-.758.553.553,0,0,1,.043.212v6.545A1.636,1.636,0,0,1,11.182,13H4.636A1.636,1.636,0,0,1,3,11.364V2.636A1.636,1.636,0,0,1,4.636,1H9a.545.545,0,0,1,.386.16l3.273,3.273a.545.545,0,0,1,.118.177Zm-2.182-2.5v1.41h1.41ZM10.091,7a.545.545,0,0,1,0,1.091H5.727A.545.545,0,0,1,5.727,7Zm0,2.182a.545.545,0,0,1,0,1.091H5.727a.545.545,0,1,1,0-1.091ZM6.818,4.818a.545.545,0,0,1,0,1.091H5.727a.545.545,0,1,1,0-1.091Z"
                      transform="translate(-3 -1)"
                      fill="#3b3b3b"
                    />
                  </svg>
                </Col>
              ) : hoveringFile === index || selectedFile.indexOf(index) !== -1 ? (
                <Col xs="1" style={{ left: '20px' }}>
                  <Input
                    className="form-check-input"
                    type="checkbox"
                    id="inline-checkbox1"
                    name="inline-checkbox1"
                    value={index}
                    onClick={() => selectFileHandler(index)}
                  />
                </Col>
              ) : (
                <Col xs="1">
                  <svg
                    id="icon_file-text"
                    data-name="icon/file-text"
                    xmlns="http://www.w3.org/2000/svg"
                    width="9.818"
                    height="12"
                    viewBox="0 0 9.818 12"
                  >
                    {' '}
                    <path
                      id="Combined-Shape"
                      d="M11.727,5.364H9a.545.545,0,0,1-.545-.545V2.091H4.636a.545.545,0,0,0-.545.545v8.727a.545.545,0,0,0,.545.545h6.545a.545.545,0,0,0,.545-.545v-6h.545a.546.546,0,0,0,.5-.758.553.553,0,0,1,.043.212v6.545A1.636,1.636,0,0,1,11.182,13H4.636A1.636,1.636,0,0,1,3,11.364V2.636A1.636,1.636,0,0,1,4.636,1H9a.545.545,0,0,1,.386.16l3.273,3.273a.545.545,0,0,1,.118.177Zm-2.182-2.5v1.41h1.41ZM10.091,7a.545.545,0,0,1,0,1.091H5.727A.545.545,0,0,1,5.727,7Zm0,2.182a.545.545,0,0,1,0,1.091H5.727a.545.545,0,1,1,0-1.091ZM6.818,4.818a.545.545,0,0,1,0,1.091H5.727a.545.545,0,1,1,0-1.091Z"
                      transform="translate(-3 -1)"
                      fill="#3b3b3b"
                    />
                    {' '}
                  </svg>
                </Col>
              )}
              <Col style={{ cursor: 'pointer' }} xs="9" className="text-left">
                {s.FileName}
              </Col>
              <Col xs="2" style={{ left: '10px' }}>
                <ThreeDotDropdown
                  options={
                    isDeleteMode
                      ? [
                        {
                          text: 'Restore',
                          function: () => restoreFile(s.originalIndex),
                        },
                      ]
                      : [
                        {
                          text: 'Download',
                          function: () => openFile(s.FileUrl),
                        },
                        {
                          text: 'Copy',
                          function: () => copyModalRef.current.triggerCopying(s, sendMessage),
                        },
                        {
                          text: 'Rename',
                          function: () => editModalRef.current.triggerEditing(index, chatFile),
                        },
                      ]
                  }
                />
              </Col>
            </Row>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

export default FileList;
