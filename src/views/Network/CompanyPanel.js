/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { map } from 'rxjs/operators';
import _ from 'lodash';

import {
  Row, Col, DropdownToggle, Dropdown, Button, Label, Input, ButtonGroup,
} from 'reactstrap';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Select from 'react-select';
import MainDataTable from '../../component/MainDataTable';
import MultiSelectTextInput from '../../component/MultiSelectTextInput';
import InviteToCompanyModal from '../../component/InviteToCompanyModal';

import { incomingRequestColumns, memberDataColumns } from '../../constants/network';

import { UpdateCompany, GetCompanyDetail } from '../../service/company/company';
import {
  GetCompanyRequest,
  UpdateUserRequestStatus,
  UpdateCompanyRequestStatus,
} from '../../service/join/request';

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

const mockMember = [
  {
    name: 'John Jerald',
    email: 'john@gmail.com',
    position: 'AAAAA',
    role: 'Admin',
    status: 'Active',
  },
  {
    name: 'ABC BCS',
    email: 'john@gmail.com',
    position: 'AAAAA',
    role: 'Admin',
    status: 'Active',
  },
  {
    name: 'OOPP OOPPP',
    email: 'john@gmail.com',
    position: 'AAAAA',
    role: 'Admin',
    status: 'Active',
  },
  {
    name: 'Jim buttcaller',
    email: 'john@gmail.com',
    position: 'AAAAA',
    role: 'Admin',
    status: 'Active',
  },
];

const mockRoleList = [
  {
    value: {
      role: 'Admin',
    },
    label: 'Admin',
  },
  {
    value: {
      role: 'Manager',
    },
    label: 'Manager',
  },
  {
    value: {
      role: 'Staff',
    },
    label: 'Staff',
  },
];

const { SearchBar } = Search;

const renderStatus = (status, keys, listener) => {
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
  const [updateRole, setUpdateRole] = useState({});
  const [updatePosition, setUpdatePosition] = useState({});

  const inviteToCompanyModalRef = useRef(null);
  const fileInput = useRef(null);

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

  const responseToRequest = (keys, status) => {
    UpdateCompanyRequestStatus(keys.cKey, keys.rKey, status);
    UpdateUserRequestStatus(keys.uKey, keys.rKey, status);
  };

  const fetchIncomingRequest = (companyKey) => {
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
                options={mockRoleList}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Choose Role"
                onChange={input => handleRoleInputChange(input, item.UserRequestUserKey)}
              />
            ),
            status: renderStatus(
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
    GetCompanyDetail('oFT40OYTReLd6GQR1kIv').subscribe({
      next: (snapshot) => {
        const data = snapshot.data();
        setCompany(data);
      },
      error: (err) => {
        console.log(err);
        alert(err.message);
      },
      complete: () => {
        console.log('TO DO LOG');
      },
    });
    fetchIncomingRequest('oFT40OYTReLd6GQR1kIv');
  }, []);

  const toggleEdit = () => {
    if (isEdit) {
      UpdateCompany('oFT40OYTReLd6GQR1kIv', company);
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
    const companyKey = 'oFT40OYTReLd6GQR1kIv';
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

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="company-container">
        <InviteToCompanyModal ref={inviteToCompanyModalRef} />
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
                    src={company.CompanyImageLink}
                    className="img-avatar"
                    alt="admin@bootstrapmaster.com"
                  />
                </div>
              </DropdownToggle>
            </Dropdown>
            <Button className="company-access-btn">
              <i className="cui-wrench icons" style={{ marginRight: '0.5rem' }} />
              Accessibility Settings
            </Button>
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
              <p className="profile-email">
                <em>
                  ID:
                  {company.CompanyID}
                </em>
              </p>
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
                <p>{company.CompanyAboutUs}</p>
              )}
            </Row>
            <Row style={{ paddingTop: '2rem' }}>
              <a href="/#/network">{company.CompanyWebsiteUrl}</a>
            </Row>
          </Col>
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
              />
              <Button
                className="company-invite-btn"
                // eslint-disable-next-line max-len
                onClick={() => inviteToCompanyModalRef.current.triggerInviteToCompany(invitedEmails, {
                  companyName: 'Test Company Y',
                  key: 'oFT40OYTReLd6GQR1kIv',
                })
                }
              >
                Invite
              </Button>
            </Row>
          </Col>
        </Row>
      </div>
      <div className="incoming-request-container">
        <div className="company-table-label">
          <Row>
            <h4>Incoming Request (1)</h4>
          </Row>
        </div>
        <MainDataTable
          data={incomingRequest}
          column={incomingRequestColumns}
          cssClass="company-table"
          wraperClass="company-table-wraper"
          isBorder={false}
        />
      </div>
      <div className="company-member-container">
        <ToolkitProvider keyField="name" data={mockMember} columns={memberDataColumns} search>
          {toolKitProps => (
            <div>
              <div className="company-table-label">
                <Row>
                  <Col xs={7} style={{ paddingLeft: 0 }}>
                    <h4>
Members (
                      {mockMember.length}
)
                    </h4>
                  </Col>
                  <Col xs={3} style={{ paddingRight: 0 }}>
                    <SearchBar
                      placeholder="&#xF002; Typing"
                      style={{ width: '210%' }}
                      {...toolKitProps.searchProps}
                    />
                  </Col>
                  <Col xs={2} style={{ paddingLeft: 0 }}>
                    <Select
                      isMulti
                      name="colors"
                      id="role-filter"
                      className="basic-multi-select role-filter-select"
                      classNamePrefix="select"
                      placeholder="Admin (4)"
                    />
                  </Col>
                </Row>
              </div>
              <MainDataTable
                toolkitbaseProps={{ ...toolKitProps.baseProps }}
                data={mockMember}
                column={memberDataColumns}
                cssClass="company-table member"
                wraperClass="company-table-wraper"
                isBorder={false}
                toolkit="search"
              />
            </div>
          )}
        </ToolkitProvider>
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

export default connect(mapStateToProps)(CompanyPanel);
