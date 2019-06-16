/* eslint-disable react/react-in-jsx-scope */
import React from 'react';

export const profileColumns = [
  {
    dataField: 'company',
    text: 'Company Name',
    style: {
      width: '30%',
    },
    headerStyle: {
      width: '30%',
    },
  },
  {
    dataField: 'position',
    text: 'Position:',
    style: {
      width: '20%',
    },
    headerStyle: {
      width: '20%',
    },
  },
  {
    dataField: 'role',
    text: 'Role:',
    style: {
      width: '20%',
    },
    headerStyle: {
      width: '20%',
    },
    align: 'center',
  },
  {
    dataField: 'status',
    text: 'Status',
    style: {
      width: '20%',
    },
    headerStyle: {
      width: '20%',
    },
    align: 'center',
    headerAlign: 'center',
  },
  {
    dataField: 'button',
    text: '',
    style: {
      width: '10%',
    },
    headerStyle: {
      width: '10%',
    },
  },
];

export const incomingRequestColumns = [
  {
    dataField: 'name',
    text: 'Name',
    style: {
      width: '25%',
    },
    headerStyle: {
      width: '25%',
    },
  },
  {
    dataField: 'email',
    text: 'Email',
    style: {
      width: '20%',
    },
    headerStyle: {
      width: '20%',
    },
  },
  {
    dataField: 'position',
    text: 'Position',
    style: {
      width: '15%',
    },
    headerStyle: {
      width: '15%',
    },
    headerAlign: 'center',
    align: 'center',
  },
  {
    dataField: 'role',
    text: 'Role',
    style: {
      width: '15%',
    },
    headerStyle: {
      width: '15%',
    },
    headerAlign: 'center',
    align: 'center',
  },
  {
    dataField: 'status',
    text: 'Status',
    style: {
      width: '20%',
    },
    headerStyle: {
      width: '20%',
    },
    headerAlign: 'center',
    align: 'center',
  },
];

export const memberDataColumns = [
  {
    dataField: 'name',
    text: 'Name',
    style: {
      width: '30%',
    },
    headerStyle: {
      width: '30%',
    },
  },
  {
    dataField: 'email',
    text: 'Email',
    style: {
      width: '20%',
    },
    headerStyle: {
      width: '20%',
    },
  },
  {
    dataField: 'position',
    text: 'Position',
    style: {
      width: '20%',
    },
    headerStyle: {
      width: '20%',
    },
  },
  {
    dataField: 'role',
    text: 'Role',
    style: {
      width: '20%',
    },
    headerStyle: {
      width: '20%',
    },
  },
  {
    dataField: 'status',
    text: 'Status',
    style: {
      width: '10%',
    },
    headerStyle: {
      width: '10%',
    },
  },
  {
    dataField: 'button',
    text: '',
    style: {
      width: '10%',
    },
    headerStyle: {
      width: '10%',
    },
  },
];

export const PERMISSION_LIST = [
  {
    permission: (
      <React.Fragment>
        <b>Shipment:</b>
      </React.Fragment>
    ),
  },
  {
    permission: 'See all shipment in shipment table.',
  },
  {
    permission: 'Able to access internal tab.',
  },
  {
    permission: 'See uninvited chatroom name on the tab.',
  },
  {
    permission: 'See all chatroom within company and can access it.',
  },
  {
    permission: 'Invite other user into chat.',
  },
  {
    permission: 'Kick someone out of chatroom.',
  },
  {
    permission: 'Can edit the shipment update.',
  },
  {
    permission: 'Edit master detail.',
  },
  {
    permission: 'Upload file.',
  },
  {
    permission: (
      <React.Fragment>
        <b> Company:</b>
      </React.Fragment>
    ),
  },
  {
    permission: 'Change the assign company.',
  },
  {
    permission: 'Edit company profile.',
  },
  {
    permission: 'Invite/accept user to join company and assign role.',
  },
  {
    permission: 'Set accessibility setting.',
  },
  {
    permission: 'Set accessibility - owner level.',
  },
];

export const inviteToCompanyColumns = [
  {
    dataField: 'name',
    text: 'Name',
    style: {
      width: '30%',
    },
    headerStyle: {
      width: '30%',
    },
  },
  {
    dataField: 'email',
    text: 'Email',
    style: {
      width: '25%',
    },
    headerStyle: {
      width: '25%',
    },
  },
  {
    dataField: 'position',
    text: 'Position',
    style: {
      width: '15%',
    },
    headerStyle: {
      width: '15%',
    },
  },
  {
    dataField: 'role',
    text: 'Role',
    style: {
      width: '25%',
    },
    headerStyle: {
      width: '25%',
    },
  },
  {
    dataField: 'remove',
    text: '',
    style: {
      width: '5%',
    },
    headerStyle: {
      width: '5%',
    },
  },
];
