/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';
import _ from 'lodash';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import '../../scss/ResetPassword.scss';

import {
  Row, Col, DropdownToggle, Dropdown, Button, Input, ButtonGroup,
} from 'reactstrap';

import MainDataTable from '../../component/MainDataTable';
import ThreeDotDropdown from '../../component/ThreeDotDropdown';
import CreateCompanyModal from '../../component/CreateCompanyModal';
import InviteToCompanyModal from '../../component/InviteToCompanyModal';
import RequestToJoinModal from '../../component/RequestToJoinModal';
import ResetPasswordModal from '../../component/ResetPasswordModal';

import { profileColumns } from '../../constants/network';

import { UpdateProfile } from '../../service/user/profile';
import { GetUserCompany } from '../../service/user/user';
import { RemoveFromCompany } from '../../service/company/company';
import { GetUserRequest } from '../../service/join/request';
import {
  GetUserInvitation,
  UpdateCompanyInvitationStatus,
  UpdateUserInvitationStatus,
} from '../../service/join/invite';

import {
  PutFile,
  GetMetaDataFromStorageRefPath,
  GetURLFromStorageRefPath,
} from '../../service/storage/managestorage';

const mockProfile = {
  fullname: 'John Jerald',
  email: 'john@gmail.com',
  desc: 'Fruit Exporter from coconut land',
};

const renderStatus = (status, data, listener) => {
  if (status === 'Invited') {
    return (
      <div>
        <ButtonGroup>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              listener(data, 'Reject');
            }}
            className="profile-company-status-btn reject"
          >
            Reject
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              listener(data, 'Approve');
            }}
            className="profile-company-status-btn join"
          >
            Join
          </Button>
        </ButtonGroup>
      </div>
    );
  }
  if (status === 'Deactivated') {
    return (
      <span style={{ color: '#AFAFAF' }}>
        <b>Deactivated</b>
      </span>
    );
  }
  if (status === 'Active') {
    return (
      <span style={{ color: '#16A085' }}>
        <b>Active</b>
      </span>
    );
  }
  if (status === 'Pending') {
    return (
      <span style={{ color: '#F4BC4D' }}>
        <b>Pending</b>
      </span>
    );
  }
  if (status === 'Reject') {
    return (
      <span style={{ color: '#AFAFAF' }}>
        <b>Reject</b>
      </span>
    );
  }
  return '';
};

