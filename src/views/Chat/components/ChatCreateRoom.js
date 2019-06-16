/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable filenames/match-regex */
import React from 'react';
import {
  Card, CardBody, Row, Col, Button, UncontrolledCollapse,
} from 'reactstrap';

const ChatCreateRoom = ({
  createChatRoom, param, fetchChatMessage, user,
}) => (
  <Card>
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
          marginBottom: '50px',
        }}
      >
        <Col />
        <Col className="text-lg-center">
          <Button
            className="create-chat-button"
            style={{
              width: '250px',
            }}
            color="chatcreate"
            size="lg"
            active
            onClick={() => {
              createChatRoom(fetchChatMessage, param, 'Inbound Custom Broker', user);
            }}
          >
            Inbound Custom Broker
          </Button>
        </Col>
        <Col className="text-lg-center">
          <Button
            className="create-chat-button"
            style={{
              width: '250px',
            }}
            color="chatcreate"
            size="lg"
            active
            onClick={() => {
              createChatRoom(fetchChatMessage, param, 'Inbound Forwarder', user);
            }}
          >
            Inbound Forwarder
          </Button>
        </Col>
        <Col />
      </Row>
      <Row
        style={{
          marginTop: '50px',
          marginBottom: '50px',
        }}
      >
        <Col />
        <Col className="text-lg-center">
          <Button
            className="create-chat-button"
            color="chatcreate"
            size="lg"
            style={{
              width: '250px',
            }}
            active
            onClick={() => {
              createChatRoom(fetchChatMessage, param, 'Importer', user);
            }}
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
              width: '250px',
            }}
            active
            onClick={() => {
              createChatRoom(fetchChatMessage, param, 'Outbound Forwarder', user);
            }}
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
                    width: '600px',
                  }}
                  active
                  onClick={() => {
                    createChatRoom(fetchChatMessage, param, 'Blank Chat', user);
                  }}
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
                  marginRight: '200px',
                }}
                active
                onClick={() => {
                  createChatRoom(fetchChatMessage, param, 'Exporter', user);
                }}
              >
                Exporter
              </Button>
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px',
                }}
                active
                onClick={() => {
                  createChatRoom(fetchChatMessage, param, 'Importer', user);
                }}
              >
                Importer
              </Button>
            </Row>
            <br />
            {' '}
            <Row className="create-chat-others-row">
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px',
                  marginRight: '200px',
                }}
                active
                onClick={() => {
                  createChatRoom(fetchChatMessage, param, 'Outbound Forwarder', user);
                }}
              >
                Outbound Forwarder
              </Button>
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px',
                }}
                active
                onClick={() => {
                  createChatRoom(fetchChatMessage, param, 'Inbound Forwarder', user);
                }}
              >
                Inbound Forwarder
              </Button>
            </Row>
            <br />
            {' '}
            <Row className="create-chat-others-row">
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px',
                  marginRight: '200px',
                }}
                active
                onClick={() => {
                  createChatRoom(fetchChatMessage, param, 'Outbound Custom Broker', user);
                }}
              >
                Outbound Custom Broker
              </Button>
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px',
                }}
                active
                onClick={() => {
                  createChatRoom(fetchChatMessage, param, 'Inbound Custom Broker', user);
                }}
              >
                Inbound Custom Broker
              </Button>
            </Row>
            <br />
            {' '}
            <Row className="create-chat-others-row">
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px',
                  marginRight: '200px',
                }}
                onClick={() => {
                  createChatRoom(fetchChatMessage, param, 'Outbound Trucking', user);
                }}
                active
              >
                Outbound Trucking
              </Button>
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px',
                }}
                active
                onClick={() => {
                  createChatRoom(fetchChatMessage, param, 'Inbound Trucking', user);
                }}
              >
                Inbound Trucking
              </Button>
            </Row>
            <br />
            {' '}
            <Row className="create-chat-others-row">
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px',
                  marginRight: '200px',
                }}
                active
                onClick={() => {
                  createChatRoom(fetchChatMessage, param, 'Exporter Warehouse', user);
                }}
              >
                Exporter Warehouse
              </Button>
              <Button
                className="create-chat-button"
                color="chatcreate"
                size="lg"
                style={{
                  width: '200px',
                }}
                active
                onClick={() => {
                  createChatRoom(fetchChatMessage, param, 'Importer Warehouse', user);
                }}
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
