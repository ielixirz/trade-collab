/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import {
  Row, Col, DropdownToggle, Dropdown, Button, Label, Input,
} from 'reactstrap';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Select from 'react-select';
import MainDataTable from '../../component/MainDataTable';

import { incomingRequestColumns, memberDataColumns } from '../../constants/network';

import { UpdateCompany, GetCompanyDetail } from '../../service/company/company';

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

const { SearchBar } = Search;

const CompanyPanel = (props) => {
  const [company, setCompany] = useState(mockCompany);
  const [isEdit, setIsEdit] = useState(false);

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
        'TO DO LOG';
      },
    });
  }, []);

  const toggleEdit = () => {
    if (isEdit) {
      UpdateCompany('oFT40OYTReLd6GQR1kIv', company);
    }
    setIsEdit(!isEdit);
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

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="company-container">
        <Row style={{ height: '100%' }}>
          <Col xs={2} className="col-company-pic">
            <Dropdown>
              <DropdownToggle className="network-pic-btn">
                <img
                  style={{ width: '70%' }}
                  src="../../assets/img/avatars/6.jpg"
                  className="img-avatar"
                  alt="admin@bootstrapmaster.com"
                />
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
              <Select
                isMulti
                name="colors"
                id="email-invitation"
                className="basic-multi-select company-invitation-select"
                classNamePrefix="select"
                placeholder="Enter email..."
              />
              <Button className="company-invite-btn">Invite</Button>
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
          data={[]}
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
