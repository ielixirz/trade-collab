/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable filenames/match-regex */
import React from 'react';
import { Row, Col, Button, UncontrolledCollapse, Card, CardBody } from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';

const getSystemTitle = title => {
  switch (title) {
    case 'InviteIntoShipment':
      return 'User has been invited';
    default:
      return title;
  }
};
const ChatMessage = ({ message, i }) => {
  const {
    title = 'System Message',
    type = 'sender',
    text = '',
    name = 'Anonymous',
    status = new Date(),
    readers = [],
    hasFile = false,
    files = [1, 2, 3]
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
  if (type === 'sender' || type === 'System') {
    return (
      <div key={i}>
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
        <div className="incoming_msg">
          <div className="received_msg">
            <div className="received_withd_msg">
              <Row className="flex-nowrap">
                <div className="sender">
                  <p className={type === 'System' ? 'system-message' : 'textP'}>
                    {type !== 'System' ? (
                      <div>
                        <span className="user-name">{name}</span>
                        <br />
                        {hasFile ? (
                          <Row style={{ margin: 'auto' }}>
                            <span style={text === '' ? {} : { marginRight: 100 }}>{text}</span>
                          </Row>
                        ) : (
                          text
                        )}
                      </div>
                    ) : (
                      <div>
                        <a
                          href={'#'}
                          style={{
                            color: 'black'
                          }}
                          className="user-name"
                          onClick={e => {
                            e.preventDefault();
                          }}
                          id={`toggler${i}`}
                        >
                          {getSystemTitle(name)}
                          {'  '}
                          <i className="fa fa-angle-double-down" />
                        </a>
                        <br />
                        <UncontrolledCollapse toggler={`#toggler${i}`}>{text}</UncontrolledCollapse>
                      </div>
                    )}
                    {hasFile ? (
                      <Row>
                        <Col xs="8">
                          {files.map(item => {
                            const { filename = 'nameoffile', type = 'pdf' } = item;
                            return (
                              <div style={{ fontSize: '0.8em' }}>
                                <svg
                                  style={{ marginRight: 10 }}
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="8.748"
                                  height="11.667"
                                  viewBox="0 0 8.748 11.667"
                                >
                                  <path
                                    id="file-regular"
                                    d="M8.427,2.133,6.516.221A1.094,1.094,0,0,0,5.743-.1H1.094A1.1,1.1,0,0,0,0,1v9.477a1.094,1.094,0,0,0,1.094,1.094H7.655a1.094,1.094,0,0,0,1.094-1.094V2.907a1.1,1.1,0,0,0-.321-.775Zm-.861.686H5.832V1.085ZM1.094,10.473V1H4.739V3.365a.545.545,0,0,0,.547.547H7.655v6.561Z"
                                    transform="translate(0 0.1)"
                                    fill="#ea4646"
                                  />
                                </svg>

                                {filename}
                                <br />
                              </div>
                            );
                          })}
                        </Col>
                        <Col
                          xs="auto"
                          style={{
                            marginLeft: '10px'
                          }}
                        >
                          <a
                            href=""
                            onClick={e => {
                              e.preventDefault();
                              _.forEach(files, item => {
                                const { link = 'http://example.com/files/myfile.pdf' } = item;

                                window.open(
                                  link,
                                  '_blank',
                                  'resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=10, left=10'
                                );
                              });
                            }}
                          >
                            <svg
                              id="Group_7399"
                              data-name="Group 7399"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              <g
                                id="Ellipse_593"
                                data-name="Ellipse 593"
                                fill="rgba(255,255,255,0)"
                                stroke="#9b9b9b"
                                stroke-width="1.5"
                              >
                                <circle cx="12" cy="12" r="12" stroke="none" />
                                <circle cx="12" cy="12" r="11.25" fill="none" />
                              </g>
                              <path
                                id="ic_file_download_24px"
                                d="M15.066,7.314H12.19V3H7.876V7.314H5l5.033,5.033Z"
                                transform="translate(2 5)"
                                fill="#9b9b9b"
                              />
                            </svg>
                          </a>
                        </Col>
                      </Row>
                    ) : (
                      ''
                    )}
                  </p>
                </div>
                <div>
                  <span className="time_date">{moment(status).format('hh:mm a')}</span>
                </div>
              </Row>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div key={i} className={'rightMessage'}>
      {isFirstMessageOfTheDay ? (
        <h2 className="time-background">
          <span className="time-seperation" align="center">
            {status.toDateString() === new Date().toDateString() ? 'Today' : status.toDateString()}
          </span>
        </h2>
      ) : (
        ''
      )}

      <div className="outgoing_msg">
        <div className="sent_msg">
          <span className="time_date">
            {readers.length > 1 ? `Read ${readers.length - 1}` : 'Sent'}
            <br />
            {moment(status).format('hh:mm a')}
          </span>

          <p className={'textP'}>
            {hasFile ? (
              <Row style={{ margin: 'auto' }}>
                <span style={text === '' ? {} : { marginRight: 100 }}>{text}</span>
              </Row>
            ) : (
              text
            )}
            {hasFile ? (
              <Row style={{ textAlign: 'left', marginTop: 7 }}>
                <Col xs="8">
                  {files.map(item => {
                    const { filename = 'nameoffile', type = 'pdf' } = item;
                    return (
                      <div style={{ fontSize: '0.8em' }}>
                        <svg
                          style={{ marginRight: 10 }}
                          xmlns="http://www.w3.org/2000/svg"
                          width="8.748"
                          height="11.667"
                          viewBox="0 0 8.748 11.667"
                        >
                          <path
                            id="file-regular"
                            d="M8.427,2.133,6.516.221A1.094,1.094,0,0,0,5.743-.1H1.094A1.1,1.1,0,0,0,0,1v9.477a1.094,1.094,0,0,0,1.094,1.094H7.655a1.094,1.094,0,0,0,1.094-1.094V2.907a1.1,1.1,0,0,0-.321-.775Zm-.861.686H5.832V1.085ZM1.094,10.473V1H4.739V3.365a.545.545,0,0,0,.547.547H7.655v6.561Z"
                            transform="translate(0 0.1)"
                            fill="#ea4646"
                          />
                        </svg>

                        {filename}
                        <br />
                      </div>
                    );
                  })}
                </Col>
                <Col
                  xs="1"
                  style={{
                    marginLeft: '10px'
                  }}
                >
                  <a
                    href=""
                    onClick={e => {
                      e.preventDefault();
                      _.forEach(files, item => {
                        const { link = 'http://example.com/files/myfile.pdf' } = item;

                        window.open(
                          link,
                          '_blank',
                          'resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=10, left=10'
                        );
                      });
                    }}
                  >
                    <svg
                      id="Group_7399"
                      data-name="Group 7399"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g
                        id="Ellipse_593"
                        data-name="Ellipse 593"
                        fill="rgba(255,255,255,0)"
                        stroke="#9b9b9b"
                        stroke-width="1.5"
                      >
                        <circle cx="12" cy="12" r="12" stroke="none" />
                        <circle cx="12" cy="12" r="11.25" fill="none" />
                      </g>
                      <path
                        id="ic_file_download_24px"
                        d="M15.066,7.314H12.19V3H7.876V7.314H5l5.033,5.033Z"
                        transform="translate(2 5)"
                        fill="#9b9b9b"
                      />
                    </svg>
                  </a>
                </Col>
              </Row>
            ) : (
              ''
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
