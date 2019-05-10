/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Row,
  Col,
  DropdownToggle,
  Dropdown,
  Button,
  Input,
  ButtonGroup,
  ButtonToolbar,
} from 'reactstrap';

import MainDataTable from '../../component/MainDataTable';
import ThreeDotDropdown from '../../component/ThreeDotDropdown';
import CreateCompanyModal from '../../component/CreateCompanyModal';
import RequestToJoinModal from '../../component/RequestToJoinModal';

import { profileColumns } from '../../constants/network';

import { UpdateProfile } from '../../service/user/profile';
import { GetUserRequest } from '../../service/join/request';
import { GetUserInvitation } from '../../service/join/invite';

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

// This function will be move after actual company fetching is complete
const renderStatus = (status) => {
  if (status === 'Invited') {
    return (
      <div>
        <ButtonGroup>
          <Button className="profile-company-status-btn reject">Reject</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button className="profile-company-status-btn join">Join</Button>
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

const ProfilePanel = ({ currentProfile, auth }) => {
  const [userProfile, setUserProfile] = useState(mockProfile);
  const [companyList, setCompanyList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const createCompanyModalRef = useRef(null);
  const fileInput = useRef(null);
  const requestToJoinModalRef = useRef(null);

  const fetchCompany = (userKey) => {
    const requestList = [];
    const inviteList = [];

    zip(
      GetUserRequest(userKey).pipe(map(docs => docs.map(d => d.data()))),
      GetUserInvitation(userKey).pipe(map(docs => docs.map(d => d.data()))),
    ).subscribe(([requests, invitations]) => {
      requests.forEach((item) => {
        requestList.push({
          company: item.CompanyRequestCompanyName,
          position: '-',
          role: '-',
          status: renderStatus(item.CompanyRequestStatus),
          button: (
            <ThreeDotDropdown
              options={[
                {
                  text: 'Leave',
                  function: null,
                },
              ]}
            />
          ),
        });
      });

      invitations.forEach((item) => {
        inviteList.push({
          company: item.CompanyInvitationName,
          position: item.CompanyInvitationPosition,
          role: item.CompanyInvitationRole,
          status: renderStatus(item.CompanyInvitationStatus),
          button: (
            <ThreeDotDropdown
              options={[
                {
                  text: 'Leave',
                  function: null,
                },
              ]}
            />
          ),
        });
      });

      setCompanyList(requestList.concat(inviteList));
    });
  };

  useEffect(() => {
    console.log(currentProfile);
    setUserProfile(currentProfile);
    fetchCompany(auth.uid);
  }, []);

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
              complete: () => {
                window.location.reload();
              },
            });
          },
        });
      },
    });
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="profile-container">
        <CreateCompanyModal ref={createCompanyModalRef} />
        <RequestToJoinModal
          ref={requestToJoinModalRef}
          userId={auth.uid}
          profile={currentProfile}
        />
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
                    src={userProfile.UserInfoProfileImageLink}
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
                      placeholder={`${userProfile.ProfileFirstname} ${userProfile.ProfileSurname}`}
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
                  <p>{userProfile.Description === undefined ? '-' : userProfile.Description}</p>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={1} />
              <Col xs={4} style={{ paddingTop: '3rem' }}>
                <a href="/#/network">Reset Password</a>
              </Col>
            </Row>
          </Col>
          <Col xs={3} className="col-profile-button">
            <Row>
              <Button className="profile-btn">
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
          data={companyList}
          column={profileColumns}
          cssClass="profile-table"
          wraperClass="profile-table-wraper"
          isBorder={false}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { authReducer, userReducer, profileReducer } = state;
  return {
    auth: authReducer.user,
    user: userReducer.UserInfo,
    currentProfile: profileReducer.ProfileList[0],
  };
};

export default connect(mapStateToProps)(ProfilePanel);
