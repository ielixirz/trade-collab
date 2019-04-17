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
import './Chat.css';
import {
  Row,
  Col,
  Button,
  UncontrolledPopover,
  FormGroup,
  Label,
  Input,
  PopoverBody,
  InputGroup, InputGroupAddon,
  InputGroupText
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
        <p id={'popover' + index} >
          {ref.RefID}
        </p>
        <UncontrolledPopover  trigger="legacy" placement="bottom" target={'popover' + index}>
          <PopoverBody>
            <Row>
              <Col xs={1} />
              <Col xs={5} style={{ paddingTop:5}} >
                <Label check>
                  <Input style={{paddingTop:5}}  type="radio" name={'shipmentRef' + index} value={ref.RefID} />
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
				  bsSize="sm"
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
	const selectRow = {
		  mode: 'checkbox',
		  clickToSelect: true,
		  hideSelectColumn: true,
		  bgColor: '#F5FBFA'
		};
		const pageListRenderer = ({
		  pages,
		  onPageChange
		}) => {
		  const pageWithoutIndication = pages.filter(p => typeof p.page !== 'string');
		  return (
			<div>
			  <span>Page </span>
			  {
				pageWithoutIndication.map(p => (
				 <Button outline color="secondary" onClick={ () => onPageChange(p.page) }>{ p.page }</Button>
				))
			  }
			</div>
		  );
		};
        const sizePerPageRenderer = ({
			  options,
			  currSizePerPage,
			  onSizePerPageChange
			}) => (
			  <div className="btn-group" role="group">
				{
				  options.map((option) => {
					const isSelect = currSizePerPage === `${option.page}`;
					return (
					  <button
						key={ option.text }
						type="button"
						onClick={ () => onSizePerPageChange(option.page) }
						className={ `btn ${isSelect ? 'btn-secondary' : 'btn-success'}` }
					  >
						{ option.text }
					  </button>
					);
				  })
				}
			  </div>
		);
		const options = {
		  pageListRenderer,
		  sizePerPageRenderer
		};
		const MySearch = (props) => {
			  let input;
			  const handleClick = () => {
				props.onSearch(input.value);
			  };
			  return (
				<div>
				 <InputGroup>
				 <InputGroupAddon addonType="prepend"><InputGroupText style={{backgroundColor:'white'}}><i className="fa fa-filter"/></InputGroupText></InputGroupAddon>
		         <Input
					className="form-control"
					id="statusSelect"
					ref={ n => input = n }
					name="select"
					type="select"
					style={{width:170}}
					onChange={handleClick}
				  >
				   <option>Intransit</option>
					<option>Order</option>
					<option>Delayed</option>
					<option>Cancelled</option>
					<option>Delivered</option>
				  </Input>
				 </InputGroup>
				</div>
			  );
			};
    return (
        <ToolkitProvider keyField="id" data={data} columns={columns} search>
          {props => (
            <div>
              <Row>
                <Col xs="2">
                  <SearchBar {...props.searchProps} placeholder="&#xF002; Typing" id="search" style={{width:250,height:38}} />
                </Col>
				<Col xs="2">
				  <MySearch { ...props.searchProps } />
				</Col>
				<Col xs="6"/>
				<Col xs="2" style={{ display: 'flex',justifyContent: 'flex-end',marginBottom:10}}>
				  <Button style={{backgroundColor:'#16A085',marginTop:2,marginRight:10}}>
                   <span style={{fontWeight:'bold',color:'white'}}>Save</span>
                </Button>
				  <Button style={{backgroundColor:'white',marginTop:2,marginRight:10}} >
                    <i className="icons cui-pencil" style={{color:'black'}}></i> <span style={{fontWeight:'bold',color:'#707070'}}>Edit</span>
                </Button>
				</Col>
              </Row>
			  <div className='table'>
              <BootstrapTable
                rowStyle={{ textAlign: 'left' }}
                {...props.baseProps}
                pagination={paginationFactory(options)}
				bordered={ false }
				selectRow={ selectRow }
				wrapperClasses="boo"
              />
			  </div>
            </div>
          )}
        </ToolkitProvider>
 
    );
  }
}
