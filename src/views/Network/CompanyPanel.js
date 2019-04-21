/* eslint-disable filenames/match-regex */
import React, { useState } from 'react';
import {
  Row, Col, DropdownToggle, Dropdown, Button, Label,
} from 'reactstrap';

import Select from 'react-select';

const mockCompany = {
  name: 'Fresh Produce Co. Ltd.',
  id: 123456,
  tel: '080-000-0000',
  desc: '123 ABC Rd., Bangkok 10000 Thailand',
  website: 'www.website.com',
};

const CompanyPanel = (props) => {
  const [company, setCompany] = useState(mockCompany);

  return (
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
  );
};

export default CompanyPanel;
