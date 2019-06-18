/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import _ from 'lodash';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

import {
  Row, Col, DropdownToggle, Dropdown, Button, Label, Input, ButtonGroup,
} from 'reactstrap';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Select from 'react-select';
import MainDataTable from '../../component/MainDataTable';
import MultiSelectTextInput from '../../component/MultiSelectTextInput';
import InviteToCompanyModal from '../../component/InviteToCompanyModal';
import TurnAbleTextLabel from '../../component/TurnAbleTextLabel';
import ThreeDotDropdown from '../../component/ThreeDotDropdown';

import { incomingRequestColumns, memberDataColumns } from '../../constants/network';
import {
  UpdateCompany,
  GetCompanyDetail,
  GetCompanyMember,
  IsCompanyMember,
  UpdateCompanyMember,
  GetCompanyUserAccessibility,
} from '../../service/company/company';
import { GetProlfileList } from '../../service/user/profile';

import {
  GetCompanyRequest,
  UpdateUserRequestStatus,
  UpdateCompanyRequestStatus,
} from '../../service/join/request';

import { GetCompanyInvitation } from '../../service/join/invite';

import {
  PutFile,
  GetMetaDataFromStorageRefPath,
  GetURLFromStorageRefPath,
} from '../../service/storage/managestorage';

const mockCompany = {
  name: 'Fresh Produce Co. Ltd.',
  id: 123456,
  tel: '080-000-0000',
  desc: '123 ABC Rd., Bangkok 10000 Thailand',
  website: 'www.website.com',
};

const initRoleList = [
  {
    value: {
      role: 'ALL',
    },
    label: 'ALL',
  },
];

const { SearchBar } = Search;

const renderMemberStatus = (status) => {
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
  return '';
};

