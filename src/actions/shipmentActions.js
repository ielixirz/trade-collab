import _ from 'lodash';
import { FETCH_SHIPMENT_LIST } from '../constants/constants';
import { GetShipmentList } from '../service/shipment/shipment';

let shipmentsObservable = GetShipmentList('', '', 'asc').subscribe();
export const fetchShipments = (typeStatus: any) => (dispatch) => {
  let shipments = [];
  shipmentsObservable.unsubscribe();
  shipmentsObservable = GetShipmentList(typeStatus, '', 'asc').subscribe({
    next: (res) => {
      shipments = _.map(res, item => ({
        uid: item.id,
        ...item.data(),
      }));
      dispatch({
        type: FETCH_SHIPMENT_LIST,
        payload: shipments,
      });
      console.log(shipments);
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => {},
  });
};
export const test = () => null;
