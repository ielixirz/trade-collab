/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import React, { Component } from 'react';

import NotificationComponent from '../component/NotificationComponent';
import moment from 'moment';

const LABEL = {
  id: 'id'
};
export const notificationTitleHelper = (item, index, userKey) => {
  const t = new Date(item.UserNotificationTimestamp.seconds * 1000);

  switch (item.UserNotificationType) {
    case 'AcceptedIntoCompany':
      return (
        <NotificationComponent
          index={index}
          item={item}
          user={userKey}
          text={`You has been accepted to join company ${item.UserNotificationCompanyName}`}
          t={t}
        />
      );

    case 'ChangeOfRoleWithInCompany':
      return (
        <NotificationComponent
          index={index}
          item={item}
          user={userKey}
          text={`${item.UserNotificationUserInfoEmail} role in ${
            item.UserNotificationCompanyName
          } has been changed from ${item.UserNotificationOldRole} to ${
            item.UserNotificationNewRole
          }`}
          s
          t={t}
        />
      );
    case 'InviteToJoinCompany':
      return (
        <NotificationComponent
          index={index}
          item={item}
          user={userKey}
          text={`You has been invited to company ${item.UserNotificationCompanyName}`}
          t={t}
        />
      );
    case 'RequestToJoinCompany':
      return (
        <NotificationComponent
          index={index}
          item={item}
          user={userKey}
          text={`${item.UserNotificationFirstname} has has request to join your Company ${
            item.UserNotificationCompanyName
          } `}
          t={t}
        />
      );
  }
};
export const createDataTable = input => {
  const data = _.map(input, (item, index) => ({
    id: _.get(item, 'id', index) + 1,
    ...item
  }));
  const columns = _.map(_.keys(data[0]), item => {
    if (item === 'ETA') {
      return {
        text: _.get(LABEL, item, item),
        dataField: item,
        sort: true,
        headerAlign: 'center',
        align: 'center',
        width: '15%',
        sortFunc: (a, b, order, dataField, rowA, rowB) => {
          const RowAETADATA = moment(rowA.ETA, 'DD MMM YYYY');
          const RowBETADATA = moment(rowB.ETA, 'DD MMM YYYY');
          // moment(str, 'YYYY-MM-DD').toDate()
          if (order === 'asc') return RowAETADATA - RowBETADATA;
          else return RowBETADATA - RowAETADATA;
        }
      };
    }
    if (item === 'ETD') {
      return {
        text: _.get(LABEL, item, item),
        dataField: item,
        sort: true,
        headerAlign: 'center',
        align: 'center',
        width: '15%',
        sortFunc: (a, b, order, dataField, rowA, rowB) => {
          const RowAETDDATA = moment(rowA.ETD, 'DD MMM YYYY');
          const RowBETDDATA = moment(rowB.ETD, 'DD MMM YYYY');
          // moment(str, 'YYYY-MM-DD').toDate()
          if (order === 'asc') return RowAETDDATA - RowBETDDATA;
          else return RowBETDDATA - RowAETDDATA;
        }
      };
    }
    if (item === 'uid') {
      return {
        text: _.get(LABEL, item, item),
        dataField: item,
        sort: true,
        hidden: true
      };
    }
    if (item === 'ShipmentReferenceList') {
      return {
        text: _.get(LABEL, item, item),
        dataField: item,
        sort: true,
        hidden: true
      };
    }
    if (item === '') {
      return {
        text: _.get(LABEL, item, item),
        dataField: item,
        sort: false,
        style: {
          width: '2.5%'
        },
        headerAlign: 'center',
        headerStyle: {
          width: '2.5%'
        }
      };
    }
    if (item === 'alert') {
      return {
        text: '',
        dataField: item,
        sort: false,
        style: {
          width: '5%'
        },
        headerAlign: 'center',
        headerStyle: {
          width: '5%'
        },
        classes: 'alert-column'
      };
    }
    if (item === 'Ref') {
      return {
        text: _.get(LABEL, item, item),
        dataField: item,
        sort: false,
        style: {
          width: '12%'
        },
        headerAlign: 'left',
        align: 'left',
        headerStyle: {
          width: '12%'
        }
      };
    }
    if (item === 'Product') {
      return {
        text: _.get(LABEL, item, item),
        dataField: item,
        sort: false,
        style: {
          width: '15%'
        },
        headerAlign: 'center',
        align: 'center',
        headerStyle: {
          width: '15%'
        }
      };
    }
    if (item === 'id') {
      return {
        text: _.get(LABEL, item, item),
        dataField: item,
        sort: true,
        hidden: true
      };
    }
    if (item === 'ShipmentStatus') {
      return {
        text: _.get(LABEL, item, item),
        dataField: item,
        sort: true,
        hidden: true
      };
    }
    if (item === 'ShipmentMember') {
      return {
        text: _.get(LABEL, item, item),
        dataField: item,
        sort: true,
        hidden: true
      };
    }
    if (item === 'Buyer' || item === 'Seller') {
      return {
        text: _.get(LABEL, item, item),
        dataField: item,
        headerAlign: 'left',
        align: 'left',
        sort: true
      };
    }
    if (item === 'Status') {
      return {
        text: _.get(LABEL, item, item),
        dataField: item,
        style: {
          width: '15%'
        },
        headerAlign: 'center',
        align: 'center',
        headerStyle: {
          width: '15%'
        }
      };
    }
    return {
      text: _.get(LABEL, item, item),
      dataField: item,
      sort: true,
      headerAlign: 'center',
      align: 'center',
      width: '15%'
    };
  });

  return {
    columns,
    data
  };
};
