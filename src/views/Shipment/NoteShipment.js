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
          <PopoverHeader>
            <span style={{ textDecorationLine: 'underline' }}>Price and Description of goods</span>
          </PopoverHeader>
          <PopoverBody>
            {this.props.item}
            <br />
            <div className="seenby">
              <span style={{ color: '#707070', fontSize: 9 }}>seen by A.B.C</span>
            </div>
          </PopoverBody>
        </Popover>
      </span>
    );
  }
}
