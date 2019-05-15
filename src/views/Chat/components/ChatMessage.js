/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable filenames/match-regex */
import React from 'react';
import { Row, Col } from 'reactstrap';
import _ from 'lodash';

const ChatMessage = ({ message, i }) => {
  const {
    type = 'sender',
    text = 'Test message',
    name = 'Anonymous',
    status = new Date()
  } = message;
  const prev = _.get(message, 'prev', false);
  let isFirstMessageOfTheDay = false;
  if (prev) {
    const t = new Date(prev.ChatRoomMessageTimestamp.seconds * 1000);

    if (t.toDateString() === status.toDateString()) {
      isFirstMessageOfTheDay = false;
    } else {
      isFirstMessageOfTheDay = true;
    }
  } else {
    isFirstMessageOfTheDay = true;
  }
  if (type === 'sender') {
    return (
      <div key={i}>
        <div className="incoming_msg">
          <div className="received_msg">
            <div className="received_withd_msg">
              <Row>
                <Col xs="8">
                  <p>
                    <span className="user-name">{name}</span> <br />
                    {text}
                  </p>
                </Col>
                <Col xs={4}>
                  <span className="time_date"> {status.toLocaleTimeString()}</span>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        {isFirstMessageOfTheDay ? (
          <h2 className="time-background">
            <span className="time-seperation" align="center">
              {status.toDateString() === new Date().toDateString()
                ? 'Today'
                : status.toDateString()}
            </span>
          </h2>
        ) : (
          ''
        )}
      </div>
    );
  }
  return (
    <div key={i}>
      <div className="outgoing_msg">
        <div className="sent_msg">
          <Row>
            <Col xs={4}>
              <span className="time_date"> {status.toLocaleTimeString()}</span>
            </Col>
            <Col>
              <p>{text}</p>
            </Col>
          </Row>
        </div>
      </div>
      {isFirstMessageOfTheDay ? (
        <h2 className="time-background">
          <span className="time-seperation" align="center">
            {status.toDateString() === new Date().toDateString() ? 'Today' : status.toDateString()}
          </span>
        </h2>
      ) : (
        ''
      )}
    </div>
  );
};

export default ChatMessage;
