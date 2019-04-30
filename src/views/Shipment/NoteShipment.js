import React from 'react';
import {
  Button, Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';

export class NoteShipment extends React.Component {
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
      <span>
        <span id={`Popover-${this.props.id}`}>
          <i className="fa fa-tag fa-lg" />
        </span>
        <Popover
          placement="bottom"
          isOpen={this.state.popoverOpen}
          target={`Popover-${this.props.id}`}
          toggle={this.toggle}
        >
          <PopoverHeader>Price and Description of goods</PopoverHeader>
          <PopoverBody>{this.props.item}</PopoverBody>
        </Popover>
      </span>
    );
  }
}
