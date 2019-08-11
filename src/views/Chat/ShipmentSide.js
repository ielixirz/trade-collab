/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable filenames/match-regex */
import React, { Component, useContext, useReducer } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Collapse, CardBody, Card, Row, Col } from 'reactstrap';
import ShipmentListContext from '../../context/ShipmentContext';

import shipmentReducer from '../../reducers/shipmentReducer';
import ShipmentList from '../../component/ShipmentList';
import TextLoading from '../../component/svg/TextLoading';

const styles = {
  button: {},
  boxColor: { fontSize: 20, color: '#367FEE', marginRight: 7 },
  title: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#707070',
    marginLeft: 10
  },
  arrow: {
    fontSize: '1.2em',
    marginLeft: 5,
    color: '#707070'
  },
  status: {
    color: '#367FEE'
  },
  card: {
    marginBottom: '0.2rem',
    marginTop: '0.2rem',
    marginRight: '0.2rem'
  }
};

const ShipmentData = ({ shipmentKey, chatroomKey, userKey, mainData }) => {
  const initialState = useContext(ShipmentListContext);

  const [state, dispatch] = useReducer(shipmentReducer, initialState);
  return (
    <ShipmentListContext.Provider
      value={{
        state,
        dispatch,
        shipmentKey,
        chatroomKey,
        userKey,
        mainData
      }}
    >
      <ShipmentList />
    </ShipmentListContext.Provider>
  );
};

class ShipmentSide extends Component {
  constructor(props) {
    super(props);
    this.triggerCollapse = this.triggerCollapse.bind(this);
  }

  triggerCollapse(e) {
    const preventId1 = e.target.parentElement.parentElement.parentElement.id;
    if (preventId1 !== 'master-detail-status-select') {
      this.props.collapseTrigger('SHIPMENT');
    }
  }

  render() {
    return (
      <div>
        <Card className="card-chat-side" onClick={this.triggerCollapse} style={styles.card}>
          <CardBody style={{ paddingRight: 10 }}>
            <Row style={{ marginBottom: '10px', paddingRight: 15 }}>
              <Col xs="10" className="text-left">
                <span style={styles.boxColor}>
                  <i className="fa fa-cube" />
                </span>
                <span style={styles.title}>
                  Shipment Update :{' '}
                  <span style={styles.status}>
                    {this.props.mainData.ShipmentStatus === undefined ? (
                      <TextLoading />
                    ) : (
                      this.props.mainData.ShipmentStatus
                    )}
                  </span>
                </span>
              </Col>
              <Col xs="2" className="text-right">
                {this.props.collapse === 'SHIPMENT' ? (
                  <span style={styles.arrow}>
                    <i className="fa fa-angle-down" />
                  </span>
                ) : (
                  <span style={styles.arrow}>
                    <i className="fa fa-angle-right" />
                  </span>
                )}
              </Col>
            </Row>
            <Collapse isOpen={this.props.collapse === 'SHIPMENT'}>
              <ShipmentData
                shipmentKey={this.props.shipmentKey}
                chatroomKey={this.props.chatroomKey}
                userKey={this.props.auth.uid}
                mainData={this.props.mainData}
              />
            </Collapse>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { authReducer, userReducer, profileReducer } = state;
  const profile = _.find(
    profileReducer.ProfileList,
    item => item.id === profileReducer.ProfileDetail.id
  );
  return {
    auth: authReducer.user,
    user: userReducer.UserInfo,
    currentProfile: profile
  };
};

export default connect(mapStateToProps)(ShipmentSide);
