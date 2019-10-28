/* eslint-disable filenames/match-regex */
/* as it is component */
import React, { useContext, useRef, useEffect, useState } from 'react';
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  Container,
  Jumbotron,
} from 'reactstrap';
import moment from 'moment';
import ShipmentContext from '../context/ShipmentContext';
import MasterDetailModal from './MasterDetailModal';

import { GetMasterDataChatRoom } from '../service/masterdata/masterdata';
import { GetDiffDay } from '../utils/date';
import OrderInfoTab from '../views/Chat/components/OrderInfoTab';
import ShippingInfoTab from '../views/Chat/components/ShippingInfoTab';
import RoleTabs from '../views/Chat/components/RoleTabs';

const shipmentListGroupStyle = {
  maxHeight: '60vh',
  overflow: 'scroll',
  overflowX: 'hidden',
  fontSize: '0.9em',
};

const renderTab = (tabId, data) => {
  switch (tabId) {
    case 1:
      return <OrderInfoTab {...data} />;
    case 2:
      return <ShippingInfoTab {...data} />;
    default:
      return <RoleTabs {...data} />;
  }
};

const ShipmentList = () => {
  const { chatroomKey, shipmentKey, userKey } = useContext(ShipmentContext);
  const [masterData, setMasterData] = useState(undefined);
  const [lastUpdate, setLastUpdate] = useState(undefined);
  const [orderTab, setTab] = useState(1);
  const masterDetailModalRef = useRef(null);

  useEffect(() => {
    GetMasterDataChatRoom(shipmentKey, chatroomKey).subscribe(doc => {
      const data = doc[0].data();
      setMasterData([data]);
    });
  }, [lastUpdate]);

  const updateLastUpdate = lastUpdateData => {
    setLastUpdate(lastUpdateData);
  };

  const preventParentCollapse = e => {
    e.stopPropagation();
  };

  return (
    <div>
      <MasterDetailModal
        ref={masterDetailModalRef}
        lastUpdate={updateLastUpdate}
      />
      {masterData === undefined
        ? ''
        : masterData.map(data => (
            <ListGroup
              onClick={preventParentCollapse}
              flush
              style={shipmentListGroupStyle}
            >
              <ListGroupItem
                tag="a"
                style={{ borderBottom: 0, paddingLeft: 7 }}
              >
                <nav className="nav nav-tabs nav-justified">
                  <a
                    className={`nav-item nav-link ${
                      orderTab === 1 ? 'activeTab' : ''
                    }`}
                    onClick={e => {
                      e.preventDefault();
                      setTab(1);
                    }}
                  >
                    Order Info.
                  </a>
                  <a
                    className={`nav-item nav-link ${
                      orderTab === 2 ? 'activeTab' : ''
                    }`}
                    onClick={e => {
                      setTab(2);

                      e.preventDefault();
                    }}
                  >
                    Shipping Info.
                  </a>
                  <a
                    className={`nav-item nav-link ${
                      orderTab === 3 ? 'activeTab' : ''
                    }`}
                    onClick={e => {
                      setTab(3);
                      e.preventDefault();
                    }}
                  >
                    Role
                  </a>
                </nav>
                <br />
                <Container>
                  {renderTab(orderTab, {
                    ...data,
                    chatroomKey,
                    shipmentKey,
                    userKey,
                  })}
                </Container>
              </ListGroupItem>
            </ListGroup>
          ))}
    </div>
  );
};

export default ShipmentList;
