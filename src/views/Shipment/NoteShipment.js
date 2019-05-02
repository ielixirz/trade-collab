import React from 'react';
import {
  Input, Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import { EditShipment } from '../../service/shipment/shipment';

export class NoteShipment extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false,
      value: this.props.item.ShipmentPriceDescription,
      isInEditMode: false,
    };
  }

  changeEditMode = () => {
    this.setState({
      isInEditMode: !this.state.isInEditMode,
    });
  };

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
  }

  renderEditView = () => (
    <div>
      <input
        type="text"
        defaultValue={this.state.value}
        ref="theTextInput"
        onChange={(e) => {
          this.setState({
            value: this.refs.theTextInput.value,
          });
        }}
        onKeyDown={(button) => {
          if (button.key === 'Enter') {
            EditShipment(this.props.item.uid, {
              ShipmentPriceDescription: this.state.value,
            });
            this.setState({ isInEditMode: false });
          }
        }}
      />
    </div>
  );

  renderDefaultView = () => <div onDoubleClick={this.changeEditMode}>{this.state.value}</div>;

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
            {/* <Input
              value={this.state.roomeditor.roomName}
              type="text"
              onKeyDown={(button) => {
                if (button.key === 'Enter') {
                  EditShipment(this.props.item.uid, {
                    ShipmentPriceDescription: value,
                  });
                }
              }}
            /> */}
            {this.state.isInEditMode ? this.renderEditView() : this.renderDefaultView()}
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
