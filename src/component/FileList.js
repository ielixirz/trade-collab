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
        {_.map(chatFile, (s) => {
          return (
            <ListGroupItem tag="a">
                          <span style={fileListDateStyle}>{s.FileCreateTimestamp}</span>
              <Row>
                <Col xs="1">
                  <i className="fa fa-file-picture-o" />
                </Col>
                <Col onClick={() => openFile(s.FileUrl)} xs="11" className="text-left">
                  {s.FileName}
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
