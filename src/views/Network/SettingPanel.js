/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import {
  Row,
  Col,
  DropdownToggle,
  Dropdown,
  Button,
  Input,
  ButtonGroup,
  ButtonToolbar,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import MainDataTable from '../../component/MainDataTable';
import { PERMISSION_LIST } from '../../constants/network';

const RoleButton = ({ roleName }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };
  return (
    <Dropdown toggle={toggle} isOpen={open}>
      <DropdownToggle caret style={{ width: '100%', background: 'white', border: '0' }}>
        {roleName}
      </DropdownToggle>
      <DropdownMenu style={{ content: 'Float', clear: 'both' }}>
        <DropdownItem>Edit</DropdownItem>
        <DropdownItem>Remove</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const SettingPanel = ({ companyKey, auth }) => {
  const [roles, setRoles] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [roleColumn, setRoleColumn] = useState([
    {
      dataField: 'permission',
      text: '',
      style: {
        width: '700px',
      },
      headerStyle: {
        width: '700px',
      },
    },
    {
      dataField: 'empty',
      text: (
        // eslint-disable-next-line no-use-before-define
        <Button
          style={{ width: '40px', margin: 0 }}
          block
          color="success"
          onClick={() => addRole('NEW')}
        >
          +
        </Button>
      ),
      style: {
        width: '40px',
      },
      headerStyle: {
        width: '40px',
      },
    },
  ]);

  const addRole = (roleName) => {
    const emptyColumn = {
      dataField: 'empty',
      text: (
        <Button
          style={{ width: '40px', margin: 0 }}
          block
          color="success"
          onClick={() => addRole('NEW')}
        >
          +
        </Button>
      ),
      style: {
        width: '40px',
      },
      headerStyle: {
        width: '40px',
      },
    };
    const addingRoleColumn = roleColumn;
    addingRoleColumn[addingRoleColumn.length - 1].dataField = 'role';
    addingRoleColumn[addingRoleColumn.length - 1].text = <RoleButton roleName={roleName} />;
    addingRoleColumn[addingRoleColumn.length - 1].style.width = '100px';
    addingRoleColumn[addingRoleColumn.length - 1].headerStyle.width = '100px';
    addingRoleColumn[addingRoleColumn.length - 1].align = 'center';
    addingRoleColumn[addingRoleColumn.length - 1].headerAlign = 'center';

    addingRoleColumn.push(emptyColumn);

    setRoleColumn([...addingRoleColumn]);
  };

  return (
    <div>
      <Row>
        <span style={{ padding: '4rem' }}>
          <h2>Roles & Permissions Setting</h2>
        </span>
      </Row>
      <Row>
        <MainDataTable
          data={PERMISSION_LIST}
          column={roleColumn}
          cssClass="setting-table"
          wraperClass="setting-table-wraper"
          isBorder={false}
        />
      </Row>
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

export default connect(mapStateToProps)(SettingPanel);
