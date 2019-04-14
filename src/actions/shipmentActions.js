import { FETCH_SHIPMENT, FETCH_SHIPMENT_LIST } from '../constants/constants';
import { GetShipmentList } from '../service/shipment/shipment';
import _ from 'lodash';
export const fetchShipments = () => dispatch => {
  let shipments = [];
  GetShipmentList('', '', 'asc').subscribe({
    next: res => {
      shipments = _.map(res, item => {
        return {
          uid: item.id,
          ...item.data()
        };
      });
      dispatch({
        type: FETCH_SHIPMENT_LIST,
        payload: shipments
      });
      console.log(shipments);
    },
    error: err => {
      console.log(err);
    },
    complete: () => {}
  });
};
export const test = () => null;
