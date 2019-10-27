/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable filenames/match-regex */
import React from 'react';
import './OrderInfoTab.scss';

const factoryLogo = require('./factoryLogo.svg');
const werehouse = require('./warehouse-solid.svg');
const progressBoat = require('./progressBoat.svg');

const iconStyle = {
  marginTop: 7,
};

const boatStyle = {
  marginBottom: 11,
  width: 11.2,
  height: 12.3,
};

export default class OrderInfoTabProgress extends React.Component {
  render() {
    switch (this.props.progress) {
      case 0:
        return (
          // Progress 0
          <React.Fragment></React.Fragment>
        );
      case 1:
        return (
          // Progress 1
          <React.Fragment>
            <div className="Path-4121">
              <img style={iconStyle} src={factoryLogo} />
            </div>
            {/*  !Important
                 progress-line-green height + progress-line-grey height need to equal to => 130px */}
            <div className="progress-line-green" style={{ height: 20 }} />
            <div className="progress-boat">
              <img style={boatStyle} src={progressBoat} />
            </div>
            <div className="progress-line-grey" style={{ height: 110 }} />
            <div className="Path-4121 progress">
              <img style={iconStyle} src={werehouse} />
            </div>
          </React.Fragment>
        );
      default:
        return <div />;
    }
  }
}
