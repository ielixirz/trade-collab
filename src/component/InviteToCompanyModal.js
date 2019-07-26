/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable filenames/match-regex */
/* as it is component */
import React, {
 useState, forwardRef, useImperativeHandle, useEffect, useRef,
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
import _ from 'lodash';
import BlockUi from 'react-block-ui';

import Select from 'react-select';
import MultiSelectTextInput from './MultiSelectTextInput';
import MainDataTable from './MainDataTable';

import { inviteToCompanyColumns } from '../constants/network';
import { GetUserInfoFromEmail } from '../service/user/user';
import { CreateNonUserInvite } from '../service/inviteNonSystemUser/inviteNonSystemUser';
import { GetCompanyUserAccessibility, IsCompanyMember } from '../service/company/company';
import { GetProlfileList } from '../service/user/profile';
import { CreateCompanyMultipleInvitation } from '../service/join/invite';
import { CombineIsExistInvitationRequest } from '../service/join/utiljoin';
import { DeepCopyArray } from '../utils/parsing';
import { AddDay } from '../utils/date';

const InviteToCompanyModal = forwardRef((props, ref) => {
  const [modal, setModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [invitedEmails, setinvitedEmails] = useState([]);
  const [existingInvited, setExistingInvited] = useState([]);
  const [pendingMemberInvited, setPendingMemberInvited] = useState();
  const [alreadyMemberInvited, setAlreadyMemberInvited] = useState([]);
  const [nonExistingInvited, setNonExistingInvited] = useState([]);
  const [updateRole, setUpdateRole] = useState({});
  const [updatePosition, setUpdatePosition] = useState({});
  const [company, setCompany] = useState('');
  const [availableCompany, setAvailableCompany] = useState([]);
  const [isValidInvite2, setIsValidInvite2] = useState(undefined);
  const [isValidInvite1, setIsValidInvite1] = useState(undefined);
  const [isEmailDuplicate, setIsEmailDuplicate] = useState(undefined);
  const [blocking, setBlocking] = useState(false);

  const inviteInput = useRef(null);

  const clear = () => {
    setExistingInvited([]);
    setNonExistingInvited([]);
    setAlreadyMemberInvited([]);
    setUpdateRole({});
    setUpdatePosition({});
    setIsValidInvite1(undefined);
    setIsValidInvite2(undefined);
    setIsEmailDuplicate(undefined);
  };

  useEffect(() => {
    // clear();
  }, [invitedEmails, isValidInvite1, isValidInvite2]);

  const handleInputPositionChange = (event, email) => {
    const temp = updatePosition;
    temp[email] = event.target.value;
    setUpdatePosition(temp);
  };

  const handleRoleInputChange = (input, email) => {
    const temp = updateRole;
    temp[email] = {
      role: input.value.role,
      code: input.value.code,
    };
    setUpdateRole(temp);
  };

  const handleCompanyInputChange = (input) => {
    setCompany(input.value);
  };

  const handleInviteInputChange = (emails) => {
    setinvitedEmails(emails);
  };

  const fetchInvitedUserDetail = (emails, companyKey) => {
    setBlocking(true);
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
            code: matrix.CompanyUserAccessibilityRolePermissionCode,
          },
          label: matrix.CompanyUserAccessibilityRoleName,
        }));

        combineLatest(userObs).subscribe((results1) => {
          const profileObs = [];
          const inviteAlreadyPendingEntities = [];
          const inviteAlreadyMemberEntities = [];
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
              };
              inviteNotExistEntities.push(inviteEntity);
              n += 1;
            }
          });
          setNonExistingInvited(inviteNotExistEntities);
          setBlocking(false);
          combineLatest(profileObs).subscribe((results2) => {
            setBlocking(true);
            const loopOne = DeepCopyArray(results2);
            const loopTwo = DeepCopyArray(results2);
            const memberCheckObs = [];
            const pendingCheckObs = [];
            // First loop to check isMember
            loopOne.forEach((result) => {
              const firstProfile = result.pop();
              memberCheckObs.push(IsCompanyMember(companyKey, firstProfile.key));
              pendingCheckObs.push(CombineIsExistInvitationRequest(firstProfile.key, companyKey));
            });
            combineLatest(memberCheckObs.concat(pendingCheckObs)).subscribe((isInvitable) => {
              const isInvitableChunk = _.chunk(isInvitable, isInvitable.length / 2);
              const isMemberList = isInvitableChunk[0];
              const isPendingList = isInvitableChunk[1];
              // Second loop to populate invite
              loopTwo.forEach((result, index) => {
                const firstProfile = result.pop();
                if (isMemberList[index]) {
                  const inviteEntity = {
                    key: null,
                    name: <i style={{ color: 'grey' }}>Already a Member</i>,
                    email: firstProfile.email,
                    position: '-',
                    role: '-',
                  };
                  inviteAlreadyMemberEntities.push(inviteEntity);
                } else if (isPendingList[index]) {
                  const inviteEntity = {
                    key: null,
                    name: <i style={{ color: 'grey' }}>Invite/Request Already Sent</i>,
                    email: firstProfile.email,
                    position: '-',
                    role: '-',
                  };
                  inviteAlreadyPendingEntities.push(inviteEntity);
                } else {
                  // TO-DO get first profile for now
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
                  };
                  inviteExistEntities.push(inviteEntity);
                }
              });
              setPendingMemberInvited(inviteAlreadyPendingEntities);
              setAlreadyMemberInvited(inviteAlreadyMemberEntities);
              setExistingInvited(inviteExistEntities);
              setBlocking(false);
            });
          });
        });
      });
  };

  const toggle = () => {
    setModal(!modal);
  };

  const validateInvite = (emails) => {
    if (company === '' || emails.length === 0) {
      setIsValidInvite1(false);
      return false;
    }
    if (emails.value) {
      if (emails.value.length === 0) {
        setIsValidInvite1(false);
        return false;
      }
    }
    setIsValidInvite1(true);
    return true;
  };

  const lockInviteInput = () => inviteInput.current.handleLockInLastInput();

  const nextStep = () => {
    const lastInvite = lockInviteInput();
    let allInvites = [...invitedEmails];
    if (lastInvite !== undefined) {
      allInvites = allInvites.concat(lastInvite);
      setinvitedEmails(allInvites);
    }
    if (validateInvite(allInvites)) {
      setCurrentStep(currentStep + 1);
      fetchInvitedUserDetail(allInvites, company.key);
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
    setIsValidInvite2(isValid);
    return isValid;
  };

  const invite = () => {
    setBlocking(true);
    const inviteDataList = [];
    const nonUserInviteDataList = [];
    const recruiter = {
      CompanyInvitationRecruiterUserKey: props.recruiter.uid,
      CompanyInvitationRecruiterProfileKey: props.recruiter.profile.id,
      CompanyInvitationRecruiterProfileFirstName: props.recruiter.profile.ProfileFirstname,
      CompanyInvitationRecruiterProfileSurName: props.recruiter.profile.ProfileSurname,
    };
    const role = updateRole;
    const position = updatePosition;
    existingInvited.forEach((item) => {
      // eslint-disable-next-line prefer-destructuring
      const email = item.email;
      const inviteData = {
        Email: email,
        Role: role[email].role,
        RoleCode: role[email].code,
        Position: position[email] === undefined ? '' : position[email],
      };
      inviteDataList.push(inviteData);
    });
    nonExistingInvited.forEach((item) => {
      // eslint-disable-next-line prefer-destructuring
      const email = item.email;
      const inviteData = {
        Email: email,
        Role: role[email].role,
        RoleCode: role[email].code,
        Position: position[email] === undefined ? '' : position[email],
      };
      nonUserInviteDataList.push(inviteData);
    });
    if (validateRoleSelection(inviteDataList) && validateRoleSelection(nonUserInviteDataList)) {
      CreateCompanyMultipleInvitation(
        inviteDataList,
        company.key,
        company.companyName,
        recruiter,
      ).subscribe(() => {});
      nonUserInviteDataList.forEach((i) => {
        CreateNonUserInvite({
          CompanyKey: company.key,
          CompanyMemberRoleName: i.Role,
          CompanyMemberPosition: i.Position,
          CompanyUserAccessibilityRolePermissionCode: i.RoleCode,
          NonUserInviteType: 'Company',
          NonUserInviteEmail: i.Email,
          NonUserInviteRecruiterUserKey: recruiter.CompanyInvitationRecruiterUserKey,
          NonUserInviteRecruiterProfileKey: recruiter.CompanyInvitationRecruiterProfileKey,
          NonUserInviteRecruiterProfileFirstName:
            recruiter.CompanyInvitationRecruiterProfileFirstName,
          NonUserInviteRecruiterProfileSurName: recruiter.CompanyInvitationRecruiterProfileSurName,
          NonUserInviteRecruiterCompanyName: company.companyName,
          NonUserInviteRecruiterCompanyKey: company.key,
          NonUserInviteExpiryDate: AddDay(new Date(), 28).toDate(),
        });
      });
      setBlocking(false);
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
        setCompany('');
        setinvitedEmails([]);
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
      {isEmailDuplicate ? (
        <span className="field-error-msg fadable" style={{ float: 'right', marginTop: '1rem' }}>
          You already entered this email.
        </span>
      ) : (
        ''
      )}
      <MultiSelectTextInput
        id="invite-email"
        getValue={handleInviteInputChange}
        placeholder="Write email address.."
        ref={inviteInput}
        handleDuplication
        duplicationCallback={(isDub) => {
          setIsEmailDuplicate(isDub);
        }}
      />
    </div>
  );

  const renderStepTwoBody = () => (
    <MainDataTable
      data={existingInvited.concat(nonExistingInvited, pendingMemberInvited, alreadyMemberInvited)}
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
      <ModalBody style={{ minHeight: 200 }}>
        <BlockUi tag="div" blocking={blocking} style={{ height: '100%' }}>
          {currentStep === 1 ? renderStepOneBody() : renderStepTwoBody()}
          {currentStep === 1 && isValidInvite1 === false ? (
            <Alert color="warning" style={{ marginTop: 10, marginBottom: 0 }}>
              Please select your
              {' '}
              <b>company</b>
              {' '}
and enter your invitee
              {' '}
              <b>email</b>
.
            </Alert>
          ) : (
            ''
          )}
          {currentStep === 2 && isValidInvite2 === false ? (
            <Alert color="warning" style={{ margin: 0 }}>
              Role must be select for all invitation.
            </Alert>
          ) : (
            ''
          )}
        </BlockUi>
      </ModalBody>
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
            disabled={existingInvited.concat(nonExistingInvited).length === 0}
          >
            Send Invitation (
            {existingInvited.concat(nonExistingInvited).length}
)
          </Button>
        )}
        {' '}
      </ModalFooter>
    </Modal>
  );
});

export default InviteToCompanyModal;
