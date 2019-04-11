import { FETCH_SHIPMENT } from '../constants/constants';
import { GetShipmentList } from '../service/shipment/shipment';

export const fetchShipments = () => dispatch => {
  GetShipmentList('', '', 'asc').subscribe({
    next: res => {
      console.log(res);
    },
    error: err => {
      console.log(err);
    },
    complete: () => {}
  });
  dispatch();
};
export const test = () => null;
