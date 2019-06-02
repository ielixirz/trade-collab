/* eslint-disable import/prefer-default-export */
import _ from 'lodash';

const LABEL = {
  id: 'id'
};

export const createDataTable = input => {
  const data = _.map(input, (item, index) => ({
    id: _.get(item, 'id', index) + 1,
    ...item
  }));
  const columns = _.map(_.keys(data[0]), item => {
    if (item === 'uid') {
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
          width: '20%'
        },
        headerAlign: 'center',
        align: 'center',
        headerStyle: {
          width: '20%'
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
    if (item === 'ShipmentMember') {
      return {
        text: _.get(LABEL, item, item),
        dataField: item,
        sort: true,
        hidden: true
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
