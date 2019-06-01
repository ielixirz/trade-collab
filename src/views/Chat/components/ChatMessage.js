/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable filenames/match-regex */
import React from 'react';
import { Row, Col, Button, UncontrolledCollapse, Card, CardBody } from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';

const ChatMessage = ({ message, i }) => {
  const {
    title = 'exporter has been updated',
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
  if (type === 'sender' || type === 'system') {
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
                  <p>
                    <span className="user-name">{name}</span> <br />
                    {type !== 'system' ? (
                      text
                    ) : (
                      <div>
                        <a color="primary" id={`toggler${i}`} style={{ marginBottom: '1rem' }}>
                          {title}
                        </a>
                        <UncontrolledCollapse toggler={`#toggler${i}`}>{text}</UncontrolledCollapse>
                      </div>
                    )}
                    {hasFile ? (
                      <Row>
                        <Col xs="8">
                          {files.map(item => {
                            const { filename = 'nameoffile', type = 'pdf' } = item;
                            return (
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="131"
                                  height="15"
                                  viewBox="0 0 131 15"
                                >
                                  <text
                                    id="nameoffile.pdf_PDF_15_KB_"
                                    data-name="nameoffile.pdf PDF 15 KB     "
                                    transform="translate(0 12)"
                                    fill="#4a4a4a"
                                    font-size="11"
                                    font-family="Muli-Regular, Muli"
                                  >
                                    <tspan x="0" y="0">
                                      {filename}
                                    </tspan>
                                    <tspan y="0" font-size="12">
                                      {' '}
                                    </tspan>
                                    <tspan y="0" font-size="8">
                                      {type}
                                    </tspan>
                                    <tspan y="0" font-size="12">
                                      {' '}
                                    </tspan>
                                  </text>
                                </svg>
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
                <Col xs={4}>
                  <span className="time_date">{moment(status).format('hh:mm a')}</span>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div key={i}>
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
          <Row className="receiver">
            <div>
              <span className="time_date">
                {readers.length > 1 ? `Read ${readers.length - 1}` : 'Sent'}
                <br />
                {moment(status).format('hh:mm a')}
              </span>
            </div>
            <div>
              <p>
                {text}
                {hasFile ? (
                  <Row>
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
                    <Col xs="8">
                      {files.map(item => {
                        const { filename = 'nameoffile', type = 'pdf' } = item;
                        return (
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="131"
                              height="15"
                              viewBox="0 0 131 15"
                            >
                              <text
                                id="nameoffile.pdf_PDF_15_KB_"
                                data-name="nameoffile.pdf PDF 15 KB     "
                                transform="translate(0 12)"
                                fill="#4a4a4a"
                                font-size="11"
                                font-family="Muli-Regular, Muli"
                              >
                                <tspan x="0" y="0">
                                  {filename}
                                </tspan>
                                <tspan y="0" font-size="12">
                                  {' '}
                                </tspan>
                                <tspan y="0" font-size="8">
                                  {type}
                                </tspan>
                                <tspan y="0" font-size="12">
                                  {' '}
                                </tspan>
                              </text>
                            </svg>
                            <br />
                          </div>
                        );
                      })}
                    </Col>
                  </Row>
                ) : (
                  ''
                )}
              </p>
            </div>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
