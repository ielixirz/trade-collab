import React, { Component } from 'react';
import {
  Badge,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane
} from 'reactstrap';
import Tabs from 'react-draggable-tabs';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.moveTab = this.moveTab.bind(this);
    this.selectTab = this.selectTab.bind(this);
    this.closedTab = this.closedTab.bind(this);
    this.addTab = this.addTab.bind(this);
    this.state = {
      tabs: [
        {
          id: 1,
          content: 'Exporter',
          active: true,
          display: <div>{this.lorem()}</div>
        }
      ]
    };
  }

  moveTab(dragIndex, hoverIndex) {
    this.setState((state, props) => {
      let newTabs = [...state.tabs];
      newTabs.splice(hoverIndex, 0, newTabs.splice(dragIndex, 1)[0]);

      return { tabs: newTabs };
    });
  }
  renderChat() {
    return <div />;
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
    return 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.';
  }

  render() {
    const activeTab = this.state.tabs.filter(tab => tab.active === true);
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
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
        </Row>
      </div>
    );
  }
}

export default Chat;
