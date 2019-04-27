/* eslint-disable filenames/match-regex */
import React, { useState } from 'react';
import { connect } from 'react-redux';

import {
  Row, Col, DropdownToggle, Dropdown, Button, Input, Label,
} from 'reactstrap';

import MainDataTable from '../../component/MainDataTable';
import ThreeDotDropdown from '../../component/ThreeDotDropdown';

import { profileColumns } from '../../constants/network';

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

const ProfilePanel = (props) => {
  const [userProfile, setUserProfile] = useState(mockProfile);
  const [isEdit, setIsEdit] = useState(false);

  const toggleEdit = () => {
    if (isEdit) {
      // TO-DO : fire edit service
    }
    setIsEdit(!isEdit);
  };

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
                <i
                  className="cui-pencil icons"
                  role="button"
                  style={{ cursor: 'pointer' }}
                  onClick={toggleEdit}
                  onKeyDown={toggleEdit}
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
                      placeholder={userProfile.fullname}
                    />
                  </div>
                ) : (
                  <h4>{userProfile.fullname}</h4>
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
                      placeholder={userProfile.email}
                    />
                  </div>
                ) : (
                  <p className="profile-email">
                    <em>{userProfile.email}</em>
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
                    placeholder={userProfile.desc}
                  />
                ) : (
                  <p>{userProfile.desc}</p>
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
  const { authReducer, userReducer } = state;
  return {
    auth: authReducer.user,
    user: userReducer,
  };
};

export default connect(mapStateToProps)(ProfilePanel);
