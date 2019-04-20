/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
/* as it is component */
import React, { useEffect, useState, useRef } from 'react';
import {
  ListGroup, ListGroupItem, Row, Col,
} from 'reactstrap';
import _ from 'lodash';
import ThreeDotDropdown from './ThreeDotDropdown';
import CopyModal from './CopyModal';
import EditFileModal from './EditFileModal';

const FileList = ({ chatFiles, shipmentKey, chatroomKey }) => {
  const [chatFile, setChatFile] = useState(false);
  const copyModalRef = useRef(null);
  const editModalRef = useRef(null);

  useEffect(() => {
    setChatFile(chatFiles);
  });

  const preventParentCollapse = (e) => {
    e.stopPropagation();
  };

  const openFile = (url) => {
    window.open(url, '_blank');
  };

  const fileListDateStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    fontSize: 'xx-small',
    color: 'grey',
  };

  const fileListGroupStyle = {
    height: '30vh',
    overflow: 'scroll',
  };

  return (
    <div>
      <ListGroup onClick={preventParentCollapse} flush style={fileListGroupStyle}>
        <CopyModal ref={copyModalRef} />
        <EditFileModal ref={editModalRef} shipmentKey={shipmentKey} chatroomKey={chatroomKey} />
        {_.map(chatFile, (s, index) => (
          <ListGroupItem tag="a">
            <span style={fileListDateStyle}>{new Date(s.FileCreateTimestamp).toDateString()}</span>
            <Row>
              <Col xs="1">
                <i className="fa fa-file-picture-o" />
              </Col>
              <Col style={{ cursor: 'pointer' }} xs="10" className="text-left">
                {s.FileName}
              </Col>
              <Col>
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
                      text: 'Edit',
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
