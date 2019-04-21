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
    if (item === 'id') {
      return {
        text: _.get(LABEL, item, item),
        dataField: item,
        sort: true,
        headerStyle: () => ({ width: '80px', textAlign: 'center' }),
        hidden: true
      };
    }
    return {
      text: _.get(LABEL, item, item),
      dataField: item,
      sort: true
    };
  });

  return {
    columns,
    data
  };
};
