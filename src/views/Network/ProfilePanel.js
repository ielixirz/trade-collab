/* eslint-disable filenames/match-regex */
import React, { useState } from 'react';
import {
  Row, Col, DropdownToggle, Dropdown, Button,
} from 'reactstrap';

import MainDataTable from '../../component/MainDataTable';
import ThreeDotDropdown from '../../component/ThreeDotDropdown';

const mockProfile = {
  fullname: 'John Jerald',
  email: 'john@gmail.com',
  desc: 'Fruit Exporter from coconut land',
};

const mockDataTable = [
  {
    company: 'Fresh Produce',
    position: 'CEO',
    role: 'Owner(Admin)',
    status: 'Active',
    button: (
      <ThreeDotDropdown
        options={[
          {
            text: 'Download',
            function: null,
          },
        ]}
      />
    ),
  },
  {
    company: 'Fresh Produce',
    position: 'CEO',
    role: 'Owner(Admin)',
    status: 'Active',
    button: (
      <ThreeDotDropdown
        options={[
          {
            text: 'Download',
            function: null,
          },
        ]}
      />
    ),
  },
  {
    company: 'Fresh Produce',
    position: 'CEO',
    role: 'Owner(Admin)',
    status: 'Active',
    button: (
      <ThreeDotDropdown
        options={[
          {
            text: 'Download',
            function: null,
          },
        ]}
      />
    ),
  },
  {
    company: 'Fresh Produce',
    position: 'CEO',
    role: 'Owner(Admin)',
    status: 'Active',
    button: (
      <ThreeDotDropdown
        options={[
          {
            text: 'Download',
            function: null,
          },
        ]}
      />
    ),
  },
  {
    company: 'Fresh Produce',
    position: 'CEO',
    role: 'Owner(Admin)',
    status: 'Active',
    button: (
      <ThreeDotDropdown
        options={[
          {
            text: 'Download',
            function: null,
          },
        ]}
      />
    ),
  },
  {
    company: 'Fresh Produce',
    position: 'CEO',
    role: 'Owner(Admin)',
    status: 'Active',
    button: (
      <ThreeDotDropdown
        options={[
          {
            text: 'Download',
            function: null,
          },
        ]}
      />
    ),
  },
  {
    company: 'Fresh Produce',
    position: 'CEO',
    role: 'Owner(Admin)',
    status: 'Active',
    button: (
      <ThreeDotDropdown
        options={[
          {
            text: 'Download',
            function: null,
          },
        ]}
      />
    ),
  },
  {
    company: 'Fresh Produce',
    position: 'CEO',
    role: 'Owner(Admin)',
    status: 'Active',
    button: (
      <ThreeDotDropdown
        options={[
          {
            text: 'Download',
            function: null,
          },
        ]}
      />
    ),
  },
  {
    company: 'Fresh Produce',
    position: 'CEO',
    role: 'Owner(Admin)',
    status: 'Active',
    button: (
      <ThreeDotDropdown
        options={[
          {
            text: 'Download',
            function: null,
          },
        ]}
      />
    ),
  },
  {
    company: 'Fresh Produce',
    position: 'CEO',
    role: 'Owner(Admin)',
    status: 'Active',
    button: (
      <ThreeDotDropdown
        options={[
          {
            text: 'Download',
            function: null,
          },
        ]}
      />
    ),
  },
  {
    company: 'Fresh Produce',
    position: 'CEO',
    role: 'Owner(Admin)',
    status: 'Active',
    button: (
      <ThreeDotDropdown
        options={[
          {
            text: 'Download',
            function: null,
          },
        ]}
      />
    ),
  },
];

const dataColumns = [
  {
    dataField: 'company',
    text: 'Company Name: (ID)',
  },
  {
    dataField: 'position',
    text: 'Position:',
  },
  {
    dataField: 'role',
    text: 'Role:',
  },
  {
    dataField: 'status',
    text: 'Status',
  },
  {
    dataField: 'button',
    text: '',
  },
];

const ProfilePanel = (props) => {
  const [userProfile, setUserProfile] = useState(mockProfile);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="profile-container">
        <Row style={{ height: '100%' }}>
          <Col xs={2} className="col-profile-pic">
            <Dropdown style={{ height: '100%', top: '14%' }}>
              <DropdownToggle className="network-pic-btn">
                <img
                  style={{ width: '70%' }}
                  src="../../assets/img/avatars/6.jpg"
                  className="img-avatar"
                  alt="admin@bootstrapmaster.com"
                />
              </DropdownToggle>
            </Dropdown>
          </Col>
          <Col xs={7} className="col-profile-info">
            <Row>
              <Col sm={1} style={{ paddingLeft: '0px', paddingRight: '0px', textAlign: 'right' }}>
                <i className="cui-pencil icons" />
              </Col>
              <Col xs={9}>
                <h4>{userProfile.fullname}</h4>
              </Col>
            </Row>
            <Row>
              <Col xs={1} />
              <Col xs={4}>
                <p className="profile-email">
                  <em>{userProfile.email}</em>
                </p>
              </Col>
            </Row>
            <Row>
              <Col xs={1} />
              <Col xs={4}>
                <p>{userProfile.desc}</p>
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
              <Button className="profile-btn">
                <i className="cui-graph icons network-btn-icon" />
                Request to join Company
              </Button>
            </Row>
            <Row>
              <Button className="profile-btn create">
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
          data={mockDataTable}
          column={dataColumns}
          cssClass="profile-table"
          wraperClass="profile-table-wraper"
          isBorder={false}
        />
      </div>
    </div>
  );
};

export default ProfilePanel;
