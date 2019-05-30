/* eslint-disable filenames/match-regex */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import CompanyPanel from './CompanyPanel';
import ProfilePanel from './ProfilePanel';
import SettingPanel from './SettingPanel';
import './Network.css';

class Network extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    // this.props.fetchShipments(this.state.typeShipment);
  }

  render() {
    return (
      <div className="network-container">
        <Switch>
          <Route exact path="/network" name="Profile Page" component={ProfilePanel} />
          <Route
            exact
            path="/network/company/settings/:key"
            name="Company Setting Page"
            component={SettingPanel}
          />
          <Route exact path="/network/company/:key" name="Company Page" component={CompanyPanel} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  //   network: state.networkReducer.network,
});

export default connect(
  mapStateToProps,
  {},
)(Network);
