import React from 'react';

const shipmentListContext = React.createContext({
  shipmentList: [{
    id: 1,
    status: 'in-transit',
    shipper: 'Fresh Product',
    consignee: 'Exotime',
    product: 'coconut',
    container: '001',
    bill: '002',
    track: '003',
    note: 'IP-MAN THE GRAND MASTER'
  }]
})

export default shipmentListContext;
