import React, { Component,useContext,useReducer } from 'react';

import {
    Collapse, CardBody, Card, Row, Col
  } from 'reactstrap';
import FileListContext from '../../context/FileContext';
import FileReducer from '../../reducers/FileReducer';
import FileList from '../../component/FileList';
 
const FileData = ()=>{
    const initialState =  useContext(FileListContext);
    const [state,dispatch]  = useReducer(FileReducer,initialState);
    return (
    <FileListContext.Provider value={{state,dispatch}}>
    <FileList />
    </FileListContext.Provider>)
}

class FileSide extends Component{
  constructor(props){
    super(props)
    this.state = {
        collapse: false,
      };
      this.triggerCollapse = this.triggerCollapse.bind(this);
        }
    triggerCollapse(){
        this.setState(state=> ({collapse:!state.collapse}))
    }
  
  render(){
    return(
        <div>
        <Card  onClick={this.triggerCollapse} style={styles.button}>
        <CardBody>
        <Row>
          <Col xs="10" className="text-left">
        <span style={styles.boxColor}>
        <i className="fa fa-file"></i></span>
        <span style={styles.title}>File</span></Col>
        <Col xs="2" className="text-right">
        {this.state.collapse ? 
       <span style={styles.arrow}><i className="fa fa-angle-down"></i></span>:
        <span style={styles.arrow}><i className="fa fa-angle-right"></i></span>
        }
        </Col>
        </Row>
        <Collapse isOpen={this.state.collapse}>
         <FileData />
          </Collapse>
      </CardBody>
   
       </Card>
       
      </div>
    )
  }
}

const styles = {
   button:{ },
   boxColor:{fontSize: 20, color: 'gold' ,marginRight:7},
   title:{
       fontSize: 20,
       fontWeight: 'bold',
       color: '#707070'
   },
   arrow:{
    fontSize: 20,
    marginLeft:5,
    color: '#707070'
   },
   status:{
    color: '#58CADB'  
   }
}

export default FileSide