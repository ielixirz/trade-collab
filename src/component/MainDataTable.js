/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

const MainDataTable = ({
  id,
  data,
  filterKeyword,
  isFilter,
  filter,
  column,
  cssClass,
  isBorder,
  wraperClass,
  toolkitbaseProps,
  rowEvents,
  rowStyle,
}) => (
  <BootstrapTable
    {...toolkitbaseProps}
    id={id}
    wrapperClasses={wraperClass}
    classes={cssClass}
    keyField="id"
    data={isFilter ? filter(filterKeyword, data) : data}
    columns={column}
    bordered={isBorder}
    rowEvents={rowEvents}
    rowStyle={rowStyle}
  />
);
export default MainDataTable;
