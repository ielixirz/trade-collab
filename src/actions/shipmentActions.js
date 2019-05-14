import _ from 'lodash';
import {
  EDIT_SHIPMENT_REF,
  FETCH_SHIPMENT_LIST,
  FETCH_SHIPMENT_REF_LIST
} from '../constants/constants';
import {
  CombineShipmentAndShipmentReference,
  CreateShipmentReference,
  GetShipmentList
} from '../service/shipment/shipment';

let shipmentsObservable = GetShipmentList('', '', 'asc').subscribe();
export const fetchShipments = (typeStatus: any) => dispatch => {
  let shipments = [];
  shipmentsObservable.unsubscribe();
  shipmentsObservable = CombineShipmentAndShipmentReference(typeStatus, '', 'asc', 20).subscribe({
    next: res => {
      shipments = _.map(res, item => ({
        uid: item.id,
        ...item
      }));
      dispatch({
        type: FETCH_SHIPMENT_LIST,
        payload: shipments
      });
      let allrefs = [];
      _.forEach(shipments, item => {
        let refs = _.get(item, 'ShipmentReferenceList', []);
        let result = [];
        if (refs.length > 0) {
          _.forEach(refs, ref => {
            result[ref.id] = {
              ShipmentReferenceKey: ref.id,
              ...ref.data()
            };
          });
        }
        allrefs[item.ShipmentID] = result;
      });
      dispatch({
        type: FETCH_SHIPMENT_REF_LIST,
        payload: allrefs
      });
    },
    error: err => {
      console.log(err);
    },
    complete: () => {}
  });
};

export const editShipmentRef = (ShipmentKey, refKey, Data) => dispatch => {
  dispatch({
    type: EDIT_SHIPMENT_REF,
    id: ShipmentKey,
    refKey: refKey,
    payload: Data
  });
};

export const fetchMoreShipments = (typeStatus: any) => (dispatch, getState) => {
  let shipments = [];
  shipmentsObservable.unsubscribe();
  shipmentsObservable = CombineShipmentAndShipmentReference(
    typeStatus,
    '',
    'asc',
    getState().shipmentReducer.Shipments.length + 10
  ).subscribe({
    next: res => {
      shipments = _.map(res, item => ({
        uid: item.id,
        ...item
      }));
      dispatch({
        type: FETCH_SHIPMENT_LIST,
        payload: shipments
      });
      let allrefs = [];
      _.forEach(shipments, item => {
        let refs = _.get(item, 'ShipmentReferenceList', []);
        let result = [];
        if (refs.length > 0) {
          _.forEach(refs, ref => {
            result[ref.id] = {
              ShipmentReferenceKey: ref.id,
              ...ref.data()
            };
          });
        }
        allrefs[item.ShipmentID] = result;
      });
      dispatch({
        type: FETCH_SHIPMENT_REF_LIST,
        payload: allrefs
      });
    },
    error: err => {
      console.log(err);
    },
    complete: () => {}
  });
};
export const test = () => null;
