/* eslint-disable import/prefer-default-export */
/* eslint-disable filenames/match-regex */
import React from 'react';

const ProfileLoading = () => (
  <svg
    width="100px"
    height="100px"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    className="lds-rolling"
    style={{ background: 'none', marginLeft: 70, paddingBottom: 20 }}
  >
    <circle
      cx="50"
      cy="50"
      fill="none"
      ng-attr-stroke="{{config.color}}"
      ng-attr-stroke-width="{{config.width}}"
      ng-attr-r="{{config.radius}}"
      ng-attr-stroke-dasharray="{{config.dasharray}}"
      stroke="#337ab7"
      strokeWidth="10"
      r="35"
      strokeDasharray="164.93361431346415 56.97787143782138"
      transform="rotate(238.437 50 50)"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        calcMode="linear"
        values="0 50 50;360 50 50"
        keyTimes="0;1"
        dur="1s"
        begin="0s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

export default ProfileLoading;
