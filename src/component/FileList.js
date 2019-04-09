import React, { useEffect, useState, useCallback } from 'react';
import { ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { fetchFiles } from '../actions/fileActions';
import _ from 'lodash';


const FileList = (props) => {
  const [chatFile, setChatFile] = useState(false)

  useEffect(() => {
    setChatFile(props.chatFile)
  })

  return (
    <div>
      {_.map(chatFile, (s, index) => {
        return (
          <ListGroup flush key={index}>
            <ListGroupItem disabled tag="a">
              <Row>
                <Col xs="1">
                  <i className="fa fa-file-picture-o" />
                </Col>
                <Col xs="11" className="text-left">
                  {s.FileName}
                </Col>
              </Row>
            </ListGroupItem>
          </ListGroup>
        );
      })}
    </div>
  );
}

export default FileList
