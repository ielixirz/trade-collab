/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { map } from 'rxjs/operators';
import _ from 'lodash';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

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
import {
  GetCompanyUserAccessibility,
  UpdateCompanyUserAccessibility,
  CreateCompanyUserAccessibility,
  DeleteCompanyUserAccessibility,
} from '../../service/company/company';

const RoleButton = ({ roleName, deleteHandler, editHandler }) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRole, setEditingRole] = useState(roleName);

  const toggle = () => {
    setOpen(!open);
  };

  const toggleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event) => {
    setEditingRole(event.target.value);
  };

  return !isEditing ? (
    <Dropdown toggle={toggle} isOpen={open}>
      <DropdownToggle caret style={{ width: '100%', background: 'white', borderColor: '#ededed' }}>
        {roleName}
      </DropdownToggle>
      <DropdownMenu style={{ content: 'Float', clear: 'both' }}>
        <DropdownItem onClick={toggleEdit}>Edit</DropdownItem>
        <DropdownItem onClick={deleteHandler}>Remove</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ) : (
    <Input
      type="text"
      id={`role-${roleName}`}
      onChange={handleInputChange}
      value={editingRole}
      onKeyPress={(event) => {
        if (event.key === 'Enter') {
          editHandler(editingRole);
        }
      }}
    />
  );
};

const PermissionButton = ({ binary, updatePermission }) => (binary === '1' ? (
  <i
    className="cui-check icons font-2xl d-block matrix-check"
    role="button"
    style={{
      margin: 'auto',
      fontSize: 'medium',
      cursor: 'pointer',
    }}
      // eslint-disable-next-line max-len
    onClick={updatePermission}
    onKeyDown={null}
    tabIndex="-1"
  />
) : (
  <div
    style={{ width: '100%', height: '24px' }}
    role="button"
    onKeyDown={null}
    tabIndex="-1"
    onClick={updatePermission}
  />
));

const SettingPanel = (props, { auth }) => {
  const [roles, setRoles] = useState([]);
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
  ]);
  const [lastUpdate, setLastUpdate] = useState({});
  const [blocking, setBlocking] = useState(true);

  const toggleBlocking = (block) => {
    setBlocking(block);
  };

  const addRole = (roleName, lastIndex) => {
    CreateCompanyUserAccessibility(props.match.params.key, {
      CompanyUserMatrixRoleIndex: lastIndex + 1,
      CompanyUserMatrixRoleName: roleName,
      CompanyUserMatrixRolePermissionCode: '00000000000000',
    });
  };

  const deleteRole = (key) => {
    DeleteCompanyUserAccessibility(props.match.params.key, key);
  };

  const updateRole = (editedRoleName, key) => {
    UpdateCompanyUserAccessibility(props.match.params.key, key, {
      CompanyUserMatrixRoleName: editedRoleName,
    });
  };

  const updatePermission = (roleName, matrixArray, matrixIndex, index, key) => {
    toggleBlocking(true);
    const updateArray = matrixArray;
    updateArray[matrixIndex] = updateArray[matrixIndex] === '0' ? '1' : '0';
    const matrix = updateArray.join('');
    UpdateCompanyUserAccessibility(props.match.params.key, key, {
      CompanyUserMatrixRoleIndex: index,
      CompanyUserMatrixRoleName: roleName,
      CompanyUserMatrixRolePermissionCode: matrix,
    }).subscribe(() => {
      setLastUpdate({
        user: props.auth.uid,
        timestamp: new Date(),
      });
    });
  };

  const populateRoleToTable = (fetchResult) => {
    const initialRow = [...PERMISSION_LIST];
    const initialCol = [];

    initialCol.push({
      dataField: 'permission',
      text: '',
      style: {
        width: '500px',
      },
      headerStyle: {
        width: '500px',
      },
    });

    _.forEach(fetchResult, (result) => {
      initialCol.push({
        dataField: result.CompanyUserMatrixRoleName,
        text: (
          <RoleButton
            roleName={result.CompanyUserMatrixRoleName}
            deleteHandler={() => deleteRole(result.id)}
            editHandler={editingRole => updateRole(editingRole, result.id)}
          />
        ),
        style: {
          width: '100px',
        },
        headerStyle: {
          width: '100px',
        },
        align: 'center',
        headerAlign: 'center',
      });
      let increment = 0;
      const matrixArray = result.CompanyUserMatrixRolePermissionCode.split('');
      _.forEach(matrixArray, (binary, index) => {
        if (index === 0 || index === 9) {
          increment += 1;
        }
        initialRow[index + increment] = {
          ...initialRow[index + increment],
          [result.CompanyUserMatrixRoleName]: (
            <PermissionButton
              binary={binary}
              updatePermission={() => updatePermission(
                result.CompanyUserMatrixRoleName,
                matrixArray,
                index,
                result.CompanyUserMatrixRoleIndex,
                result.id,
              )
              }
            />
          ),
        };
      });
    });

    initialCol.push({
      dataField: 'empty',
      text: (
        // eslint-disable-next-line no-use-before-define
        <Button
          style={{ margin: 0, backgroundColor: '#16A085' }}
          block
          color="success"
          onClick={() => addRole('NEW', fetchResult.length)}
        >
          <b>+</b>
        </Button>
      ),
      style: {
        width: '40px',
      },
      headerStyle: {
        width: '40px',
      },
    });

    toggleBlocking(false);
    setRoleColumn(initialCol);
    setRoles(initialRow);
  };

  const fetchRole = (key) => {
    GetCompanyUserAccessibility(key)
      .pipe(
        map(docs => docs.map((d) => {
          const data = d.data();
          data.id = d.id;
          return data;
        })),
      )
      .subscribe((result) => {
        populateRoleToTable(result);
      });
  };

  useEffect(() => {
    fetchRole(props.match.params.key);
  }, [lastUpdate]);

  const rowStyle = (row, rowIndex) => {
    const style = {};
    if (rowIndex === 0 || rowIndex === 10) {
      style.backgroundColor = '#EDEDED';
    }
    return style;
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <BlockUi tag="div" blocking={blocking} style={{ height: '100%' }}>
        <Row>
          <span style={{ padding: '4rem' }}>
            <h2>Roles & Permissions Setting</h2>
          </span>
        </Row>
        <Row>
          <MainDataTable
            data={roles}
            column={roleColumn}
            cssClass="setting-table"
            wraperClass="setting-table-wraper"
            isBorder
            rowStyle={rowStyle}
          />
        </Row>
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

export default connect(mapStateToProps)(SettingPanel);
