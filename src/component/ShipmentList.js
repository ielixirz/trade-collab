import React,{useContext}  from 'react';
import shipmentListContext from '../context/shipmentContext';
import { ListGroup, ListGroupItem } from 'reactstrap';

export default function ShipmentList(){
 const { state } =  useContext(shipmentListContext);
 console.log('state',state)
 return (
     <div>   
     {state.shipmentList.map(s => (
        <ListGroup flush>
        <ListGroupItem disabled tag="a" >{s.status}</ListGroupItem>
        <ListGroupItem  disabled tag="a">{s.shipper}</ListGroupItem>
        <ListGroupItem  disabled tag="a">{s.consignee}</ListGroupItem>
        <ListGroupItem  disabled tag="a">{s.product}</ListGroupItem>
        <ListGroupItem  disabled tag="a">{s.container}</ListGroupItem>
        <ListGroupItem  disabled tag="a">{s.bill}</ListGroupItem>
        <ListGroupItem  disabled tag="a">{s.track}</ListGroupItem>
        <ListGroupItem  disabled tag="a">{s.note}</ListGroupItem>
        </ListGroup>
     ))}    
     </div>
 )
}