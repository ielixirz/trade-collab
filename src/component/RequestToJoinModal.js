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
  Alert,
} from 'reactstrap';
import _ from 'lodash';

import { CreateUserRequest, CreateCompanyRequest } from '../service/join/request';
import { CheckAvaliableCompanyName, IsCompanyMember } from '../service/company/company';

const RequestToJoinModal = forwardRef((props, ref) => {
  const [modal, setModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [note, setNote] = useState('');
  const [isSearchFound, setIsSearchFound] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [foundCompany, setFoundCompany] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAlreadyMember, setIsAlreadyMember] = useState(undefined);

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
    if (selectedIndex !== null) {
      const selectedCompany = foundCompany[selectedIndex];
      const userKey = props.userId;
      IsCompanyMember(selectedCompany.id, userKey).subscribe((isMember) => {
        if (isMember) {
          setIsAlreadyMember(true);
        } else {
          const usrReqData = {
            CompanyRequestReference: '',
            CompanyRequestCompanyKey: selectedCompany.id,
            CompanyRequestCompanyName: selectedCompany.data.CompanyName,
            CompanyRequestNote: note,
            CompanyRequestStatus: 'Pending',
          };
          CreateUserRequest(userKey, usrReqData).subscribe((result) => {
            const usrReqKey = result.id;
            const comReqData = {
              UserRequestReference: usrReqKey,
              UserRequestKey: usrReqKey,
              UserRequestUserKey: userKey,
              UserRequestCompanyKey: selectedCompany.id,
              UserRequestCompanyName: selectedCompany.data.CompanyName,
              UserRequestFristname: props.profile.ProfileFirstname,
              UserRequestSurname: props.profile.ProfileSurname,
              UserRequestEmail: props.profile.ProfileEmail,
              UserRequestNote: note,
              UserRequestStatus: 'Pending',
            };
            CreateCompanyRequest(selectedCompany.id, usrReqKey, comReqData);
          });
          toggle();
        }
      });
    }
  };

  const selectCompany = (index) => {
    setSelectedIndex(index);
  };

  const searchCompany = () => {
    setSelectedIndex(null);
    const foundCompanyArray = [];
    CheckAvaliableCompanyName(searchText).subscribe({
      next: (snapshot) => {
        snapshot.forEach((doc) => {
          foundCompanyArray.push({
            data: doc.data(),
            id: doc.id,
          });
        });
      },
      error: (err) => {
        console.log(err);
        alert(err.message);
      },
      complete: () => {
        setIsSearchActive(true);
        if (foundCompanyArray.length > 0) {
          setFoundCompany(foundCompanyArray);
          setIsSearchFound(true);
        } else {
          setIsSearchFound(false);
        }
      },
    });
  };

  useImperativeHandle(ref, () => ({
    // eslint-disable-next-line no-shadow
    triggerRequestToJoin() {
      toggle();
    },
  }));

  const validateRequest = () => {
    if (selectedIndex === null) {
      return false;
    }
    return true;
  };

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
        {_.map(foundCompany, (company, index) => (
          <Row
            className={
              index === selectedIndex
                ? 'search-company-selection active'
                : 'search-company-selection'
            }
            hidden={!(isSearchActive && isSearchFound)}
            onClick={() => selectCompany(index)}
          >
            <Col xs={3}>
              <img
                style={{ width: '100%', margin: 'auto' }}
                src={
                  company.data.CompanyImageLink === undefined
                    ? '../assets/img/default-grey.jpg'
                    : company.data.CompanyImageLink
                }
                className="img-avatar"
                alt="admin@bootstrapmaster.com"
              />
            </Col>
            <Col xs={5} style={{ margin: 'auto' }}>
              <span style={{ fontSize: 'medium' }}>
                {' '}
                {company.data.CompanyName}
                {' '}
              </span>
              {' '}
            </Col>
            <Col xs={3} style={{ margin: 'auto' }}>
              <span style={{ cursor: 'pointer' }}>
                <b>See Profile</b>
              </span>
              {' '}
            </Col>
          </Row>
        ))}
        <Row
          style={{ marginTop: '1rem', marginBottom: '1rem' }}
          hidden={!(isSearchActive && !isSearchFound)}
        >
          <span style={{ cursor: 'pointer', margin: 'auto' }}>
            <b>Company not found</b>
          </span>
        </Row>
        <Label htmlFor="note" style={{ marginTop: '0.5rem' }}>
          <b>Note</b>
        </Label>
        <Input
          type="textarea"
          id="note"
          placeholder="Write message..."
          onChange={handleInputNoteChange}
          value={note}
        />
        {isAlreadyMember === true ? (
          <Alert color="warning" style={{ marginTop: 10, marginBottom: 0 }}>
            You already joined this company.
          </Alert>
        ) : (
          ''
        )}
      </ModalBody>
      <ModalFooter style={{ border: 'none' }}>
        <Button
          color="primary"
          className="profile-btn create"
          style={{ margin: 'auto' }}
          onClick={sendRequest}
          disabled={!validateRequest()}
        >
          Send Request
        </Button>
        {' '}
      </ModalFooter>
    </Modal>
  );
});

export default RequestToJoinModal;
