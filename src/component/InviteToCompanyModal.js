/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable filenames/match-regex */
/* as it is component */
import React, {
  useState, forwardRef, useImperativeHandle, useEffect,
} from 'react';
import {
  Label,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Alert,
} from 'reactstrap';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import Select from 'react-select';
import MultiSelectTextInput from './MultiSelectTextInput';
import MainDataTable from './MainDataTable';

import { inviteToCompanyColumns } from '../constants/network';
import { GetUserInfoFromEmail } from '../service/user/user';
import { GetCompanyUserAccessibility } from '../service/company/company';
import { GetProlfileList } from '../service/user/profile';
import { CreateCompanyMultipleInvitation } from '../service/join/invite';

const InviteToCompanyModal = forwardRef((props, ref) => {
  const [modal, setModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [invitedEmails, setinvitedEmails] = useState([]);
  const [existingInvited, setExistingInvited] = useState([]);
  const [nonExistingInvited, setNonExistingInvited] = useState([]);
  const [updateRole, setUpdateRole] = useState({});
  const [updatePosition, setUpdatePosition] = useState({});
  const [company, setCompany] = useState('');
  const [availableCompany, setAvailableCompany] = useState([]);
  const [isValidInvite, setIsValidInvite] = useState(undefined);

  const clear = () => {
    setExistingInvited([]);
    setNonExistingInvited([]);
    setUpdateRole({});
    setUpdatePosition({});
    setIsValidInvite(undefined);
  };

  useEffect(() => {
    // clear();
  }, [invitedEmails, isValidInvite]);

  const handleInputPositionChange = (event, email) => {
    const temp = updatePosition;
    temp[email] = event.target.value;
    setUpdatePosition(temp);
  };

  const handleRoleInputChange = (input, email) => {
    const temp = updateRole;
    temp[email] = input.value.role;
    setUpdateRole(temp);
  };

  const handleCompanyInputChange = (input) => {
    setCompany(input.value);
  };

  const handleInviteInputChange = (emails) => {
    setinvitedEmails(emails);
  };

  const removeInvite = (email) => {
    const tempExist = existingInvited;
    const tempNonExist = nonExistingInvited;

    tempExist.filter(entry => entry.email !== email);
    tempNonExist.filter(entry => entry.email !== email);

    setExistingInvited(tempExist);
    setNonExistingInvited(tempNonExist);
  };

  const fetchInvitedUserDetail = (emails, companyKey) => {
    const userObs = [];
    emails.forEach((email) => {
      userObs.push(
        GetUserInfoFromEmail(email.value).pipe(
          map((docs) => {
            if (docs.length === 0) {
              return {
                isFound: false,
                email: email.value,
              };
            }
            return {
              isFound: true,
              docs,
            };
          }),
        ),
      );
    });

    GetCompanyUserAccessibility(companyKey)
      .pipe(map(docs => docs.map(d => d.data())))
      .subscribe((userMatrix) => {
        const roles = userMatrix.map(matrix => ({
          value: {
            role: matrix.CompanyUserAccessibilityRoleName,
          },
          label: matrix.CompanyUserAccessibilityRoleName,
        }));

        combineLatest(userObs).subscribe((results1) => {
          const profileObs = [];
          const inviteNotExistEntities = [];
          const inviteExistEntities = [];
          let n = 0;
          results1.forEach((result) => {
            if (result.isFound) {
              const data = result.docs[0].data();
              const userKey = result.docs[0].id;
              profileObs.push(
                GetProlfileList(userKey).pipe(
                  map(docs => docs.map((d) => {
                    const profile = d.data();
                    profile.email = data.UserInfoEmail;
                    profile.key = userKey;
                    return profile;
                  })),
                ),
              );
            } else {
              const index = n;
              const inviteEntity = {
                key: null,
                name: '- (Not yet app user)',
                email: result.email,
                position: (
                  <Input
                    type="text"
                    id={`position#n${index}`}
                    placeholder="Position"
                    onChange={event => handleInputPositionChange(event, result.email)}
                  />
                ),
                role: (
                  <Select
                    onChange={input => handleRoleInputChange(input, result.email)}
                    name="company"
                    id={`company-invite#n${n}`}
                    options={roles}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Choose Role"
                  />
                ),
                // remove: (
                //   <i
                //     className="cui-trash icons"
                //     role="button"
                //     style={{ cursor: 'pointer' }}
                //     onClick={removeInvite(result.email)}
                //     onKeyDown={null}
                //     tabIndex="-1"
                //   />
                // ),
              };
              inviteNotExistEntities.push(inviteEntity);
              n += 1;
            }
          });
          setNonExistingInvited(inviteNotExistEntities);
          combineLatest(profileObs).subscribe((results2) => {
            results2.forEach((result, index) => {
              // TO-DO get first profile for now
              const firstProfile = result.pop();
              const inviteEntity = {
                key: firstProfile.key,
                name: `${firstProfile.ProfileFirstname} ${firstProfile.ProfileSurname}`,
                email: firstProfile.email,
                position: (
                  <Input
                    type="text"
                    id={`position#e${index}`}
                    placeholder="Position"
                    onChange={event => handleInputPositionChange(event, firstProfile.email)}
                  />
                ),
                role: (
                  <Select
                    onChange={input => handleRoleInputChange(input, firstProfile.email)}
                    name="company"
                    id={`company-invite#e${index}`}
                    options={roles}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Choose Role"
                  />
                ),
                // remove: (
                //   <i
                //     className="cui-trash icons"
                //     role="button"
                //     style={{ cursor: 'pointer' }}
                //     onClick={() => removeInvite(firstProfile.email)}
                //     onKeyDown={null}
                //     tabIndex="-1"
                //   />
                // ),
              };
              inviteExistEntities.push(inviteEntity);
            });
            setExistingInvited(inviteExistEntities);
          });
        });
      });
  };

  const toggle = () => {
    setModal(!modal);
  };

  const validateInvite = () => {
    if (company === '' || invitedEmails.length === 0) {
      return false;
    }
    if (invitedEmails.value) {
      if (invitedEmails.value.length === 0) {
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateInvite()) {
      setCurrentStep(currentStep + 1);
      fetchInvitedUserDetail([...invitedEmails], company.key);
    }
  };

  const mapCompanyForDropdown = (companyData) => {
    const availableCompanies = companyData[0];
    const companyList = [];
    availableCompanies.forEach((item) => {
      companyList.push({
        value: {
          companyName: item.company,
          key: item.key,
        },
        label: item.company,
      });
    });
    return companyList;
  };

  const validateRoleSelection = (inviteData) => {
    let isValid = true;
    inviteData.forEach((item) => {
      // eslint-disable-next-line prefer-destructuring
      if (item.Role === undefined) {
        isValid = false;
      }
    });
    setIsValidInvite(isValid);
    return isValid;
  };

  const invite = () => {
    const inviteDataList = [];
    const recruiter = {
      UserInvitationRecruiterUserKey: props.recruiter.uid,
      UserInvitationRecruiterProfileKey: props.recruiter.profile.id,
      UserInvitationRecruiterProfileFirstName: props.recruiter.profile.ProfileFirstname,
      UserInvitationRecruiterProfileSurName: props.recruiter.profile.ProfileSurname,
    };
    const role = updateRole;
    const position = updatePosition;
    const invites = existingInvited.concat(nonExistingInvited);
    invites.forEach((item) => {
      // eslint-disable-next-line prefer-destructuring
      const email = item.email;
      const inviteData = {
        Email: email,
        Role: role[email],
        Position: position[email],
      };
      inviteDataList.push(inviteData);
    });
    if (validateRoleSelection(inviteDataList)) {
      CreateCompanyMultipleInvitation(
        inviteDataList,
        company.key,
        company.companyName,
        recruiter,
      ).subscribe(() => {});
      if (props.clearInput !== undefined) {
        props.clearInput();
      }
      setinvitedEmails([]);
      toggle();
    }
  };

  useImperativeHandle(ref, () => ({
    triggerInviteToCompany(propinvitedEmails, propCompany) {
      clear();
      if (propinvitedEmails.length === 0) {
        setCurrentStep(1);
        setAvailableCompany(mapCompanyForDropdown(propCompany));
      } else {
        setinvitedEmails(propinvitedEmails);
        setCompany(propCompany);
        fetchInvitedUserDetail(propinvitedEmails, propCompany.key);
        setCurrentStep(2);
      }
      toggle();
    },
  }));

  const renderStepOneBody = () => (
    <div>
      <Label htmlFor="company-name">
        <b>Select Company</b>
      </Label>
      <Select
        onChange={handleCompanyInputChange}
        name="company"
        id="company-invite"
        options={availableCompany}
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
      data={existingInvited.concat(nonExistingInvited)}
      column={inviteToCompanyColumns}
      cssClass="company-invite-table"
      wraperClass="company-invite-table-wraper"
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
              : `Invite colleagues to join ${company.companyName}`}
          </b>
        </h2>
      </ModalHeader>
      <ModalBody>
        {currentStep === 1 ? renderStepOneBody() : renderStepTwoBody()}
        {currentStep === 2 && isValidInvite === false ? (
          <Alert color="warning" style={{ margin: 0 }}>
            Role must be select for all invitation.
          </Alert>
        ) : (
          ''
        )}
      </ModalBody>
      <ModalFooter style={{ border: 'none' }}>
        {currentStep === 1 ? (
          <Button
            className="profile-btn create"
            style={{ margin: 'auto' }}
            color="primary"
            onClick={nextStep}
            disabled={!validateInvite()}
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
            {invitedEmails.length}
)
          </Button>
        )}
        {' '}
      </ModalFooter>
    </Modal>
  );
});

export default InviteToCompanyModal;
