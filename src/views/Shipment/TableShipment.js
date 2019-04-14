import React from 'react';
import './Chat.css';

import _ from 'lodash';
import { createDataTable } from '../../utils/tool';
import BootstrapTable from 'react-bootstrap-table-next';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { Row, Col } from 'reactstrap';
const { SearchBar } = Search;

export default class TableShipment extends React.Component {
  data = {
    products: [
      {
        ref: 'INVPT',
        seller: 'ExportA',
        buyer: 'ExportB',
        product: 'coconut',
        etd: 'date',
        eta: 'date',
        status: ['intransit', 'planning']
      },
      {
        ref: 'INVPT',
        seller: 'ExportA',
        buyer: 'ExportB',
        product: 'coconut',
        etd: 'date',
        eta: 'date',
        status: ['intransit', 'planning']
      },
      {
        ref: 'INVPT',
        seller: 'ExportA',
        buyer: 'ExportC',
        product: 'coconut',
        etd: 'date',
        eta: 'date',
        status: ['intransit', 'planning']
      },
      {
        ref: 'INVPT',
        seller: 'ExportA',
        buyer: 'ExportC',
        product: 'coconut',
        etd: 'date',
        eta: 'date',
        status: ['intransit', 'planning']
      },
      {
        ref: 'INVPT',
        seller: 'ExportA',
        buyer: 'ExportC',
        product: 'coconut',
        etd: 'date',
        eta: 'date',
        status: ['intransit', 'planning']
      },
      {
        ref: 'INVPT',
        seller: 'ExportA',
        buyer: 'ExportC',
        product: 'coconut',
        etd: 'date',
        eta: 'date',
        status: ['intransit', 'planning']
      }
    ],
    columns: [
      {
        dataField: 'ref',
        text: 'Ref:'
      },
      {
        dataField: 'seller',
        text: 'Seller',
        sort: true
      },
      {
        dataField: 'buyer',
        text: 'Buyer',
        sort: true
      },
      {
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
        text: 'Status'
      }
    ]
  };

  render() {
    let input = _.map(this.props.input, (item, index) => {
      // ShipmentBuyerCompanyName: "JP Fish Co."
      // ShipmentCreateTimestamp: {seconds: 1555010340, nanoseconds: 186000000}
      // ShipmentCreatorType: "Importer"
      // ShipmentCreatorUserKey: "User1"
      // ShipmentDestinationLocation: "Bangkok , Thailand"
      // ShipmentETAPort: {seconds: 1555010340, nanoseconds: 186000000}
      // ShipmentETAWarehouse: {seconds: 1555010340, nanoseconds: 186000000}
      // ShipmentETD: {seconds: 1555010340, nanoseconds: 186000000}
      // ShipmentLastestUpdateTimestamp: {seconds: 1555010340, nanoseconds: 186000000}
      // ShipmentMember: (3) [{…}, {…}, {…}]
      // ShipmentPriceDescription: " N/A"
      // ShipmentProductName: "Fish Salmon"
      // ShipmentReference: {RefID: "Ref1234", RefOwner: "Seller", RefTimestampUpdate: "1234567673242"}
      // ShipmentSellerCompanyName: "BBQ Plaza Co."
      // ShipmentSourceLocation: "Chiangmai , Thailand"
      // ShipmentStatus: "Delayed"
      let etd = _.get(item, 'ShipmentETD', 0);
      let eta = _.get(item, 'ShipmentETAPort', 0);

      return {
        Ref: _.get(item, 'ShipmentReference.RefID', 'input your Ref'),
        Seller: _.get(item, 'ShipmentSellerCompanyName', ''),
        Buyer: _.get(item, 'ShipmentBuyerCompanyName', ''),
        Product: _.get(item, 'ShipmentProductName', ''),
        ETD: new Date(etd.seconds * 1000).toLocaleString(),
        ETA: new Date(eta.seconds * 1000).toLocaleString(),
        Status: _.get(item, 'ShipmentStatus', '')
      };
    });
    input = createDataTable(input);
    console.log('data is ', input);
    const { data, columns } = input;
    return (
      <div>
        <ToolkitProvider keyField="id" data={data} columns={columns} search>
          {props => (
            <div>
              <Row className="justify-content-center">
                <Col xs={6}>
                  <SearchBar {...props.searchProps} placeholder="&#xF002; Search" id="search" />
                </Col>
                <Col xs={6} />
              </Row>
              <hr />
              <BootstrapTable
                rowStyle={{ textAlign: 'center' }}
                {...props.baseProps}
                pagination={paginationFactory()}
              />
            </div>
          )}
        </ToolkitProvider>
      </div>
    );
  }
}
