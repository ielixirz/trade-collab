import React from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
const { SearchBar } = Search;

export default class TableShipment extends React.Component {
  data = {
    products: [
      {
        ref: 'INVPT',
        seller: 'ExportA',
        'buyer': 'ExportB',
        product: 'coconut',
        etd:'date',
        eta:'date',
        status: ['intransit','planning']
      },
      {
        ref: 'INVPT',
        seller: 'ExportA',
        'buyer': 'ExportB',
        product: 'coconut',
        etd:'date',
        eta:'date',
        status: ['intransit','planning']
      },
      {
        ref: 'INVPT',
        seller: 'ExportA',
        'buyer': 'ExportC',
        product: 'coconut',
        etd:'date',
        eta:'date',
        status: ['intransit','planning']
      },
      {
        ref: 'INVPT',
        seller: 'ExportA',
        'buyer': 'ExportC',
        product: 'coconut',
        etd:'date',
        eta:'date',
        status: ['intransit','planning']
      },
      {
        ref: 'INVPT',
        seller: 'ExportA',
        'buyer': 'ExportC',
        product: 'coconut',
        etd:'date',
        eta:'date',
        status: ['intransit','planning']
      },
      {
        ref: 'INVPT',
        seller: 'ExportA',
        'buyer': 'ExportC',
        product: 'coconut',
        etd:'date',
        eta:'date',
        status: ['intransit','planning']
      }
    ],
    columns: [{
      dataField: 'ref',
      text: 'Ref:'
    },
    {
      dataField: 'seller',
      text: 'Seller',
      sort: true
    }, {
      dataField: 'buyer',
      text: 'Buyer',
      sort: true
    }, {
      dataField: 'product',
      text: 'Product'
    },
    {
      dataField: 'etd',
      text: 'ETD',
      sort: true
    },
     {
      dataField: 'eta',
      text: 'ETA',
      sort: true
    },
     {
      dataField: 'status',
      text: 'Status',
    }
  ]
  } 
  
  render() {
    return (
      <ToolkitProvider
      keyField="id"
      data={ this.data.products } 
      columns={ this.data.columns }  
      search
    >
    {
      props => (
        <div>
          <SearchBar { ...props.searchProps } placeholder="Typing" />
          <hr />
          <BootstrapTable
            bootstrap4
            bordered={ false }
            { ...props.baseProps }
            pagination={ paginationFactory() }
            noDataIndication="No data"
          />
        </div>
      )
    }
    </ToolkitProvider>
    );
  }
}