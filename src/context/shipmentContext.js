/* eslint-disable filenames/match-regex */
import React from 'react';

const ShipmentContext = React.createContext({
  shipmentList: [
    {
      id: 1,
      status: 'in-transit',
      shipper: 'Fresh Product',
      consignee: 'Exotime',
      product: 'coconut',
      container: 'cxru09329',
      bill: 'slkm23824890',
      track: 'DHL:8925486',
      note: 'IP-MAN THE GRAND MASTER',
    },
  ],
});

export default ShipmentContext;
