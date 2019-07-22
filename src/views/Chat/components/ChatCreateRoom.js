/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable filenames/match-regex */
import React from 'react';
import { Card, CardBody, Row, Col, Button, UncontrolledCollapse, Input } from 'reactstrap';
import _ from 'lodash';
import {
  CreateShipmentReference,
  UpdateShipmentReference
} from '../../../service/shipment/shipment';

const ChatCreateRoom = ({ createChatRoom, param, fetchChatMessage, user }) => (
  <Card className="card-chat-side">
    <CardBody>
      <Row style={{ marginTop: '30px' }}>
        <Col xs={3} />
        <Col xs={6} className="text-lg-center">
          <h2 style={{ fontSize: '1.5em' }}>
            <b>Inform other party about this shipments</b>
          </h2>
        </Col>
        <Col xs={3} />
      </Row>
      <Row
        style={{
          marginTop: '50px',
          marginBottom: '50px'
        }}
      >
        <Col />
        <Col className="text-lg-center">
          <Button
            className="create-chat-button"
            style={{
              width: '250px'
            }}
            color="chatcreate"
            size="lg"
            active
            onClick={_.debounce(
              event => {
                createChatRoom(fetchChatMessage, param, 'Inbound Custom Broker', user);
              },
              2000,
              {
                leading: true,
                trailing: false
              }
            )}
          >
            Inbound Custom Broker
          </Button>
        </Col>
        <Col className="text-lg-center">
          <Button
            className="create-chat-button"
            style={{
              width: '250px'
            }}
            color="chatcreate"
            size="lg"
            active
            onClick={_.debounce(
              event => {
                createChatRoom(fetchChatMessage, param, 'Inbound Forwarder', user);
              },
              2000,
              {
                leading: true,
                trailing: false
              }
            )}
          >
            Inbound Forwarder
          </Button>
        </Col>
        <Col />
      </Row>
      <Row
        style={{
          marginTop: '50px',
          marginBottom: '50px'
        }}
      >
        <Col />
        <Col className="text-lg-center">
          <Button
            className="create-chat-button"
            color="chatcreate"
            size="lg"
            style={{
              width: '250px'
            }}
            active
            onClick={_.debounce(
              event => {
                createChatRoom(fetchChatMessage, param, 'Importer', user);
              },
              2000,
              {
                leading: true,
                trailing: false
              }
            )}
          >
            Importer
          </Button>
        </Col>
        <Col className="text-lg-center">
          <Button
            className="create-chat-button"
            color="chatcreate"
            size="lg"
            style={{
              width: '250px'
            }}
            active
            onClick={_.debounce(
              event => {
                createChatRoom(fetchChatMessage, param, 'Outbound Forwarder', user);
              },
              2000,
              {
                leading: true,
                trailing: false
              }
            )}
          >
            Outbound Forwarder
          </Button>
        </Col>
        <Col />
      </Row>
      <Row style={{ marginBottom: '50px' }}>
        <Col />
        <Col md="auto">
          <a href="#" id="toggler" style={{ color: '#16A085' }}>
            {' '}
            <b>Non of the above? - See Other Parties</b>
          </a>
        </Col>
        <Col />
      </Row>
      <Row>
        <Col />
        <Col>
          <UncontrolledCollapse toggler="#toggler">
            <Row className="create-chat-others-row">
              <Col>
                <Button
                  className="create-chat-button"
                  color="chatcreate"
                  size="lg"
                  style={{
                    width: '600px'
                  }}
                  active
                  onClick={_.debounce(
                    event => {
                      createChatRoom(fetchChatMessage, param, 'Blank Chat', user);
                    },
                    2000,
                    {
                      leading: true,
                      trailing: false
                    }
                  )}
                >
                  Blank Chat
                </Button>
              </Col>
            </Row>
            <br />
            <Row className="create-chat-others-row">
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px',
                  marginRight: '200px'
                }}
                active
                onClick={_.debounce(
                  event => {
                    createChatRoom(fetchChatMessage, param, 'Exporter', user);
                  },
                  2000,
                  {
                    leading: true,
                    trailing: false
                  }
                )}
              >
                Exporter
              </Button>
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px'
                }}
                active
                onClick={_.debounce(
                  event => {
                    createChatRoom(fetchChatMessage, param, 'Importer', user);
                  },
                  2000,
                  {
                    leading: true,
                    trailing: false
                  }
                )}
              >
                Importer
              </Button>
            </Row>
            <br />{' '}
            <Row className="create-chat-others-row">
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px',
                  marginRight: '200px'
                }}
                active
                onClick={_.debounce(
                  event => {
                    createChatRoom(fetchChatMessage, param, 'Outbound Forwarder', user);
                  },
                  2000,
                  {
                    leading: true,
                    trailing: false
                  }
                )}
              >
                Outbound Forwarder
              </Button>
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px'
                }}
                active
                onClick={_.debounce(
                  event => {
                    createChatRoom(fetchChatMessage, param, 'Inbound Forwarder', user);
                  },
                  2000,
                  {
                    leading: true,
                    trailing: false
                  }
                )}
              >
                Inbound Forwarder
              </Button>
            </Row>
            <br />{' '}
            <Row className="create-chat-others-row">
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px',
                  marginRight: '200px'
                }}
                active
                onClick={_.debounce(
                  event => {
                    createChatRoom(fetchChatMessage, param, 'Outbound Custom Broker', user);
                  },
                  2000,
                  {
                    leading: true,
                    trailing: false
                  }
                )}
              >
                Outbound Custom Broker
              </Button>
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px'
                }}
                active
                onClick={_.debounce(
                  event => {
                    createChatRoom(fetchChatMessage, param, 'Inbound Custom Broker', user);
                  },
                  2000,
                  {
                    leading: true,
                    trailing: false
                  }
                )}
              >
                Inbound Custom Broker
              </Button>
            </Row>
            <br />{' '}
            <Row className="create-chat-others-row">
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px',
                  marginRight: '200px'
                }}
                onClick={_.debounce(
                  event => {
                    createChatRoom(fetchChatMessage, param, 'Outbound Trucking', user);
                  },
                  2000,
                  {
                    leading: true,
                    trailing: false
                  }
                )}
                active
              >
                Outbound Trucking
              </Button>
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px'
                }}
                active
                onClick={_.debounce(
                  event => {
                    createChatRoom(fetchChatMessage, param, 'Inbound Trucking', user);
                  },
                  2000,
                  {
                    leading: true,
                    trailing: false
                  }
                )}
              >
                Inbound Trucking
              </Button>
            </Row>
            <br />{' '}
            <Row className="create-chat-others-row">
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px',
                  marginRight: '200px'
                }}
                active
                onClick={_.debounce(
                  event => {
                    createChatRoom(fetchChatMessage, param, 'Exporter Warehouse', user);
                  },
                  2000,
                  {
                    leading: true,
                    trailing: false
                  }
                )}
              >
                Exporter Warehouse
              </Button>
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px'
                }}
                active
                onClick={_.debounce(
                  event => {
                    createChatRoom(fetchChatMessage, param, 'Importer Warehouse', user);
                  },
                  2000,
                  {
                    leading: true,
                    trailing: false
                  }
                )}
              >
                Importer Warehouse
              </Button>
            </Row>
            <br />
          </UncontrolledCollapse>
        </Col>
        <Col />
      </Row>
    </CardBody>
  </Card>
);

export default ChatCreateRoom;
