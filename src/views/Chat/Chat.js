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
import Tabs from 'react-draggable-tabs';
import './Chat.css';

const Shipment = ()=>{
    const initialState =  useContext(shipmentListContext);
    const [state,dispatch]  = useReducer(shipmentReducer,initialState);
    return (<shipmentListContext.Provider value={{state,dispatch}}><ShipmentList /></shipmentListContext.Provider>)
}
class Chat extends Component {
  constructor(props) {
    super(props);
    this.moveTab = this.moveTab.bind(this);
    this.selectTab = this.selectTab.bind(this);
    this.closedTab = this.closedTab.bind(this);
    this.addTab = this.addTab.bind(this);
    this.state = {
      activeTab: new Array(4).fill('1'),
      collapse: false,
      collapseFile:false,
      tabs: [
        {
          id: 1,
          content: 'Exporter',
          active: true,
          display: this.renderChat()
        }
      ]
    };
    this.triggerCollapse = this.triggerCollapse.bind(this);
    this.triggerCollapseFile = this.triggerCollapseFile.bind(this);
  }

  moveTab(dragIndex, hoverIndex) {
    this.setState((state, props) => {
      let newTabs = [...state.tabs];
      newTabs.splice(hoverIndex, 0, newTabs.splice(dragIndex, 1)[0]);

      return { tabs: newTabs };
    });
  }
  renderChat() {
    return (
      <div className="inbox_msg">
        <div className="mesgs">
          <div className="msg_history">
            <div className="incoming_msg">
              <div className="received_msg">
                <div className="received_withd_msg">
                  <p className="user-name">Name</p>
                  <p>{this.lorem()}</p>
                  <span className="time_date"> 11:01 AM | June 9</span>
                </div>
              </div>
            </div>
            <div className="outgoing_msg">
              <div className="sent_msg">
                <p>{this.lorem()}</p>
                <span className="time_date"> 11:01 AM | June 9</span>
              </div>
            </div>
            <div className="incoming_msg">
              <div className="received_msg">
                <div className="received_withd_msg">
                  <p className="user-name">Name</p>
                  <p>{this.lorem()}</p>
                  <span className="time_date"> 11:01 AM | Yesterday</span>
                </div>
              </div>
            </div>
            <div className="outgoing_msg">
              <div className="sent_msg">
                <p>{this.lorem()}</p>
                <span className="time_date"> 11:01 AM | Today</span>
              </div>
            </div>
            <div className="incoming_msg">
              <div className="received_msg">
                <div className="received_withd_msg">
                  <p className="user-name">Name</p>
                  <p>{this.lorem()}</p>
                  <span className="time_date"> 11:01 AM | Today</span>
                </div>
              </div>
            </div>
          </div>
          <div className="type_msg">
            <div className="input_msg_write">
              <input
                type="text"
                className="write_msg"
                placeholder="Type a message"
              />
              <button className="msg_send_btn" type="button">
                <i className="fa fa-paper-plane-o" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  selectTab(selectedIndex, selectedID) {
    this.setState((state, props) => {
      const newTabs = state.tabs.map(tab => ({
        ...tab,
        active: tab.id === selectedID
      }));
      return { tabs: newTabs };
    });
  }

  closedTab(removedIndex, removedID) {
    this.setState((state, props) => {
      let newTabs = [...state.tabs];
      newTabs.splice(removedIndex, 1);

      if (state.tabs[removedIndex].active && newTabs.length !== 0) {
        // automatically select another tab if needed
        const newActive = removedIndex === 0 ? 0 : removedIndex - 1;
        newTabs[newActive].active = true;
      }

      return { tabs: newTabs };
    });
  }

  addTab() {
    this.setState((state, props) => {
      let newTabs = [...state.tabs];
      newTabs.push({
        id: newTabs.length + 1,
        content: 'Cute *',
        display: <div key={newTabs.length + 1}>Cute *</div>
      });

      return { tabs: newTabs };
    });
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
  triggerCollapseFile(){
    this.setState(state=> ({collapseFile:!state.collapseFile}))
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
    const activeTab = this.state.tabs.filter(tab => tab.active === true);
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs='10'>
            <Tabs
              style={{ backgroundColor: 'black' }}
              moveTab={this.moveTab}
              selectTab={this.selectTab}
              closeTab={this.closedTab}
              tabs={this.state.tabs}
            >
              <button onClick={this.addTab}>+</button>
            </Tabs>
            <TabContent>
              {activeTab.length !== 0 ? activeTab[0].display : ''}
            </TabContent>
          </Col>
         <Col xs='2'>
          <div>
        <Button  onClick={this.triggerCollapseFile} style={{ marginBottom: '1rem',backgroundColor:'transparent' ,borderWidth:0 }}>File</Button>
        <Collapse isOpen={this.state.collapseFile}>
          <Card>
             <CardBody>
               body
            </CardBody>
          </Card>
        </Collapse>
        </div>
        <div>
        <Button  onClick={this.triggerCollapse} style={{ marginBottom: '1rem',backgroundColor:'transparent' ,borderWidth:0 }}>  <i class="fa fa-flickr"></i><span>Shipment Update</span>
</Button>
        <Collapse isOpen={this.state.collapse}>
          <Card>
             <CardBody>
             <Shipment />
            </CardBody>
          </Card>
        </Collapse>
      </div>
      </Col>
        </Row>
      </div>
    );
  }
}

export default Chat;
