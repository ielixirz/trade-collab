/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable filenames/match-regex */
import React, { useEffect, useState, useRef } from 'react';

import {
  Collapse, CardBody, Card, Row, Col,
} from 'reactstrap';
import _ from 'lodash';
import FileList from '../../component/FileList';
import { EditChatRoomFileLink } from '../../service/chat/chat';

const styles = {
  button: {},
  boxColor: { fontSize: 20, color: 'gold', marginRight: 7 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#707070',
  },
  arrow: {
    fontSize: 20,
    marginLeft: 5,
    color: '#707070',
  },
  status: {
    color: '#58CADB',
  },
  card: {
    marginBottom: '0.2rem',
    marginRight: '0.2rem',
  },
};

const FileSide = (props) => {
  const [collapse, setCollapse] = useState(false);
  const [selectedFile, setSelectedFile] = useState([]);

  const triggerCollapse = () => {
    setCollapse(!collapse);
  };

  const deleteSelectedFile = (e) => {
    e.stopPropagation();
    const updatingFile = [...props.chatFile];
    _.forEach(selectedFile, (fileIndex) => {
      updatingFile.splice(fileIndex, 1);
    });
    setSelectedFile([]);
    EditChatRoomFileLink(props.shipmentKey, props.chatroomKey, updatingFile);
  };

  const selectFile = (selectIndex) => {
    const selects = [...selectedFile];
    const foundIndex = selects.indexOf(selectIndex);
    if (foundIndex === -1) {
      selects.push(selectIndex);
    } else {
      selects.splice(foundIndex, 1);
    }
    setSelectedFile(selects);
  };

  return (
    <div>
      <Card onClick={triggerCollapse} style={styles.card}>
        <CardBody>
          <Row style={{ marginBottom: '10px' }}>
            <Col xs="10" className="text-left">
              <span style={styles.boxColor}>
                <i className="fa fa-file" />
              </span>
              <span style={styles.title}>Shared Files</span>
            </Col>
            <Col xs="1" style={{ padding: 0, top: '5px' }}>
              <i
                className="cui-trash icons"
                role="button"
                style={{
                  fontSize: 'medium',
                  padding: '0',
                  paddingLeft: '20px',
                  cursor: 'pointer',
                }}
                onKeyDown={null}
                tabIndex="-1"
                onClick={deleteSelectedFile}
              />
            </Col>
            <Col xs="1" className="text-right">
              {collapse ? (
                <span style={styles.arrow}>
                  <i className="fa fa-angle-down" />
                </span>
              ) : (
                <span style={styles.arrow}>
                  <i className="fa fa-angle-right" />
                </span>
              )}
            </Col>
          </Row>
          <Collapse isOpen={collapse}>
            <FileList
              chatFiles={props.chatFile}
              shipmentKey={props.shipmentKey}
              chatroomKey={props.chatroomKey}
              selectFileHandler={selectFile}
              selectedFile={selectedFile}
            />
          </Collapse>
        </CardBody>
      </Card>
    </div>
  );
};

export default FileSide;
