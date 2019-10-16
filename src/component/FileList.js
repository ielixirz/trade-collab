/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
/* as it is component */
import React, {
  useEffect, useState, useRef, useImperativeHandle, forwardRef,
} from 'react';
import {
  ListGroup, ListGroupItem, Row, Col, Input,
} from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';
import ThreeDotDropdown from './ThreeDotDropdown';
import CopyModal from './CopyModal';
import EditFileModal from './EditFileModal';
import { EditChatRoomFileLink } from '../service/chat/chat';

// import for testing purpose
import FileCard from './File/FileCard';

const FileList = forwardRef(
  (
    {
      chatFiles,
      shipmentKey,
      chatroomKey,
      selectFileHandler,
      selectedFile,
      isDeleteMode,
      sendMessage,
    },
    ref,
  ) => {
    const [chatFile, setChatFile] = useState(false);
    const [hoveringFile, setHoveringFile] = useState(undefined);
    const [toggle, setToggle] = useState(true);
    const copyModalRef = useRef(null);
    const editModalRef = useRef(null);

    useEffect(() => {
      if (chatFiles) {
        setChatFile(
          isDeleteMode
            ? chatFiles
              .map((file, index) => {
                const f = { ...file };
                f.originalIndex = index;
                return f;
              })
              .filter(file => file.FileIsDelete === true)
            : chatFiles
              .map((file, index) => {
                const f = { ...file };
                f.originalIndex = index;
                return f;
              })
              .filter(file => file.FileIsDelete === undefined || file.FileIsDelete === false),
        );
      } else {
        setChatFile([]);
      }
    }, [toggle]);

    useImperativeHandle(ref, () => ({
      toggleMode() {
        setToggle(!toggle);
      },
    }));

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
      window.open(url, 'Download');
    };

    const restoreFile = (restoreIndex) => {
      const updatingFile = [...chatFiles];
      updatingFile[restoreIndex].FileIsDelete = false;
      EditChatRoomFileLink(shipmentKey, chatroomKey, updatingFile);
      setToggle(!toggle);
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
            <ListGroupItem style={{ border: 0, paddingBottom: 5, paddingTop: 5 }} tag="a">
              <FileCard fileInfo={s} />
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
    );
  },
);

export default FileList;
