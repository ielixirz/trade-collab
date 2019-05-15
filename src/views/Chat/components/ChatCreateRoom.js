/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable filenames/match-regex */
import React from 'react';
import {
  Card, CardBody, Row, Col, Button, UncontrolledCollapse,
} from 'reactstrap';

const ChatCreateRoom = ({ createChatRoom }) => (
  <Card>
    <CardBody>
      <Row>
        <Col xs={4} />
        <Col xs={4} className="text-lg-center">
          Inform Other Party about this shipments
        </Col>
        <Col xs={4} />
      </Row>
      <Row
        style={{
          marginTop: '100px',
          marginBottom: '100px',
        }}
      >
        <Col />
        <Col className="text-lg-center">
          <Button
            style={{
              width: '250px',
            }}
            color="yterminal"
            size="lg"
            active
            onClick={() => {
              createChatRoom('Inbound Custom Broker');
            }}
          >
            Inbound Custom Broker
          </Button>
        </Col>
        <Col className="text-lg-center">
          <Button
            style={{
              width: '250px',
            }}
            color="yterminal"
            size="lg"
            active
            onClick={() => {
              createChatRoom('Inbound Forwarder');
            }}
          >
            Inbound Forwarder
          </Button>
        </Col>
        <Col />
      </Row>
      <Row
        style={{
          marginTop: '100px',
          marginBottom: '100px',
        }}
      >
        <Col />
        <Col className="text-lg-center">
          <Button
            color="yterminal"
            size="lg"
            style={{
              width: '250px',
            }}
            active
            onClick={() => {
              createChatRoom('Importer');
            }}
          >
            Importer
          </Button>
        </Col>
        <Col className="text-lg-center">
          <Button
            color="yterminal"
            size="lg"
            style={{
              width: '250px',
            }}
            active
            onClick={() => {
              createChatRoom('Outbound Forwarder');
            }}
          >
            Outbound Forwarder
          </Button>
        </Col>
        <Col />
      </Row>
      <Row>
        <Col />
        <Col md="auto">
          <a href="#" id="toggler">
            {' '}
            Non of the above? - See Other Parties
          </a>
        </Col>
        <Col />
      </Row>
      <Row>
        <Col />
        <Col md="auto">
          <UncontrolledCollapse toggler="#toggler">
            <Row>
              <Col>
                <Button
                  color="yterminal"
                  size="lg"
                  style={{
                    width: '600px',
                  }}
                  active
                  onClick={() => {
                    createChatRoom('Blank Chat');
                  }}
                >
                  Blank Chat
                </Button>
              </Col>
            </Row>
            <br />
            <Row>
              <Button
                color="yterminal"
                size="lg"
                style={{
                  width: '200px',
                  marginRight: '200px',
                }}
                active
                onClick={() => {
                  createChatRoom('Exporter');
                }}
              >
                Exporter
              </Button>
              <Button
                color="yterminal"
                size="lg"
                style={{
                  width: '200px',
                }}
                active
                onClick={() => {
                  createChatRoom('Importer');
                }}
              >
                Importer
              </Button>
            </Row>
            <br />
            {' '}
            <Row>
              <Button
                color="yterminal"
                size="lg"
                style={{
                  width: '200px',
                  marginRight: '200px',
                }}
                active
                onClick={() => {
                  createChatRoom('Outbound Forwarder');
                }}
              >
                Outbound Forwarder
              </Button>
              <Button
                color="yterminal"
                size="lg"
                style={{
                  width: '200px',
                }}
                active
                onClick={() => {
                  createChatRoom('Inbound Forwarder');
                }}
              >
                Inbound Forwarder
              </Button>
            </Row>
            <br />
            {' '}
            <Row>
              <Button
                color="yterminal"
                size="lg"
                style={{
                  width: '200px',
                  marginRight: '200px',
                }}
                active
                onClick={() => {
                  createChatRoom('Outbound Custom Broker');
                }}
              >
                Outbound Custom Broker
              </Button>
              <Button
                color="yterminal"
                size="lg"
                style={{
                  width: '200px',
                }}
                active
                onClick={() => {
                  createChatRoom('Inbound Custom Broker');
                }}
              >
                Inbound Custom Broker
              </Button>
            </Row>
            <br />
            {' '}
            <Row>
              <Button
                color="yterminal"
                size="lg"
                style={{
                  width: '200px',
                  marginRight: '200px',
                }}
                onClick={() => {
                  createChatRoom('Outbound Trucking');
                }}
                active
              >
                Outbound Trucking
              </Button>
              <Button
                color="yterminal"
                size="lg"
                style={{
                  width: '200px',
                }}
                active
                onClick={() => {
                  createChatRoom('Inbound Trucking');
                }}
              >
                Inbound Trucking
              </Button>
            </Row>
            <br />
            {' '}
            <Row>
              <Button
                color="yterminal"
                size="lg"
                style={{
                  width: '200px',
                  marginRight: '200px',
                }}
                active
                onClick={() => {
                  createChatRoom('Exporter Warehouse');
                }}
              >
                Exporter Warehouse
              </Button>
              <Button
                color="yterminal"
                size="lg"
                style={{
                  width: '200px',
                }}
                active
                onClick={() => {
                  createChatRoom('Importer Warehouse');
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
