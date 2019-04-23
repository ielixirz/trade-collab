/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

const MainDataTable = ({
  data, column, cssClass, isBorder, wraperClass, toolkitbaseProps,
}) => (
  <BootstrapTable
    {...toolkitbaseProps}
    wrapperClasses={wraperClass}
    classes={cssClass}
    keyField="id"
    data={data}
    columns={column}
    bordered={isBorder}
  />
);
export default MainDataTable;
