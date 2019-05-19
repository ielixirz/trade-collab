/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable filenames/match-regex */
/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
/* global $ */
import React from 'react';
import { Popover, PopoverBody } from 'reactstrap';
import { AddShipmentPin, DeleteShipmentPin } from '../../service/personalize/personalize';

export class AlertShipment extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false,
    };
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
  }

  onDeleteShipmentPin = () => {
    this.setState({ popoverOpen: false }, () => {
      DeleteShipmentPin(this.props.profileKey, this.props.item.ShipmentID).subscribe({
        next: (result) => {
          console.log('unpin success', result);
        },
        complete: () => {
          this.props.fetchPinned();
        },
        error: (err) => {
          console.log('err', err);
        },
      });
    });
  };

  onAddShipmentPin = () => {
    this.setState({ popoverOpen: false }, () => {
      AddShipmentPin(this.props.profileKey, this.props.item.ShipmentID).subscribe({
        next: (result) => {
          console.log('success', result);
        },
        complete: () => {
          this.props.fetchPinned();
        },
        error: (err) => {
          console.log('err', err);
        },
      });
    });
  };

  renderUnpin = () => (
    <div onClick={this.onDeleteShipmentPin} style={{ cursor: 'pointer' }}>
      unPin
    </div>
  );

  renderPin = () => (
    <div onClick={this.onAddShipmentPin} style={{ cursor: 'pointer' }}>
      Pin
    </div>
  );

  render() {
    return (
      <div className="alert-container">
        <div id={`alertover-${this.props.item.ShipmentID}`} onClick={this.toggle}>
          <i className="fa fa-ellipsis-v" />
        </div>
        {this.state.popoverOpen ? (
          <div className="alert-popover">
            {this.props.item.PIN ? this.renderUnpin() : this.renderPin()}
            <br />
            <p>Replicate Shipment</p>
          </div>
        ) : null}
        {/* <Popover
          placement="bottom"
          target={`alertover-${this.props.item.ShipmentID}`}
          innerRef={(node) => {
            this.popperNode = node;
          }}
          isOpen={this.state.popoverOpen}
          toggle={this.toggle}
        >
          <PopoverBody>
            {this.props.item.PIN ? this.renderUnpin() : this.renderPin()}
            <br />
            <p>Replicate Shipment</p>
          </PopoverBody>
        </Popover> */}
      </div>
    );
  }
}
