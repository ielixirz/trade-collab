import React,{useContext}  from 'react';
import shipmentListContext from '../context/shipmentContext';
import { ListGroup, ListGroupItem,Row,Col } from 'reactstrap';

export default function ShipmentList(){
 const { state } =  useContext(shipmentListContext);
 return (
     <div>   
     {state.shipmentList.map(s => (
        <ListGroup flush key={s.id}>
        <ListGroupItem  disabled tag="a">  
        <Row>
          <Col xs="12"><small>Shipper</small><br/>{s.shipper}</Col>
        </Row>
        <Row><Col xs="12"><small>consignee</small><br/>{s.consignee}</Col></Row>
        </ListGroupItem>
        <ListGroupItem  disabled tag="a"><Row>
          <Col xs="6">Product</Col>
          <Col xs="6" className="text-right">{s.product}</Col>
        </Row></ListGroupItem>
        <ListGroupItem  disabled tag="a">
        <Row>
          <Col xs="6">Container No.</Col>
          <Col xs="6" className="text-right">{s.container}</Col>
        </Row>
        </ListGroupItem>
        <ListGroupItem  disabled tag="a">
        <Row>
          <Col xs="6">Bill of Landing No.</Col>
          <Col xs="6" className="text-right">{s.bill}</Col>
        </Row>
        </ListGroupItem>
        <ListGroupItem  disabled tag="a">
        <Row>
          <Col xs="6">Original Docs.Tracking No.</Col>
          <Col xs="6" className="text-right">{s.track}</Col>
        </Row>
        </ListGroupItem>
        <ListGroupItem  disabled tag="a">
        <Row>
          <Col xs="2">Note</Col>
          <Col xs="8">{s.note}</Col>
        </Row>
        </ListGroupItem>
        </ListGroup>
     ))}    
     </div>
    
 )
}

