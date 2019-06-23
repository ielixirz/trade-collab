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

const FileList = ({
  chatFiles,
  shipmentKey,
  chatroomKey,
  selectFileHandler,
  selectedFile,
  isDeleteMode,
}) => {
  const [chatFile, setChatFile] = useState(false);
  const [hoveringFile, setHoveringFile] = useState(undefined);
  const copyModalRef = useRef(null);
  const editModalRef = useRef(null);

  useEffect(() => {
    setChatFile(chatFiles);
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
    height: '30vh',
    overflow: 'scroll',
    overflowX: 'hidden',
    fontSize: '0.9em',
  };

  return (
    <div>
      <ListGroup onClick={preventParentCollapse} flush style={fileListGroupStyle}>
        <CopyModal ref={copyModalRef} />
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
                  <i className="fa fa-file-picture-o" />
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
                  <i className="fa fa-file-picture-o" />
                </Col>
              )}
              <Col style={{ cursor: 'pointer' }} xs="9" className="text-left">
                {s.FileName}
              </Col>
              <Col xs="2" style={{ left: '10px' }}>
                <ThreeDotDropdown
                  options={[
                    {
                      text: 'Download',
                      function: () => openFile(s.FileUrl),
                    },
                    {
                      text: 'Copy',
                      function: () => copyModalRef.current.triggerCopying(s),
                    },
                    {
                      text: 'Rename',
                      function: () => editModalRef.current.triggerEditing(index, chatFile),
                    },
                  ]}
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
