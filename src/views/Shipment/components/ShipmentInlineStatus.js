/* eslint-disable react/prop-types */
/* eslint-disable filenames/match-regex */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import Select from 'react-select';
import { SHIPMENT_STATUS_UPDATE_OPTIONS } from '../../../constants/constants';

import './ShipmentInlineStatus.scss';

const ShipmentInlineStatus = ({ shipment, editShipmentHandler }) => {
  useEffect(() => {});

  const getBackgroundColor = (status) => {
    switch (status) {
      case 'Planning':
        return '#367fee';
      case 'Order Confirmed':
        return '#06cfa8';
      case 'In Transit':
        return '#f2af29';
      case 'Delivered':
        return '#37324d';
      case 'Cancelled':
        return '#9b9b9b';
      default:
        return '#37324d';
    }
  };

  const getValueMargin = (status) => {
    switch (status) {
      case 'Planning':
        return 11;
      case 'Order Confirmed':
        return 7;
      case 'In Transit':
        return 10;
      case 'Delivered':
        return 10;
      case 'Cancelled':
        return 9;
      default:
        return 10;
    }
  };

  return (
    <div>
      <Select
        value={_.find(
          SHIPMENT_STATUS_UPDATE_OPTIONS,
          option => option.value.status === shipment.ShipmentStatus,
        )}
        name="colors"
        id="shipment-status-select"
        className="basic-multi-select"
        classNamePrefix="select-shipment-status"
        styles={{
          control: styles => ({
            ...styles,
            fontSize: '0.8vw',
            backgroundColor: getBackgroundColor(shipment.ShipmentStatus),
          }),
          valueContainer: styles => ({
            ...styles,
            marginLeft: getValueMargin(shipment.ShipmentStatus),
          }),
        }}
        options={SHIPMENT_STATUS_UPDATE_OPTIONS}
        onChange={(option) => {
          editShipmentHandler(shipment.ShipmentID, {
            ShipmentStatus: option.value.status,
          });
        }}
      />
    </div>
  );
};

export default ShipmentInlineStatus;
