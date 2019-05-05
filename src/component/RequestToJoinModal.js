/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
/* as it is component */
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Input,
  Label,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap';
import { EditChatRoomFileLink } from '../service/chat/chat';

const RequestToJoinModal = forwardRef((props, ref) => {
  const [modal, setModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [note, setNote] = useState('');
  const [isSearchFound, setIsSearchFound] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const handleInputNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleInputSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const sendRequest = () => {
    // const editedChatRoomFileLink = chatFile;
    // console.log(editedChatRoomFileLink);
    // editedChatRoomFileLink[editIndex].FileName = editedFileName;
    // EditChatRoomFileLink(props.shipmentKey, props.chatroomKey, editedChatRoomFileLink);
    toggle();
  };

  const searchCompany = () => {
    setIsSearchActive(true);
  };

  useImperativeHandle(ref, () => ({
    // eslint-disable-next-line no-shadow
    triggerRequestToJoin() {
      toggle();
    },
  }));

  return (
    <Modal isOpen={modal} toggle={toggle} className="upload-modal">
      <ModalHeader toggle={toggle} style={{ border: 'none' }}>
        <h2>
          <b>Request to Join a Company</b>
        </h2>
      </ModalHeader>
      <ModalBody>
        <Label htmlFor="searchCompany">
          <b>Search Company ID</b>
        </Label>
        <InputGroup>
          <Input
            type="text"
            id="searchCompany"
            placeholder="Search a company..."
            value={searchText}
            onChange={handleInputSearchTextChange}
          />
          {' '}
          <InputGroupAddon addonType="append">
            <Button
              type="button"
              color="primary"
              style={{ backgroundColor: '#16A085' }}
              onClick={searchCompany}
            >
              <i className="fa fa-search" style={{ margin: 'auto' }} />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Row
          style={{ marginTop: '1rem', marginBottom: '1rem' }}
          hidden={!(isSearchActive && isSearchFound)}
        >
          <Col xs={3}>
            <img
              style={{ width: '100%', margin: 'auto' }}
              src="../assets/img/default-grey.jpg"
              className="img-avatar"
              alt="admin@bootstrapmaster.com"
            />
          </Col>
          <Col xs={5} style={{ margin: 'auto' }}>
            <span style={{ fontSize: 'medium' }}> Fresh Produce Co. Ltd. </span>
            {' '}
          </Col>
          <Col xs={3} style={{ margin: 'auto' }}>
            <span style={{ cursor: 'pointer' }}>
              <b>See Profile</b>
            </span>
            {' '}
          </Col>
        </Row>
        <Row
          style={{ marginTop: '1rem', marginBottom: '1rem' }}
          hidden={!(isSearchActive && !isSearchFound)}
        >
          <span style={{ cursor: 'pointer', margin: 'auto' }}>
            <b>Company not Found</b>
          </span>
        </Row>
        <Label htmlFor="note" style={{ marginTop: '0.5rem' }}>
          <b>Note</b>
        </Label>
        <Input type="textarea" id="note" placeholder="Write message..." value={note} />
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          className="profile-btn create"
          style={{ margin: 'auto' }}
          onClick={sendRequest}
        >
          Send Request
        </Button>
        {' '}
      </ModalFooter>
    </Modal>
  );
});

export default RequestToJoinModal;
