/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React from 'react';
import { ButtonGroup, Button } from 'reactstrap';

const FileCardButtonGroup = props => (
  <ButtonGroup style={{ marginTop: 3, marginRight: 10 }}>
    <Button className="file-options-btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18.125"
        height="15.754"
        viewBox="0 0 18.125 15.754"
      >
        <path
          id="cloud_down"
          d="M369.883,134.958a3.934,3.934,0,0,0-2.888-2.52,6.745,6.745,0,0,0-5.934-3.465,6.849,6.849,0,0,0-5.1,2.284,4.493,4.493,0,0,0-2.467,7.814,1.133,1.133,0,0,0,1.9-.832v-.007a1.086,1.086,0,0,0-.366-.82,2.237,2.237,0,0,1-.726-2.122,2.284,2.284,0,0,1,2.222-1.812,1.924,1.924,0,0,1,.566.078,4.53,4.53,0,0,1,8.38,1.194,1.528,1.528,0,0,1,.679-.147,1.7,1.7,0,0,1,1.6,1.126,1.551,1.551,0,0,1,.1.566,1.68,1.68,0,0,1-.639,1.316,1.2,1.2,0,0,0-.494.925,1.132,1.132,0,0,0,1.844.88,3.919,3.919,0,0,0,1.556-3.129A3.777,3.777,0,0,0,369.883,134.958Zm-7.361,5.6-.328.33v-5.16a1.132,1.132,0,1,0-2.265,0v5.16l-.332-.33a1.133,1.133,0,0,0-1.6,0,1.119,1.119,0,0,0,0,1.591l2.265,2.25a1.133,1.133,0,0,0,1.6,0l2.265-2.25a1.119,1.119,0,0,0,0-1.591,1.133,1.133,0,0,0-1.6,0Z"
          transform="translate(-351.996 -128.973)"
          fill="#7b7b7b"
          fillRule="evenodd"
        />
      </svg>
    </Button>
    <Button className="file-options-btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19.013"
        height="16.938"
        viewBox="0 0 19.013 16.938"
      >
        <path
          id="reply-solid"
          d="M16.738,37.245l-5.849-5.05a.8.8,0,0,0-1.319.6v2.66C4.233,35.519,0,36.589,0,41.647a6.793,6.793,0,0,0,2.769,5.122A.592.592,0,0,0,3.7,46.15c-1.507-4.819.715-6.1,5.868-6.172V42.9a.8.8,0,0,0,1.319.6l5.849-5.051A.8.8,0,0,0,16.738,37.245Z"
          transform="translate(1 -30.978)"
          fill="none"
          stroke="#707070"
          strokeWidth="2"
        />
      </svg>
    </Button>
    <Button className="file-options-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="4" height="16" viewBox="0 0 4 16">
        <g id="Group_7768" data-name="Group 7768" transform="translate(0.226 2.088)">
          <circle
            id="Ellipse_6"
            data-name="Ellipse 6"
            cx="2"
            cy="2"
            r="2"
            transform="translate(-0.226 -2.088)"
            fill="#7b7b7b"
          />
          <circle
            id="Ellipse_7"
            data-name="Ellipse 7"
            cx="2"
            cy="2"
            r="2"
            transform="translate(-0.226 3.912)"
            fill="#7b7b7b"
          />
          <circle
            id="Ellipse_8"
            data-name="Ellipse 8"
            cx="2"
            cy="2"
            r="2"
            transform="translate(-0.226 9.912)"
            fill="#7b7b7b"
          />
        </g>
      </svg>
    </Button>
  </ButtonGroup>
);

export default FileCardButtonGroup;
