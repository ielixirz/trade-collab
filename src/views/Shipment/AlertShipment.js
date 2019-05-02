/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';

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

  render() {
    return (
      <div>
        <span id={`alertover-${this.props.id}`} style={{ width: 30 }}>
          <i className="fa fa-ellipsis-v" />
        </span>
        <Popover
          placement="bottom"
          isOpen={this.state.popoverOpen}
          target={`alertover-${this.props.id}`}
          toggle={this.toggle}
        >
          <PopoverBody>
            <span onClick="">Pin</span>
            <br />
            <span>Replicate Shipment</span>
          </PopoverBody>
        </Popover>
      </div>
    );
  }
}
