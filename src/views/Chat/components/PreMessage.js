/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable filenames/match-regex */
import React from 'react';
import { Row, Col } from 'reactstrap';
import _ from 'lodash';
import ReactHtmlParser from 'react-html-parser';

const PreMessage = ({ message, callback }) => {
  const { ChatRoomMessageContext = 'Test message' } = message;
  let premessage = {};

  if (message.ChatRoomMessageType === 'File') {
    const msgJson = JSON.parse(message.ChatRoomMessageContext);
    premessage = {
      text: msgJson.msg,
      name: message.ChatRoomMessageSender
    };
  } else {
    premessage = {
      text: message.ChatRoomMessageContext,
      name: message.ChatRoomMessageSender
    };
  }
  const { text = '' } = premessage;
  const sendMessage = callback;
  return (
    <div>
      <div className="outgoing_msg">
        <div className="sent_msg">
          <div>
            <span className="time_date">{status(message, sendMessage)}</span>
          </div>
          <div>
            <p className={'textP'}>{ReactHtmlParser(text)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const status = (message, sendMessage) => {
  const { isSending, isSuccess, ChatRoomMessageContext, ChatRoomKey, ShipmentKey } = message;
  if (isSending) {
    return 'Sending . . .';
  }
  if (isSuccess === false) {
    return (
      <a
        href="#"
        onClick={e => {
          e.preventDefault();
          sendMessage(ChatRoomKey, ShipmentKey, ChatRoomMessageContext);
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="53" height="13" viewBox="0 0 53 13">
          <g id="Group_519" data-name="Group 519" transform="translate(50.455 -11)">
            <text
              id="Resend"
              transform="translate(-32.455 21)"
              fill="#ea4646"
              fontSize="10"
              fontFamily="Muli-SemiBold, Muli"
              fontWeight="600"
            >
              <tspan x="0" y="0">
                Resend
              </tspan>
            </text>
            <g id="refresh-ccw" transform="translate(-164.455 -45)">
              <g id="icon_refresh-ccw" data-name="icon/refresh-ccw" transform="translate(0 -1)">
                <path
                  id="Combined-Shape"
                  d="M12.639,8.859a.6.6,0,0,1,.037.21v3.456a.552.552,0,1,1-1.1,0V10.4L9.957,11.987a5.354,5.354,0,0,1-5.114,1.547,5.6,5.6,0,0,1-3.979-3.7A.583.583,0,0,1,1.2,9.1a.545.545,0,0,1,.7.351A4.482,4.482,0,0,0,5.086,12.41a4.291,4.291,0,0,0,4.1-1.25l1.543-1.516H8.818a.577.577,0,0,1,0-1.152h3.307a.552.552,0,0,1,.511.36ZM.037,5.817A.6.6,0,0,1,0,5.607V2.151a.564.564,0,0,1,.551-.576.564.564,0,0,1,.551.576V4.277L2.719,2.689A5.354,5.354,0,0,1,7.833,1.142a5.6,5.6,0,0,1,3.979,3.7.583.583,0,0,1-.336.735.545.545,0,0,1-.7-.351A4.482,4.482,0,0,0,7.59,2.266a4.291,4.291,0,0,0-4.1,1.25L1.942,5.032H3.858a.577.577,0,0,1,0,1.152H.551a.552.552,0,0,1-.511-.36Z"
                  transform="translate(114 56.324)"
                  fill="#ea4646"
                />
              </g>
            </g>
          </g>
        </svg>
      </a>
    );
  }
};

export default PreMessage;
