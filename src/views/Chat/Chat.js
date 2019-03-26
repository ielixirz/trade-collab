import React, { Component ,useContext,useReducer } from 'react';
import {
  Collapse, Button, CardBody, Card,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane
} from 'reactstrap';
import shipmentListContext from '../../context/shipmentContext';
import shipmentReducer from '../../reducers/shipmentReducer';
import ShipmentList from '../../component/ShipmentList';
const Shipment = ()=>{
    const initialState =  useContext(shipmentListContext);
    const [state,dispatch]  = useReducer(shipmentReducer,initialState);
    return (<shipmentListContext.Provider value={{state,dispatch}}><ShipmentList /></shipmentListContext.Provider>)
}
class Chat extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: new Array(4).fill('1'),
      collapse: false
    };
    this.triggerCollapse = this.triggerCollapse.bind(this);
  }

  lorem() {
    return 'Teddy ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.';
  }

  toggle(tabPane, tab) {
    const newArray = this.state.activeTab.slice();
    newArray[tabPane] = tab;
    this.setState({
      activeTab: newArray
    });
  }

  triggerCollapse(){
      this.setState(state=> ({collapse:!state.collapse}))
  }

  tabPane() {
    return (
      <>
        <TabPane tabId="1">{`1. ${this.lorem()}`}</TabPane>
        <TabPane tabId="2">{`2. ${this.lorem()}`}</TabPane>
        <TabPane tabId="3">{`3. ${this.lorem()}`}</TabPane>
      </>
    );
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Nav tabs>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[0] === '1'}
                  onClick={() => {
                    this.toggle(0, '1');
                  }}
                >
                  Internal
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[0] === '2'}
                  onClick={() => {
                    this.toggle(0, '2');
                  }}
                >
                  Exporter
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[0] === '3'}
                  onClick={() => {
                    this.toggle(0, '3');
                  }}
                >
                  Custom
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab[0]}>
              {this.tabPane()}
            </TabContent>
          </Col>
         <Col></Col>
          <Col>
          <div>
        <Button  onClick={this.triggerCollapse} style={{ marginBottom: '1rem',backgroundColor:'transparent' ,borderWidth:0 }}>Shipment Update :{'string'}</Button>
        <Collapse isOpen={this.state.collapse}>
          <Card>
             <CardBody>
            Anim pariatur cliche reprehenderit,
             enim eiusmod high life accusamus terry richardson ad squid. Nihil
             anim keffiyeh helvetica, craft beer labore wes anderson cred
             nesciunt sapiente ea proident.
            </CardBody>
          </Card>
          <span><Shipment /></span>
        </Collapse>
      </div>
      </Col>
        </Row>
      </div>
    );
  }
}

export default Chat;
