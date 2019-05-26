/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
/* as it is component */
import React, {
  useState, forwardRef, useImperativeHandle, useEffect,
} from 'react';
import {
  Input, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import { CombineCreateCompanyWithCreateCompanyMember } from '../service/company/company';

const CreateCompanyModal = forwardRef((props, ref) => {
  const [modal, setModal] = useState(false);
  const [isExtend, setExtend] = useState(false);
  const [company, setCompany] = useState({});

  useEffect(() => {
    setExtend(false);
  }, []);

  const toggle = () => {
    setModal(!modal);
  };

  const extend = () => {
    setExtend(!isExtend);
  };

  const handleCompanyInputChange = (event) => {
    const createCompany = company;
    const inputValue = event.target.value;
    const inputName = event.target.id;

    if (inputName === 'company-name') {
      createCompany.CompanyName = inputValue;
    } else if (inputName === 'company-id') {
      createCompany.CompanyID = inputValue;
    } else if (inputName === 'company-tel') {
      createCompany.CompanyTelNumber = inputValue;
    } else if (inputName === 'company-address') {
      createCompany.CompanyAddress = inputValue;
    } else if (inputName === 'company-website') {
      createCompany.CompanyWebsiteUrl = inputValue;
    } else if (inputName === 'company-note') {
      createCompany.CompanyAboutUs = inputValue;
    }

    setCompany(createCompany);
  };

  const create = () => {
    const userData = {
      UserMemberEmail: props.userEmail,
      UserMemberPosition: '-',
      UserMemberRoleName: '-',
      UserMatrixRolePermissionCode: '-',
      UserMemberCompanyStandingStatus: 'Active',
      UserMemberJoinedTimestamp: new Date(),
    };
    CombineCreateCompanyWithCreateCompanyMember(company, props.userKey, userData).subscribe(() => {
      props.updateCompany(company);
    });
    toggle();
  };

  useImperativeHandle(ref, () => ({
    triggerCreateCompany() {
      toggle();
    },
  }));

  return (
    <Modal isOpen={modal} toggle={toggle} className="upload-modal">
      <ModalHeader toggle={toggle} style={{ border: 'none' }}>
        <h2>
          <b>Create New Company</b>
        </h2>
      </ModalHeader>
      <ModalBody>
        <Label htmlFor="company-name">
          <b>Company Name</b>
        </Label>
        <Input
          onChange={handleCompanyInputChange}
          type="text"
          id="company-name"
          placeholder="Name"
        />
        <Label onClick={extend} style={{ marginTop: '1rem', color: 'grey' }} hidden={isExtend}>
          <b>+ Add Additional Detail</b>
        </Label>
        {/* Additional Fields */}
        {isExtend ? (
          <div>
            <Label htmlFor="company-tel" style={{ marginTop: '1rem' }}>
              <b>Company Landline Phone Number</b>
            </Label>
            <Input
              onChange={handleCompanyInputChange}
              type="text"
              id="company-tel"
              placeholder="Phone"
            />
            <Label htmlFor="company-address" style={{ marginTop: '1rem' }}>
              <b>Address</b>
            </Label>
            <Input
              onChange={handleCompanyInputChange}
              type="text"
              id="company-address"
              placeholder="Address"
            />
            <Label htmlFor="company-website" style={{ marginTop: '1rem' }}>
              <b>Website</b>
            </Label>
            <Input
              onChange={handleCompanyInputChange}
              type="text"
              id="company-website"
              placeholder="Url"
            />
            <Label htmlFor="company-note" style={{ marginTop: '1rem' }}>
              <b>Note</b>
            </Label>
            <Input
              onChange={handleCompanyInputChange}
              type="textarea"
              id="company-note"
              placeholder="Write message..."
            />
          </div>
        ) : null}
      </ModalBody>
      <ModalFooter style={{ border: 'none' }}>
        <Button
          className="profile-btn create"
          style={{ margin: 'auto' }}
          color="primary"
          onClick={create}
        >
          Create Company
        </Button>
        {' '}
      </ModalFooter>
    </Modal>
  );
});

export default CreateCompanyModal;
