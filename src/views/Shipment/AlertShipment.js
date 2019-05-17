/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable filenames/match-regex */
/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
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

  renderUnpin = () => (
    <div
      onClick={() => {
        DeleteShipmentPin(this.props.profileKey, this.props.item.ShipmentID).subscribe({
          next: (result) => {
            console.log('unpin success', result);
          },
          complete: (result) => {
            this.props.fetchPinned();
          },
          error: (err) => {
            console.log('err', err);
          },
        });
      }}
      style={{ cursor: 'pointer' }}
    >
      unPin
    </div>
  );

  renderPin = () => (
    <div
      onClick={() => {
        AddShipmentPin(this.props.profileKey, this.props.item.ShipmentID).subscribe({
          next: (result) => {
            console.log('success', result);
          },
          complete: (result) => {
            this.props.fetchPinned();
          },
          error: (err) => {
            console.log('err', err);
          },
        });
      }}
      style={{ cursor: 'pointer' }}
    >
      Pin
    </div>
  );

  render() {
    return (
      <div>
        <div id={`alertover-${this.props.id}`}>
          <i className="fa fa-ellipsis-v" />
        </div>
        <Popover
          placement="bottom"
          isOpen={this.state.popoverOpen}
          target={`alertover-${this.props.id}`}
          toggle={this.toggle}
        >
          <PopoverBody>
            {this.props.item.PIN ? this.renderUnpin() : this.renderPin()}
            <br />
            <p>Replicate Shipment</p>
          </PopoverBody>
        </Popover>
      </div>
    );
  }
}
