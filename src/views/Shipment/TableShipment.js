import React from 'react';
import './Chat.css';

import _ from 'lodash';
import { createDataTable } from '../../utils/tool';
import BootstrapTable from 'react-bootstrap-table-next';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Select from 'react-select'

import {
  Row,
  Col,
  Button,
  UncontrolledPopover,
  FormGroup,
  Label,
  Input,
  PopoverBody
} from 'reactstrap';
import { EditShipment } from '../../service/shipment/shipment';
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

  renderRefComponent(index, ref) {
    console.log(ref);
    return (
      <div>
        <Button id={'popover' + index} type="button">
          {ref.RefID}
        </Button>
        <UncontrolledPopover trigger="legacy" placement="bottom" target={'popover' + index}>
          <PopoverBody>
            <Row>
              <Col xs={1} />
              <Col xs={5}>
                <Label check>
                  <Input type="radio" name={'shipmentRef' + index} value={ref.RefID} />
                  Ref #1 : ({ref.RefOwner})
                </Label>
              </Col>
              <Col xs={5}>
                <Input
                  type="text"
                  name={'shipmentRefID' + index}
                  id={'shipmentRefID' + index}
                  value={ref.RefID}
                  maxlength={50}
                  disabled
                />
              </Col>
            </Row>
          </PopoverBody>
        </UncontrolledPopover>
      </div>
    );
  }

  renderStatusComponent(item) {
    return (
      <div>
        <Input
          type="select"
          onChange={e => {
            const value = e.target.value;
            EditShipment(item.uid, {
              ShipmentStatus: value
            });
          }}
        >
          <option value="Planing" selected={item.ShipmentStatus === 'Planing' ? true : ''}>
            Planing
          </option>
          <option
            value="Order Confirmed"
            selected={item.ShipmentStatus === 'Order Confirmed' ? true : ''}
          >
            Order Confirmed
          </option>
          <option value="In-Transit" selected={item.ShipmentStatus === 'In-Transit' ? true : ''}>
            In-Transit
          </option>
          <option value="Delayed" selected={item.ShipmentStatus === 'Delayed' ? true : ''}>
            Delayed
          </option>
          <option value="Delivered" selected={item.ShipmentStatus === 'Delivered' ? true : ''}>
            Delivered
          </option>
          <option value="Cancelled" selected={item.ShipmentStatus === 'Cancelled' ? true : ''}>
            Cancelled
          </option>
        </Input>
      </div>
    );
  }

  render() {
    let data = [];
    let columns = [];

    let input = [];
    if (this.props.input.length === 0) {
      input = this.data;
      data = input.products;
      columns = input.columns;
    } else {
      input = _.map(this.props.input, (item, index) => {
        let etd = _.get(item, 'ShipmentETD', 0);
        let eta = _.get(item, 'ShipmentETAPort', 0);

        return {
          Ref: this.renderRefComponent(index, _.get(item, 'ShipmentReference', 'input your Ref')),
          Seller: _.get(item, 'ShipmentSellerCompanyName', ''),
          Buyer: _.get(item, 'ShipmentBuyerCompanyName', ''),
          Product: _.get(item, 'ShipmentProductName', ''),
          ETD: new Date(etd.seconds * 1000).toLocaleString(),
          ETA: new Date(eta.seconds * 1000).toLocaleString(),
          Status: this.renderStatusComponent(item)
        };
      });
      input = createDataTable(input);
      data = input.data;
      columns = input.columns;
    }

    return (
      <div>
        <ToolkitProvider keyField="id" data={data} columns={columns} search>
          {props => (
            <div>
              <Row>
                <Col xs={6}>
                  <SearchBar {...props.searchProps} placeholder="&#xF002; Typing" id="search" />
                </Col>
                <Col sm={{ size: '5', offset: 1 }}>
                  <Button color="success" className="float-right">
                    Create New Shipment
                  </Button>
                </Col>
              </Row>
              <BootstrapTable
                rowStyle={{ textAlign: 'left' }}
                {...props.baseProps}
                pagination={paginationFactory()}
				bordered={ false }
              />
            </div>
          )}
        </ToolkitProvider>
      </div>
    );
  }
}
