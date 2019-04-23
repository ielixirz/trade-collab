/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React, { useState } from 'react';
import {
  Row, Col, DropdownToggle, Dropdown, Button, Label,
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

const { SearchBar } = Search;

const CompanyPanel = (props) => {
  const [company, setCompany] = useState(mockCompany);

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
              <h4>{company.name}</h4>
              <i className="cui-pencil icons" style={{ marginLeft: '2rem', fontSize: 'medium' }} />
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
              <p style={{ marginBottom: '0.1rem' }}>{company.tel}</p>
            </Row>
            <Row>
              <p>{company.desc}</p>
            </Row>
            <Row style={{ paddingTop: '3rem' }}>
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
        <ToolkitProvider keyField="id" data={[]} columns={memberDataColumns} search>
          {toolKitProps => (
            <div>
              <div className="company-table-label">
                <Row>
                  <Col xs={7} style={{ paddingLeft: 0 }}>
                    <h4>Members (3)</h4>
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
                data={[]}
                column={memberDataColumns}
                cssClass="company-table"
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
