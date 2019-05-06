/* eslint-disable filenames/match-regex */
/* as it is component */
import React, {
  useState, forwardRef, useImperativeHandle, useEffect,
} from 'react';
import {
  Label, Button, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import Select from 'react-select';
import MultiSelectTextInput from './MultiSelectTextInput';
import MainDataTable from './MainDataTable';

import { inviteToCompanyColumns } from '../constants/network';

const mockCompanyList = [
  {
    value: {
      companyName: 'Fresh Produce',
    },
    label: 'Fresh Produce',
  },
  {
    value: {
      companyName: 'ABC Produce',
    },
    label: 'ABC Produce',
  },
  {
    value: {
      companyName: 'XYZ Produce',
    },
    label: 'XYZ Produce',
  },
];

const InviteToCompanyModal = forwardRef((props, ref) => {
  const [modal, setModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [company, setCompany] = useState('');

  useEffect(() => {}, []);

  const toggle = () => {
    setModal(!modal);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const invite = () => {};

  useImperativeHandle(ref, () => ({
    triggerInviteToCompany(propInvitedUsers) {
      if (propInvitedUsers.length === 0) {
        setCurrentStep(1);
      } else {
        setInvitedUsers(propInvitedUsers);
        setCurrentStep(2);
      }
      toggle();
    },
  }));

  const handleCompanyInputChange = (input) => {
    setCompany(input.value.companyName);
  };

  const handleInviteInputChange = (emails) => {
    setInvitedUsers(emails);
  };

  const renderStepOneBody = () => (
    <div>
      <Label htmlFor="company-name">
        <b>Select Company</b>
      </Label>
      <Select
        onChange={handleCompanyInputChange}
        name="company"
        id="company-invite"
        options={mockCompanyList}
        className="basic-multi-select"
        classNamePrefix="select"
      />
      <Label htmlFor="invite-email" style={{ marginTop: '1rem' }}>
        <b>Email Address of your colleagues</b>
      </Label>
      <MultiSelectTextInput
        id="invite-email"
        getValue={handleInviteInputChange}
        placeholder="Write email address.."
      />
    </div>
  );

  const renderStepTwoBody = () => (
    <MainDataTable
      data={[]}
      column={inviteToCompanyColumns}
      cssClass="profile-table"
      wraperClass="profile-table-wraper"
      isBorder={false}
    />
  );

  return (
    <Modal isOpen={modal} toggle={toggle} className="upload-modal modal-lg">
      <ModalHeader toggle={toggle} style={{ border: 'none' }}>
        <h2>
          <b>
            {currentStep === 1
              ? 'Invite your colleagues to join the company'
              : `Invite colleagues to join ${company}`}
          </b>
        </h2>
      </ModalHeader>
      <ModalBody>{currentStep === 1 ? renderStepOneBody() : renderStepTwoBody()}</ModalBody>
      <ModalFooter style={{ border: 'none' }}>
        {currentStep === 1 ? (
          <Button
            className="profile-btn create"
            style={{ margin: 'auto' }}
            color="primary"
            onClick={nextStep}
          >
            Invite
          </Button>
        ) : (
          <Button
            className="profile-btn create"
            style={{ margin: 'auto' }}
            color="primary"
            onClick={invite}
          >
            Send Invitation (
            {invitedUsers.length}
)
          </Button>
        )}
        {' '}
      </ModalFooter>
    </Modal>
  );
});

export default InviteToCompanyModal;
