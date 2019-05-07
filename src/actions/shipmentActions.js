import _ from 'lodash';
import { FETCH_SHIPMENT_LIST } from '../constants/constants';
import { CreateShipmentReference, GetShipmentList } from '../service/shipment/shipment';

let shipmentsObservable = GetShipmentList('', '', 'asc').subscribe();
export const fetchShipments = (typeStatus: any) => dispatch => {
  let shipments = [];
  shipmentsObservable.unsubscribe();
  shipmentsObservable = GetShipmentList(typeStatus, '', 'asc', 20).subscribe({
    next: res => {
      shipments = _.map(res, item => ({
        uid: item.id,
        ...item.data()
      }));
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

export const addShipmentReference = (ShipmentKey, Data) => dispatch => {
  const CreateShipmentReference = (ShipmentKey, Data).subscribe({
    complete: result => {
      console.log('add Ref Result is', result);
    }
  });

  CreateShipmentReference.unsubscribe();
};

export const fetchMoreShipments = (typeStatus: any) => (dispatch, getState) => {
  let shipments = [];
  shipmentsObservable.unsubscribe();
  shipmentsObservable = GetShipmentList(
    typeStatus,
    '',
    'asc',
    getState().shipmentReducer.Shipments.length + 10
  ).subscribe({
    next: res => {
      shipments = _.map(res, item => ({
        uid: item.id,
        ...item.data()
      }));
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
