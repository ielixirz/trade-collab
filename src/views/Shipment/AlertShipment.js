/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable filenames/match-regex */
/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
/* global $ */
import React from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Popover,
  PopoverBody,
  UncontrolledDropdown
} from 'reactstrap';
import { AddShipmentPin, DeleteShipmentPin } from '../../service/personalize/personalize';

export class AlertShipment extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false
    };
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  onDeleteShipmentPin = () => {
    this.setState({ popoverOpen: false }, () => {
      DeleteShipmentPin(this.props.profileKey, this.props.item.ShipmentID).subscribe({
        next: result => {
          console.log('unpin success', result);
        },
        complete: () => {
          this.props.fetchPinned();
        },
        error: err => {
          console.log('err', err);
        }
      });
    });
  };

  onAddShipmentPin = () => {
    this.setState({ popoverOpen: false }, () => {
      AddShipmentPin(this.props.profileKey, this.props.item.ShipmentID).subscribe({
        next: result => {
          console.log('success', result);
        },
        complete: () => {
          this.props.fetchPinned();
        },
        error: err => {
          console.log('err', err);
        }
      });
    });
  };

  renderUnpin = () => (
    <div onClick={this.onDeleteShipmentPin} style={{ cursor: 'pointer' }}>
      Unpin
    </div>
  );

  renderPin = () => (
    <div onClick={this.onAddShipmentPin} style={{ cursor: 'pointer' }}>
      Pin
    </div>
  );

  render() {
    return (
      <UncontrolledDropdown>
        <DropdownToggle>
          <i className="fa fa-ellipsis-v" />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>{this.props.item.PIN ? this.renderUnpin() : this.renderPin()}</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
}
