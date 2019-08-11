/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable filenames/match-regex */
import React, { useEffect, useState, useRef } from 'react';
import { Collapse, CardBody, Card, Row, Col } from 'reactstrap';
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
    marginLeft: 15
  },
  arrow: {
    fontSize: '1.2em',
    marginLeft: 5,
    color: '#707070'
  },
  status: {
    color: '#58CADB'
  },
  card: {
    marginBottom: '0.2rem',
    marginRight: '0.2rem'
  }
};

const FileSide = props => {
  const [selectedFile, setSelectedFile] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const fileListRef = useRef(null);

  useEffect(() => {
    fileListRef.current.toggleMode();
  });

  const triggerCollapse = () => {
    props.collapseTrigger('FILE');
  };

  const deleteSelectedFile = e => {
    e.stopPropagation();
    if (selectedFile.length > 0) {
      const updatingFile = [...props.chatFile];
      _.forEach(selectedFile, f => {
        updatingFile[f.originalindex].FileIsDelete = true;
      });
      setSelectedFile([]);
      EditChatRoomFileLink(props.shipmentKey, props.chatroomKey, updatingFile);
      fileListRef.current.toggleMode();
    } else {
      setIsDeleteMode(!isDeleteMode);
      fileListRef.current.toggleMode();
    }
  };

  const selectFile = (selectIndex, originalindex) => {
    const selects = [...selectedFile];
    const found = selects.find(s => s.selectIndex === selectIndex);
    if (found) {
      selects.splice(selectIndex, 1);
    } else {
      selects.push({ selectIndex, originalindex });
    }
    setSelectedFile(selects);
  };

  return (
    <div>
      <Card className="card-chat-side" onClick={triggerCollapse} style={styles.card}>
        <CardBody style={{ paddingRight: 10 }}>
          <Row style={{ paddingRight: 20 }}>
            <Col xs="10" className="text-left">
              <span style={styles.boxColor}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16.111"
                  height="18"
                  viewBox="0 0 16.111 18"
                >
                  <g id="Group_13" data-name="Group 13" transform="translate(2362 1549.042)">
                    <g id="Group_12" data-name="Group 12" transform="translate(-2362 -1549.042)">
                      <g id="Group_11" data-name="Group 11">
                        <path
                          id="Path_14"
                          data-name="Path 14"
                          d="M-2351.534-1540.6a.6.6,0,0,0-.6-.6h-6.14a.6.6,0,0,0-.6.6.6.6,0,0,0,.6.6h6.14A.6.6,0,0,0-2351.534-1540.6Z"
                          transform="translate(2362.161 1548.318)"
                          fill="#f2af29"
                        />
                        <path
                          id="Path_15"
                          data-name="Path 15"
                          d="M-2358.27-1538.059a.6.6,0,0,0-.6.6.6.6,0,0,0,.6.6h3.729a.6.6,0,0,0,.6-.6.6.6,0,0,0-.6-.6Z"
                          transform="translate(2361.91 1548.028)"
                          fill="#f2af29"
                        />
                        <path
                          id="Path_16"
                          data-name="Path 16"
                          d="M-2356.741-1532.448h-2.394a1.421,1.421,0,0,1-1.433-1.406v-12.375a1.421,1.421,0,0,1,1.433-1.406h8.8a1.422,1.422,0,0,1,1.433,1.406v4.324a.71.71,0,0,0,.716.7.71.71,0,0,0,.716-.7v-4.324a2.842,2.842,0,0,0-2.864-2.812h-8.8a2.843,2.843,0,0,0-2.865,2.812v12.375a2.843,2.843,0,0,0,2.865,2.813h2.394a.71.71,0,0,0,.717-.7A.71.71,0,0,0-2356.741-1532.448Z"
                          transform="translate(2362 1549.042)"
                          fill="#f2af29"
                        />
                        <path
                          id="Path_17"
                          data-name="Path 17"
                          d="M-2346.8-1537.848a1.789,1.789,0,0,0-2.529,0l-3.272,3.27a.6.6,0,0,0-.15.249l-.713,2.349a.6.6,0,0,0,.144.59.6.6,0,0,0,.427.18.594.594,0,0,0,.159-.021l2.407-.668a.6.6,0,0,0,.262-.152l3.266-3.264A1.8,1.8,0,0,0-2346.8-1537.848Zm-4,4.84-1.21.336.354-1.168,2.208-2.206.843.844Zm3.155-3.153-.115.116-.844-.844.115-.116a.6.6,0,0,1,.843,0A.6.6,0,0,1-2347.645-1536.16Z"
                          transform="translate(2362.392 1549.21)"
                          fill="#f2af29"
                        />
                        <path
                          id="Path_18"
                          data-name="Path 18"
                          d="M-2352.13-1544.335h-6.14a.6.6,0,0,0-.6.6.6.6,0,0,0,.6.6h6.14a.6.6,0,0,0,.6-.6A.6.6,0,0,0-2352.13-1544.335Z"
                          transform="translate(2362.161 1548.607)"
                          fill="#f2af29"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
              <span style={styles.title}>
                {!isDeleteMode ? 'Shared Files' : 'Deleted Files'} (
                {props.chatFile === undefined
                  ? '0'
                  : isDeleteMode
                  ? _.filter(props.chatFile, file => file.FileIsDelete === true).length
                  : _.filter(
                      props.chatFile,
                      file => file.FileIsDelete === undefined || file.FileIsDelete === false
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
                  cursor: 'pointer'
                }}
                onKeyDown={null}
                tabIndex="-1"
                onClick={deleteSelectedFile}
              />
            </Col>
            <Col xs="1" className="text-right">
              {props.collapse === 'FILE' ? (
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
          <Collapse isOpen={props.collapse === 'FILE'}>
            <FileList
              chatFiles={props.chatFile}
              shipmentKey={props.shipmentKey}
              chatroomKey={props.chatroomKey}
              selectFileHandler={selectFile}
              selectedFile={selectedFile}
              isDeleteMode={isDeleteMode}
              sendMessage={props.sendMessage}
              ref={fileListRef}
            />
          </Collapse>
        </CardBody>
      </Card>
    </div>
  );
};

export default FileSide;
