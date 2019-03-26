import React,{useContext}  from 'react';
import shipmentListContext from '../context/shipmentContext';

export default function ShipmentList(){
 const { state } =  useContext(shipmentListContext);
 console.log('state',state)
 return (
     <div>
         <ul>
             {state.shipmentList.map(s => (
               <li key={s.id}>
                   <span>{s.status}</span>
               </li>
             ))}
         </ul>
     </div>
 )
}