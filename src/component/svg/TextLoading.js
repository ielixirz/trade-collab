/* eslint-disable import/prefer-default-export */
/* eslint-disable filenames/match-regex */
import React from 'react';

const TextLoading = () => (
  <svg
    width="15px"
    height="15px"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    className="lds-ellipsis"
    style={{ background: 'none' }}
  >
    <circle cx="84" cy="50" r="0" fill="#71c2cc">
      <animate
        attributeName="r"
        values="10;0;0;0;0"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="2s"
        repeatCount="indefinite"
        begin="0s"
      />
      <animate
        attributeName="cx"
        values="84;84;84;84;84"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="2s"
        repeatCount="indefinite"
        begin="0s"
      />
    </circle>
    <circle cx="16" cy="50" r="9.28596" fill="#d8ebf9">
      <animate
        attributeName="r"
        values="0;10;10;10;0"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="2s"
        repeatCount="indefinite"
        begin="-1s"
      />
      <animate
        attributeName="cx"
        values="16;16;50;84;84"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="2s"
        repeatCount="indefinite"
        begin="-1s"
      />
    </circle>
    <circle cx="84" cy="50" r="0.71404" fill="#5699d2">
      <animate
        attributeName="r"
        values="0;10;10;10;0"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="2s"
        repeatCount="indefinite"
        begin="-0.5s"
      />
      <animate
        attributeName="cx"
        values="16;16;50;84;84"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="2s"
        repeatCount="indefinite"
        begin="-0.5s"
      />
    </circle>
    <circle cx="81.5723" cy="50" r="10" fill="#1d3f72">
      <animate
        attributeName="r"
        values="0;10;10;10;0"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="2s"
        repeatCount="indefinite"
        begin="0s"
      />
      <animate
        attributeName="cx"
        values="16;16;50;84;84"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="2s"
        repeatCount="indefinite"
        begin="0s"
      />
    </circle>
    <circle cx="47.5723" cy="50" r="10" fill="#71c2cc">
      <animate
        attributeName="r"
        values="0;0;10;10;10"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="2s"
        repeatCount="indefinite"
        begin="0s"
      />
      <animate
        attributeName="cx"
        values="16;16;16;50;84"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="2s"
        repeatCount="indefinite"
        begin="0s"
      />
    </circle>
  </svg>
);

export default TextLoading;