const ProfilePanel = ({ currentProfile, auth, user }) => {
  const [userProfile, setUserProfile] = useState(mockProfile);
  const [companyList, setCompanyList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [acceptedInvite, setAcceptedInvite] = useState(undefined);
  const [leaving, setLeaving] = useState(undefined);
  const [newCompany, setNewCompany] = useState(undefined);
  const [blocking, setBlocking] = useState(true);

  const createCompanyModalRef = useRef(null);
  const inviteToCompanyModalRef = useRef(null);
  const resetPasswordModalRef = useRef(null);
  const fileInput = useRef(null);
  const requestToJoinModalRef = useRef(null);

  const toggleBlocking = () => {
    setBlocking(!blocking);
  };

  const leaveCompany = (e, companyKey, memberKey, index) => {
    e.stopPropagation();
    // LeaveCompany(companyKey, memberKey);
    RemoveFromCompany(companyKey, memberKey);
    // eslint-disable-next-line no-use-before-define
    setLeaving({ index, isLeave: true });
  };

  const fetchCompany = (userKey) => {
    const requestList = [];
    const inviteList = [];
    const joinedList = [];

    zip(
      GetUserRequest(userKey),
      GetUserInvitation(userKey).pipe(
        map(docs => docs.map((d) => {
          const data = d.data();
          data.key = d.id;
          return data;
        })),
      ),
      GetUserCompany(userKey),
    ).subscribe(([requests, invitations, joins]) => {
      requests.forEach((item) => {
        requestList.push({
          key: item.CompanyRequestCompanyKey,
          company: item.CompanyRequestCompanyName,
          position: '-',
          role: '-',
          status: renderStatus(item.CompanyRequestStatus),
          button: '',
        });
      });

      let invitedIndex = 0;
      invitations.forEach((item) => {
        const status = item.CompanyInvitationStatus === 'Pending' ? 'Invited' : 'Reject';
        if (status === 'Invited') {
          const inviteData = {
            uKey: userKey,
            cKey: item.CompanyInvitationCompanyKey,
            iKey: item.key,
            cName: item.CompanyInvitationName,
            position: item.CompanyInvitationPosition,
            role: item.CompanyInvitationRole,
            invitedIndex,
          };
          inviteList.push({
            key: item.CompanyInvitationCompanyKey,
            company: item.CompanyInvitationName,
            position: item.CompanyInvitationPosition,
            role: item.CompanyInvitationRole,
            // eslint-disable-next-line no-use-before-define
            status: renderStatus(status, inviteData, responseToInvite),
            button: '',
          });
          invitedIndex += 1;
        }
      });

      joins.forEach((item, index) => {
        joinedList.push({
          key: item.CompanyKey,
          company: item.CompanyName,
          position: item.UserMemberPosition,
          role: item.UserMemberRoleName,
          roleKey: item.UserMatrixRolePermissionCode,
          status: renderStatus(item.UserMemberCompanyStandingStatus),
          button: (
            <ThreeDotDropdown
              options={[
                {
                  text: 'Leave',
                  function: e => leaveCompany(e, item.CompanyKey, userKey, index),
                },
              ]}
            />
          ),
        });
      });
      toggleBlocking();
      setCompanyList([joinedList, inviteList, requestList]);
    });
  };

  const responseToInvite = (data, status) => {
    UpdateCompanyInvitationStatus(data.cKey, data.iKey, status);
    UpdateUserInvitationStatus(data.uKey, data.iKey, status);
    setAcceptedInvite({
      data,
      status,
    });
  };

  const responseToCreate = (company) => {
    toggleBlocking();
    setNewCompany({
      company,
    });
  };

  const updateCompanyList = (update) => {
    const currentList = companyList;
    if (update.isLeave) {
      currentList[0].splice(update.index, 1);
    } else if (update.status === 'Approve') {
      currentList[1].splice(update.data.index, 1);
      currentList[0].push({
        key: update.data.cKey,
        company: update.data.cName,
        position: update.data.position,
        role: update.data.role,
        status: renderStatus('Active', undefined, undefined),
        button: (
          <ThreeDotDropdown
            options={[
              {
                text: 'Leave',
                function: e => leaveCompany(e, update.data.cKey, update.data.uKey),
              },
            ]}
          />
        ),
      });
    } else {
      currentList[1].splice(update.data.index, 1);
    }
    setCompanyList(currentList);
  };

  useEffect(() => {
    setUserProfile(currentProfile);
    if (acceptedInvite) {
      updateCompanyList(acceptedInvite);
    } else if (leaving) {
      updateCompanyList(leaving);
    } else {
      fetchCompany(auth.uid);
    }
  }, [acceptedInvite, newCompany, leaving]);

  const toggleEdit = () => {
    if (isEdit) {
      UpdateProfile(auth.uid, currentProfile.id, userProfile);
    }
    setIsEdit(!isEdit);
  };

  const handleProfileInputChange = (event) => {
    const editedUserProfile = userProfile;
    const inputName = event.target.id;
    const inputValue = event.target.value;

    if (inputName === 'name') {
      const firstnameSurname = inputValue.trim().split(' ');
      [editedUserProfile.ProfileFirstname, editedUserProfile.ProfileSurname] = [
        firstnameSurname[0],
        firstnameSurname[1],
      ];
    } else if (inputName === 'email') {
      editedUserProfile.ProfileEmail = inputValue;
    } else if (inputName === 'desc') {
      editedUserProfile.Description = inputValue;
    }

    setUserProfile(editedUserProfile);
  };

  const browseFile = () => {
    fileInput.current.value = null;
    fileInput.current.click();
  };

  const changeProfilePic = (file) => {
    const editedUserProfile = userProfile;
    const storageRefPath = `/Profile/${currentProfile.id}/${new Date().valueOf()}${file.name}`;
    PutFile(storageRefPath, file).subscribe({
      next: () => {
        console.log('TODO: UPLOAD PROGRESS');
      },
      error: (err) => {
        console.log(err);
        alert(err.message);
      },
      complete: () => {
        GetMetaDataFromStorageRefPath(storageRefPath).subscribe({
          next: (metaData) => {
            GetURLFromStorageRefPath(metaData.ref).subscribe({
              next: (url) => {
                editedUserProfile.UserInfoProfileImageLink = url;
                UpdateProfile(auth.uid, currentProfile.id, editedUserProfile);
              },
              complete: () => {},
            });
          },
        });
      },
    });
  };

  const routeToCompany = (key) => {
    window.location.replace(`#/network/company/${key}`);
  };

  const tableRowEvents = {
    onClick: (e, row) => {
      routeToCompany(row.key);
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <BlockUi tag="div" blocking={blocking} style={{ height: '100%' }}>
        <div className="profile-container">
          <CreateCompanyModal
            ref={createCompanyModalRef}
            userKey={auth.uid}
            userEmail={user.UserInfoEmail}
            updateCompany={responseToCreate}
          />
          <InviteToCompanyModal
            ref={inviteToCompanyModalRef}
            recruiter={{ uid: auth.uid, profile: currentProfile }}
          />
          <RequestToJoinModal
            ref={requestToJoinModalRef}
            userId={auth.uid}
            profile={currentProfile}
          />
          <ResetPasswordModal ref={resetPasswordModalRef} backdrop changeMode redirect={null} />
          <input
            type="file"
            id="file"
            ref={fileInput}
            style={{ display: 'none' }}
            onChange={event => changeProfilePic(event.target.files[0])}
          />
          <Row style={{ height: '100%' }}>
            <Col xs={2} className="col-profile-pic">
              <Dropdown style={{ height: '100%', top: '14%' }}>
                <DropdownToggle className="network-pic-btn">
                  <div role="button" onClick={browseFile} onKeyDown={null} tabIndex="-1">
                    <img
                      style={{ width: '70%' }}
                      src={
                        userProfile.UserInfoProfileImageLink === undefined
                          ? '../assets/img/default-grey.jpg'
                          : userProfile.UserInfoProfileImageLink
                      }
                      className="img-avatar"
                      alt="admin@bootstrapmaster.com"
                    />
                  </div>
                </DropdownToggle>
              </Dropdown>
            </Col>
            <Col xs={7} className="col-profile-info">
              <Row>
                <Col sm={1} style={{ paddingLeft: '0px', paddingRight: '0px', textAlign: 'right' }}>
                  <i
                    className="cui-pencil icons"
                    role="button"
                    style={{ cursor: 'pointer' }}
                    onClick={toggleEdit}
                    onKeyDown={null}
                    tabIndex="-1"
                  />
                </Col>
                <Col xs={9}>
                  {isEdit ? (
                    <div>
                      <Input
                        style={{ width: '40%', marginBottom: '0.5rem' }}
                        type="text"
                        id="name"
                        placeholder={`${userProfile.ProfileFirstname} ${
                          userProfile.ProfileSurname
                        }`}
                        onChange={handleProfileInputChange}
                      />
                    </div>
                  ) : (
                    <h4>{`${userProfile.ProfileFirstname} ${userProfile.ProfileSurname}`}</h4>
                  )}
                </Col>
              </Row>
              <Row>
                <Col xs={1} />
                <Col xs={4}>
                  {isEdit ? (
                    <div>
                      <Input
                        style={{ width: '100%', marginBottom: '0.5rem' }}
                        type="text"
                        id="email"
                        placeholder={userProfile.ProfileEmail}
                        onChange={handleProfileInputChange}
                      />
                    </div>
                  ) : (
                    <p className="profile-email">
                      <em>{userProfile.ProfileEmail}</em>
                    </p>
                  )}
                </Col>
              </Row>
              <Row>
                <Col xs={1} />
                <Col xs={4}>
                  {isEdit ? (
                    <Input
                      style={{ width: '100%' }}
                      type="textarea"
                      id="desc"
                      placeholder={
                        userProfile.Description === undefined ? '-' : userProfile.Description
                      }
                      onChange={handleProfileInputChange}
                    />
                  ) : (
                    <div style={{ height: '50px', wordBreak: 'break-all' }}>
                      <p>{userProfile.Description === undefined ? '-' : userProfile.Description}</p>
                    </div>
                  )}
                </Col>
              </Row>
              <Row style={{ marginTop: '20px' }}>
                <Col xs={1} />
                <Col xs={4}>
                  <span
                    role="button"
                    className="button-as-link"
                    onClick={() => resetPasswordModalRef.current.triggerResetPassword(user.UserInfoEmail)
                    }
                    onKeyDown={null}
                    tabIndex="-1"
                  >
                    Reset Password
                  </span>
                </Col>
              </Row>
            </Col>
            <Col xs={3} className="col-profile-button">
              <Row>
                <Button
                  className="profile-btn"
                  onClick={() => inviteToCompanyModalRef.current.triggerInviteToCompany([], companyList)
                  }
                >
                  <i className="cui-user-follow icons network-btn-icon" />
                  Invite colleagues to join
                </Button>
              </Row>
              <Row>
                <Button
                  onClick={() => requestToJoinModalRef.current.triggerRequestToJoin()}
                  className="profile-btn"
                >
                  <i className="cui-graph icons network-btn-icon" />
                  Request to join Company
                </Button>
              </Row>
              <Row>
                <Button
                  className="profile-btn create"
                  onClick={() => createCompanyModalRef.current.triggerCreateCompany()}
                >
                  <i className="fa fa-plus-circle network-btn-icon" />
                  Create New Company
                </Button>
              </Row>
            </Col>
          </Row>
        </div>
        <div
          className="profile-table-container"
          style={{
            marginLeft: '5rem',
            marginRight: '5rem',
            height: '65%',
          }}
        >
          <MainDataTable
            data={[].concat(...companyList)}
            column={profileColumns}
            cssClass="profile-table"
            wraperClass="profile-table-wraper"
            isBorder={false}
            rowEvents={tableRowEvents}
          />
        </div>
      </BlockUi>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { authReducer, userReducer, profileReducer } = state;
  const profile = _.find(
    profileReducer.ProfileList,
    item => item.id === profileReducer.ProfileDetail.id,
  );
  return {
    auth: authReducer.user,
    user: userReducer.UserInfo,
    currentProfile: profile,
  };
};

export default connect(mapStateToProps)(ProfilePanel);
