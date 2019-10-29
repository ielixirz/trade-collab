/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable filenames/match-regex */
import React from 'react';
import './OrderInfoTab.scss';
import werehouse from '../../../component/svg/werehouse';

const factoryLogo = require('./factoryLogo.svg');
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
    if (this.props.progress > 0 && this.props.progress < 10) {
      return (
        <React.Fragment>
          <div className="Path-4121">
            <img style={iconStyle} src={factoryLogo} />
          </div>
          {/*  !Important
                 progress-line-green height + progress-line-grey height need to equal to => 130px */}
          <div
            className="progress-line-green"
            style={{ height: this.props.progress * 16 }}
          />
          <div className="progress-boat">
            <img style={boatStyle} src={progressBoat} />
          </div>
          <div
            className="progress-line-grey"
            style={{ height: 160 - this.props.progress * 16 }}
          />
          <div className="Path-4121 progress">
            <div style={iconStyle}>{werehouse(this.props.progress === 10)}</div>
          </div>
        </React.Fragment>
      );
    } else if (this.props.progress === 10) {
      return (
        <React.Fragment>
          <div className="Path-4121">
            <img style={iconStyle} src={factoryLogo} />
          </div>
          {/*  !Important
                 progress-line-green height + progress-line-grey height need to equal to => 130px */}
          <div className="progress-line-green" style={{ height: 160 }} />

          <div className="Path-4121">
            <div style={iconStyle}>{werehouse(this.props.progress === 10)}</div>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        // Progress 0
        <React.Fragment></React.Fragment>
      );
    }
  }
}
