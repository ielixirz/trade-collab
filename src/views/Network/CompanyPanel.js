/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React, { useState } from 'react';
import {
  Row, Col, DropdownToggle, Dropdown, Button, Label, Input,
} from 'reactstrap';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Select from 'react-select';
import MainDataTable from '../../component/MainDataTable';

import { incomingRequestColumns, memberDataColumns } from '../../constants/network';

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

  const toggleEdit = () => {
    if (isEdit) {
      // TO-DO : fire edit service
    }
    setIsEdit(!isEdit);
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
                    placeholder={company.name}
                  />
                </div>
              ) : (
                <h4>{company.name}</h4>
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
                  {company.id}
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
                    placeholder={company.tel}
                  />
                </div>
              ) : (
                <p style={{ marginBottom: '0.1rem' }}>{company.tel}</p>
              )}
            </Row>
            <Row>
              {isEdit ? (
                <Input
                  style={{ width: '50%' }}
                  type="textarea"
                  id="desc"
                  placeholder={company.desc}
                />
              ) : (
                <p>{company.desc}</p>
              )}
            </Row>
            <Row style={{ paddingTop: '2rem' }}>
              <a href="/#/network">{company.website}</a>
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

export default CompanyPanel;
