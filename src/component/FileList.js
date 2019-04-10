import React, { useEffect, useState, useCallback } from 'react';
import { ListGroup, ListGroupItem, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ThreeDotDropdown from './ThreeDotDropdown';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { fetchFiles } from '../actions/fileActions';
import _ from 'lodash';

const FileList = (props) => {
  const [chatFile, setChatFile] = useState(false)

  useEffect(() => {
    setChatFile(props.chatFile)
  })

  const preventParentCollapse = (e) => {
    e.stopPropagation();
  }

  const openFile = (url) => {
    window.open(url, '_blank');
  }

  return (
    <div>
      <ListGroup onClick={preventParentCollapse} flush>
        {_.map(chatFile, (s) => {
          return (
            <ListGroupItem tag="a">
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
                        function: undefined
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
