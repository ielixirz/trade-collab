import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ListGroup, ListGroupItem, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ThreeDotDropdown from './ThreeDotDropdown';
import CopyModal from './CopyModal';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { fetchFiles } from '../actions/fileActions';
import _ from 'lodash';

const FileList = (props) => {
  const [chatFile, setChatFile] = useState(false)
  const copyModalRef = useRef(null);

  useEffect(() => {
    setChatFile(props.chatFile)
  })

  const preventParentCollapse = (e) => {
    e.stopPropagation();
  }

  const openFile = (url) => {
    window.open(url, '_blank');
  }

  const fileListDateStyle = {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        fontSize: 'xx-small',
        color: 'grey',
  }

  return (
    <div>
      <ListGroup onClick={preventParentCollapse} flush>
        <CopyModal
          ref={copyModalRef}
        />
        {_.map(chatFile, (s) => {
          return (
            <ListGroupItem tag="a">
                          <span style={fileListDateStyle}>{ new Date(s.FileCreateTimestamp).toDateString()}</span>
              <Row>
                <Col xs="1">
                  <i className="fa fa-file-picture-o" />
                </Col>
                <Col style={{ cursor: 'pointer' }} xs="10" className="text-left">
                  {s.FileName}
                </Col>
                <Col>
                  <ThreeDotDropdown
                    options={
                      [{
                        text: 'Download',
                        function: () => openFile(s.FileUrl)
                      },
                      {
                        text: 'Copy',
                        function: () => copyModalRef.current.triggerCopying(s)
                      }]
                    }
                  />
                </Col>
              </Row>
            </ListGroupItem>
          );
        })}
      </ListGroup>
    </div>
  );
}

export default FileList
