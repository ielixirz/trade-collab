import React, { useEffect, useCallback } from 'react';
import { ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { fetchFiles } from '../actions/fileActions';

const FileList = ({ chatroomKey }) => {
  const mapState = useCallback(
    state => ({
      collection: state.ChatReducer.chatrooms[chatroomKey].ChatRoomData.ChatRoomFileLink
    }),
    []
  );
  const props = useMappedState(mapState);

  const { collection = [] } = props;
  return (
    <div>
      {collection.map((s, index) => {
        console.log(s);
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
