import React,{useContext}  from 'react';
import FileListContext from '../context/FileContext';
import { ListGroup, ListGroupItem,Row,Col } from 'reactstrap';

export default function FileList(){
 const { state } =  useContext(FileListContext);
 return (
     <div>   
     {state.FileList.map(s => (
        <ListGroup flush key={s.id}>
        <ListGroupItem  disabled tag="a"><Row>
          <Col xs="1"><i className="fa fa-file-picture-o"></i></Col>
          <Col xs="11" className="text-left">{s.name}</Col>
        </Row></ListGroupItem>
        </ListGroup>
     ))}    
     </div>
    
 )
}

