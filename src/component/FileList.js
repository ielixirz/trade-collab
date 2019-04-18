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

const FileList = ({ chatFiles }) => {
  const [chatFile, setChatFile] = useState(false);
  const copyModalRef = useRef(null);

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

  return (
    <div>
      <ListGroup onClick={preventParentCollapse} flush>
        <CopyModal ref={copyModalRef} />
        {_.map(chatFile, s => (
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
