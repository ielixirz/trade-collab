/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable filenames/match-regex */
import React from 'react';
import {
  Popover, PopoverBody, Input, Tooltip,
} from 'reactstrap';
import { EditShipment } from '../../service/shipment/shipment';
import { UpdateMasterData } from '../../service/masterdata/masterdata';

class NoteShipment extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false,
      value: this.props.item.ShipmentDetailPriceDescriptionOfGoods,
      isInEditMode: false,
      tooltipEditOpen: false,
    };
    this.tooltipEditToggle = this.tooltipEditToggle.bind(this);
  }

  changeEditMode = () => {
    this.setState({
      isInEditMode: !this.state.isInEditMode,
    });
  };

  edit = (shipmentKey, editValue) => {
    UpdateMasterData(shipmentKey, 'DefaultTemplate', {
      ShipmentDetailPriceDescriptionOfGoods: editValue,
    }).subscribe(() => {});
  };

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
  }

  renderEditView = () => (
    <React.Fragment>
      <div id="edit-desc-view">
        <Input
          type="textarea"
          style={{ width: '100%', height: 100 }}
          defaultValue={this.state.value}
          onChange={(event) => {
            this.setState({
              value: event.target.value,
            });
          }}
          onKeyDown={(button) => {
            if (button.key === 'Enter') {
              this.edit(this.props.item.uid, this.state.value);
              this.setState({ isInEditMode: false });
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </div>
      <Tooltip
        placement="right"
        isOpen={this.state.tooltipEditOpen}
        target="edit-desc-view"
        toggle={this.tooltipEditToggle}
      >
        Press Enter to edit.
      </Tooltip>
    </React.Fragment>
  );

  renderDefaultView = () => (this.state.value === '' || this.state.value === undefined ? (
    <div style={{ cursor: 'pointer' }} onDoubleClick={this.changeEditMode}>
      <i style={{ color: 'grey' }}>Double Click to edit the description...</i>
    </div>
  ) : (
    <div style={{ cursor: 'pointer' }} onDoubleClick={this.changeEditMode}>
      {this.state.value}
    </div>
  ));

  tooltipEditToggle() {
    this.setState({
      tooltipEditOpen: !this.state.tooltipEditOpen,
    });
  }

  render() {
    return (
      <span>
        <span id={`Popover-${this.props.id}`}>
          {this.props.item.seen ? (
            <i className="fa fa-tag fa-lg" />
          ) : (
            <i className="fa fa-tag fa-lg" style={{ opacity: 0.5 }} />
          )}
        </span>
        <Popover
          placement="bottom"
          isOpen={this.state.popoverOpen}
          target={`Popover-${this.props.id}`}
          toggle={this.toggle}
        >
          <PopoverBody>
            <p style={{ textDecorationLine: 'underline' }}>Price and Description of goods</p>
            {this.state.isInEditMode ? this.renderEditView() : this.renderDefaultView()}
            <br />
            <div className="seenby">
              {/* <span style={{ color: '#707070', fontSize: 9 }}>seen by A.B.C</span> */}
            </div>
          </PopoverBody>
        </Popover>
      </span>
    );
  }
}

export default NoteShipment;