const renderRequestStatus = (status, keys, listener) => {
  if (status === 'Pending') {
    return (
      <div>
        <ButtonGroup>
          <Button
            onClick={() => listener(keys, 'Reject')}
            className="profile-company-status-btn reject"
          >
            Reject
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button
            onClick={() => listener(keys, 'Approve')}
            className="profile-company-status-btn join"
          >
            Approve
          </Button>
        </ButtonGroup>
      </div>
    );
  }
  return '';
};
const CompanyPanel = (props) => {
  const [company, setCompany] = useState(mockCompany);
  const [invitedEmails, setinvitedEmails] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [incomingRequest, setIncomingRequest] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [roleList, setRoleList] = useState(initRoleList);
  const [filterRole, setFilterRole] = useState(undefined);
  const [updateRole, setUpdateRole] = useState({});
  const [updatePosition, setUpdatePosition] = useState({});
  const [acceptedRequest, setAcceptedRequest] = useState(undefined);
  const [isMember, setIsMember] = useState(false);
  const [blocking, setBlocking] = useState(false);

  const inviteToCompanyModalRef = useRef(null);
  const fileInput = useRef(null);
  const inviteInput = useRef(null);

  const handleInputPositionChange = (event, key) => {
    const temp = updatePosition;
    temp[key] = event.target.value;
    setUpdatePosition(temp);
  };

  const handleRoleInputChange = (input, key) => {
    const temp = updateRole;
    temp[key] = input.value.role;
    setUpdateRole(temp);
  };

  const updateMember = (companyKey, userKey, data) => {
    UpdateCompanyMember(companyKey, userKey, data);
  };

  const validateMembership = (companyKey, userKey) => {
    IsCompanyMember(companyKey, userKey).subscribe((member) => {
      setIsMember(member);
    });
  };

  const filterMemberRole = (role, member) => {
    let filterMembers = member;
    if (role !== 'ALL') {
      filterMembers = member.filter((m) => {
        if (m.role.props === undefined) {
          return m.role === role;
        }
        return m.role.props.text === role;
      });
    }
    return filterMembers;
  };

  const fetchMember = (companyKey, companyRoles) => {
    setBlocking(true);
    combineLatest([
      GetCompanyInvitation(companyKey).pipe(
        map(docs => docs.map((d) => {
          const data = d.data();
          data.key = d.id;
          return data;
        })),
      ),
      GetCompanyMember(companyKey).pipe(
        map(docs => docs.map((d) => {
          const data = d.data();
          data.key = d.id;
          return data;
        })),
      ),
    ]).subscribe((data) => {
      const members = [];
      const invited = [];
      const profileObs = [];
      _.forEach(data[1], (member) => {
        members.push({
          name: '-',
          email: member.UserMemberEmail,
          position: (
            <TurnAbleTextLabel
              text={member.UserMemberPosition}
              turnType="input"
              data={{
                onChangeFn: null,
                onKeyPressFn: event => updateMember(companyKey, member.key, {
                  UserMemberPosition: event.target.value,
                }),
              }}
            />
          ),
          role: (
            <TurnAbleTextLabel
              text={member.UserMemberRoleName}
              turnType="dropdown"
              data={{
                options: companyRoles,
                onChangeFn: input => updateMember(companyKey, member.key, { UserMemberRoleName: input.value.role }),
              }}
            />
          ),
          status: renderMemberStatus(member.UserMemberCompanyStandingStatus),
          button: (
            <ThreeDotDropdown
              options={[
                {
                  text: 'Deactivate',
                  function: () => updateMember(companyKey, member.key, {
                    UserMemberCompanyStandingStatus: 'Deactivated',
                  }),
                },
                {
                  text: 'Activate',
                  function: () => updateMember(companyKey, member.key, {
                    UserMemberCompanyStandingStatus: 'Active',
                  }),
                },
              ]}
            />
          ),
        });
        profileObs.push(GetProlfileList(member.key).pipe(map(docs2 => docs2.map(d2 => d2.data()))));
      });
      _.forEach(data[0], (invite) => {
        if (invite.UserInvitationStatus === 'Pending') {
          invited.push({
            name: `${invite.UserInvitationFirstname} ${invite.UserInvitationSurname}`,
            email: invite.UserInvitationEmail,
            position: invite.UserInvitationPosition,
            role: invite.UserInvitationRole,
            status: renderMemberStatus('Pending'),
          });
        }
      });
      combineLatest(profileObs).subscribe((users) => {
        _.forEach(users, (profile, index) => {
          members[index].name = `${profile[0].ProfileFirstname} ${profile[0].ProfileSurname}`;
        });
        setBlocking(false);
        setMemberList(members.concat(invited));
      });
    });
  };

  const responseToRequest = (keys, status) => {
    if (updateRole[keys.uKey] !== undefined) {
      UpdateCompanyRequestStatus(
        keys.cKey,
        keys.rKey,
        status,
        updateRole[keys.uKey],
        'rolePermissionCode',
        updatePosition[keys.uKey] === undefined ? '-' : updatePosition[keys.uKey],
      );
      UpdateUserRequestStatus(keys.uKey, keys.rKey, status);
      setAcceptedRequest({
        updateKey: keys,
        status,
      });
    }
  };

  const fetchIncomingRequest = (companyKey, companyRoles) => {
    GetCompanyRequest(companyKey)
      .pipe(map(docs => docs.map(d => d.data())))
      .subscribe((results) => {
        const entries = [];
        _.forEach(results, (item) => {
          const entry = {
            name: `${item.UserRequestFristname} ${item.UserRequestSurname}`,
            email: item.UserRequestEmail,
            position: (
              <Input
                type="text"
                id="position"
                placeholder="Position"
                onChange={event => handleInputPositionChange(event, item.UserRequestUserKey)}
              />
            ),
            role: (
              <Select
                name="company"
                id="company-invite"
                options={companyRoles}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Role"
                onChange={input => handleRoleInputChange(input, item.UserRequestUserKey)}
              />
            ),
            status: renderRequestStatus(
              item.UserRequestStatus,
              {
                uKey: item.UserRequestUserKey,
                cKey: item.UserRequestCompanyKey,
                rKey: item.UserRequestKey,
              },
              responseToRequest,
            ),
          };
          entries.push(entry);
        });
        setIncomingRequest(entries);
      });
  };

  useEffect(() => {
    validateMembership(props.match.params.key, props.auth.uid);
    GetCompanyDetail(props.match.params.key).subscribe({
      next: (snapshot) => {
        const data = snapshot.data();
        setCompany(data);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('TO DO LOG');
      },
    });
    GetCompanyUserAccessibility(props.match.params.key)
      .pipe(map(docs => docs.map(d => d.data())))
      .subscribe((userMatrix) => {
        const initRoles = [...roleList];
        const roles = userMatrix.map(matrix => ({
          value: {
            role: matrix.CompanyUserAccessibilityRoleName,
          },
          label: matrix.CompanyUserAccessibilityRoleName,
        }));
        const companyRoles = initRoles.concat(roles);
        setRoleList(companyRoles);
        fetchIncomingRequest(props.match.params.key, roles);
        fetchMember(props.match.params.key, companyRoles);
      });
  }, [acceptedRequest]);

  const toggleEdit = () => {
    if (isEdit) {
      UpdateCompany(props.match.params.key, company);
    }
    setIsEdit(!isEdit);
  };

  const handleInviteInputChange = (emails) => {
    setinvitedEmails(emails);
  };

  const handleCompanyInputChange = (event) => {
    const editedCompany = company;
    const inputName = event.target.id;
    const inputValue = event.target.value;

    if (inputName === 'name') {
      editedCompany.CompanyName = inputValue;
    } else if (inputName === 'tel') {
      editedCompany.CompanyTelNumber = inputValue;
    } else if (inputName === 'desc') {
      editedCompany.CompanyAboutUs = inputValue;
    }

    setCompany(editedCompany);
  };

  const browseFile = () => {
    fileInput.current.value = null;
    fileInput.current.click();
  };

  const changeCompanyPic = (file) => {
    const companyKey = props.match.params.key;
    const editedCompany = company;
    const storageRefPath = `/Company/${companyKey}/${new Date().valueOf()}${file.name}`;
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
                editedCompany.CompanyImageLink = url;
                UpdateCompany(companyKey, editedCompany);
              },
              complete: () => {},
            });
          },
        });
      },
    });
  };

  const clearInviteInput = () => {
    setinvitedEmails([]);
    inviteInput.current.handleClear();
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <BlockUi tag="div" blocking={blocking} style={{ height: '100%' }}>
        <div className="company-container">
          <InviteToCompanyModal ref={inviteToCompanyModalRef} clearInput={clearInviteInput} />
          <input
            type="file"
            id="file"
            ref={fileInput}
            style={{ display: 'none' }}
            onChange={event => changeCompanyPic(event.target.files[0])}
          />
          <Row style={{ height: '100%' }}>
            <Col xs={2} className="col-company-pic">
              <Dropdown>
                <DropdownToggle className="network-pic-btn">
                  <div role="button" onClick={browseFile} onKeyDown={null} tabIndex="-1">
                    <img
                      style={{ width: '70%' }}
                      src={
                        company.CompanyImageLink === undefined
                          ? '../assets/img/default-grey.jpg'
                          : company.CompanyImageLink
                      }
                      className="img-avatar"
                      alt="admin@bootstrapmaster.com"
                    />
                  </div>
                </DropdownToggle>
              </Dropdown>
              {isMember ? (
                <Button
                  className="company-access-btn"
                  onClick={() => {
                    window.location.replace(`#/network/company/settings/${props.match.params.key}`);
                  }}
                >
                  <i className="cui-wrench icons" style={{ marginRight: '0.5rem' }} />
                  Accessibility Settings
                </Button>
              ) : (
                ' '
              )}
            </Col>
            <Col xs={6} style={{ marginTop: '1.5rem' }}>
              <Row>
                {isEdit ? (
                  <div>
                    <Input
                      style={{ width: '100%', marginBottom: '0.5rem', paddingRight: '5rem' }}
                      type="text"
                      id="name"
                      placeholder={company.CompanyName}
                      onChange={handleCompanyInputChange}
                    />
                  </div>
                ) : (
                  <h4>{company.CompanyName}</h4>
                )}
                <i
                  className="cui-pencil icons"
                  role="button"
                  style={{
                    marginLeft: '1rem',
                    marginTop: '0.1rem',
                    fontSize: 'medium',
                    cursor: 'pointer',
                  }}
                  onClick={toggleEdit}
                  onKeyDown={null}
                  tabIndex="-1"
                />
              </Row>
              <Row>
                {isEdit ? (
                  <div>
                    <Input
                      style={{ width: '80%', marginBottom: '0.5rem', paddingRight: '5rem' }}
                      type="text"
                      id="tel"
                      placeholder={company.CompanyTelNumber}
                      onChange={handleCompanyInputChange}
                    />
                  </div>
                ) : (
                  <p style={{ marginBottom: '0.1rem' }}>{company.CompanyTelNumber}</p>
                )}
              </Row>
              <Row>
                {isEdit ? (
                  <Input
                    style={{ width: '50%' }}
                    type="textarea"
                    id="desc"
                    placeholder={company.CompanyAboutUs}
                    onChange={handleCompanyInputChange}
                  />
                ) : (
                  <div style={{ height: '50px', width: '50%', wordBreak: 'break-all' }}>
                    <p>{company.CompanyAboutUs === undefined ? '-' : company.CompanyAboutUs}</p>
                  </div>
                )}
              </Row>
              <Row style={{ paddingTop: '2rem' }}>
                <a href="/#/network">{company.CompanyWebsiteUrl}</a>
              </Row>
            </Col>
            {isMember ? (
              <Col xs={4} style={{ marginTop: '1.5rem' }}>
                <Label htmlFor="email-invitation" style={{ color: 'grey' }}>
                  <b>Email invitations</b>
                </Label>
                <Row>
                  <MultiSelectTextInput
                    id="invite-email"
                    getValue={handleInviteInputChange}
                    placeholder="Enter email..."
                    className="company-invitation-select"
                    ref={inviteInput}
                  />
                  <Button
                    className="company-invite-btn"
                    // eslint-disable-next-line max-len
                    onClick={() => {
                      if (invitedEmails.length > 0) {
                        inviteToCompanyModalRef.current.triggerInviteToCompany(invitedEmails, {
                          companyName: company.CompanyName,
                          key: props.match.params.key,
                        });
                      }
                    }}
                  >
                    Invite
                  </Button>
                </Row>
              </Col>
            ) : (
              ''
            )}
          </Row>
        </div>
        {isMember && incomingRequest.length > 0 ? (
          <div className="incoming-request-container">
            <div className="company-table-label">
              <Row>
                <h4>
Incoming Request (
                  {incomingRequest.length}
)
                </h4>
              </Row>
            </div>
            <MainDataTable
              data={incomingRequest}
              column={incomingRequestColumns}
              cssClass="company-table incoming"
              wraperClass="company-table-wraper"
              isBorder={false}
            />
          </div>
        ) : (
          ''
        )}
        {isMember ? (
          <ToolkitProvider keyField="name" data={memberList} columns={memberDataColumns} search>
            {toolKitProps => (
              <div className="company-member-container">
                <div className="company-table-label">
                  <Row>
                    <Col xs={7} style={{ paddingLeft: 0 }}>
                      <h4>
Members (
                        {memberList.length}
)
                      </h4>
                    </Col>
                    <Col xs={3} style={{ paddingRight: 0 }}>
                      <SearchBar
                        placeholder="&#xF002; Typing"
                        style={{ width: '150%' }}
                        {...toolKitProps.searchProps}
                      />
                    </Col>
                    <Col xs={2} style={{ paddingLeft: 0 }}>
                      <Select
                        name="colors"
                        id="role-filter"
                        className="basic-multi-select role-filter-select"
                        classNamePrefix="select"
                        placeholder="Filter Role"
                        options={roleList}
                        onChange={event => setFilterRole(event.value.role)}
                      />
                    </Col>
                  </Row>
                </div>
                <MainDataTable
                  toolkitbaseProps={{ ...toolKitProps.baseProps }}
                  data={memberList}
                  filter={filterMemberRole}
                  filterKeyword={filterRole}
                  isFilter={filterRole !== undefined}
                  column={memberDataColumns}
                  cssClass="company-table member"
                  wraperClass="company-table-wraper"
                  isBorder={false}
                  toolkit="search"
                />
              </div>
            )}
          </ToolkitProvider>
        ) : (
          ''
        )}
      </BlockUi>
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

export default connect(mapStateToProps)(CompanyPanel);
