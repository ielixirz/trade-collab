/* eslint-disable no-nested-ternary */
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
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#707070',
  },
  arrow: {
    fontSize: '1.2em',
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
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const triggerCollapse = () => {
    setCollapse(!collapse);
  };

  const deleteSelectedFile = (e) => {
    e.stopPropagation();
    if (selectedFile.length > 0) {
      const updatingFile = [...props.chatFile];
      _.forEach(selectedFile, (fileIndex) => {
        updatingFile[fileIndex].FileIsDelete = true;
      });
      setSelectedFile([]);
      EditChatRoomFileLink(props.shipmentKey, props.chatroomKey, updatingFile);
    } else {
      setIsDeleteMode(!isDeleteMode);
    }
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
        <CardBody style={{ paddingRight: 10 }}>
          <Row style={{ marginBottom: '10px', paddingRight: 20 }}>
            <Col xs="10" className="text-left">
              <span style={styles.boxColor}>
                <i className="fa fa-file" />
              </span>
              <span style={styles.title}>
                {!isDeleteMode ? 'Shared Files' : 'Deleted Files'}
                {' '}
(
                {props.chatFile === undefined
                  ? '0'
                  : isDeleteMode
                    ? _.filter(props.chatFile, file => file.FileIsDelete === true).length
                    : _.filter(
                      props.chatFile,
                      file => file.FileIsDelete === undefined || file.FileIsDelete !== true,
                    ).length}
                )
              </span>
            </Col>
            <Col xs="1" style={{ padding: 0, top: '5px' }}>
              <i
                className={
                  selectedFile.length > 0
                    ? 'cui-trash icons delete-btn-enable'
                    : 'cui-trash icons delete-btn-disable'
                }
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
              chatFiles={
                isDeleteMode
                  ? _.filter(props.chatFile, file => file.FileIsDelete === true)
                  : _.filter(
                    props.chatFile,
                    file => file.FileIsDelete === undefined || file.FileIsDelete !== true,
                  )
              }
              shipmentKey={props.shipmentKey}
              chatroomKey={props.chatroomKey}
              selectFileHandler={selectFile}
              selectedFile={selectedFile}
              isDeleteMode={isDeleteMode}
              sendMessage={props.sendMessage}
            />
          </Collapse>
        </CardBody>
      </Card>
    </div>
  );
};

export default FileSide;
