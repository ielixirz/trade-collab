import _ from 'lodash';
import { Observable } from 'rxjs';
import {
  EDIT_SHIPMENT_REF,
  FETCH_SHIPMENT_LIST_DATA,
  FETCH_SHIPMENT_REF_LIST,
  NOTIFICATIONS,
  UPDATE_SHIPMENT_REF
} from '../constants/constants';
import {
  CombineShipmentAndShipmentReference,
  CreateShipmentReference,
  GetShipmentList
} from '../service/shipment/shipment';
import { GetShipmentTotalCount } from '../service/personalize/personalize';

export const fetchShipments = (ShipmentData, notification) => (dispatch, getState) => {
  const {
    authReducer: {
      user: { uid }
    }
  } = getState();
  const { profileReducer } = getState();

  const sender = _.find(
    profileReducer.ProfileList,
    item => item.id === profileReducer.ProfileDetail.id
  );
  dispatch({
    type: NOTIFICATIONS,
    payload: notification
  });

  let shipments = {};
  _.forEach(ShipmentData, (item, refs) => {
    shipments[item.ShipmentID] = {
      uid: item.ShipmentID,
      ...item,
      ShipmentReferenceList: _.reduce(
        item.ShipmentReferenceList,
        (refs, item) => {
          console.log('ShipmentReferenceKey', item);
          refs[item.ShipmentReferenceKey] = {
            ...item
          };
          return refs;
        },
        {}
      ),
      ShipperETDDate: item.ShipperETDDate === undefined ? null : item.ShipperETDDate,
      ConsigneeETAPortDate:
        item.ConsigneeETAPortDate === undefined ? null : item.ConsigneeETAPortDate,
      ConsigneeETAWarehouseDate:
        item.ConsigneeETAWarehouseDate === undefined ? null : item.ConsigneeETAWarehouseDate
    };
  });

  dispatch({
    type: FETCH_SHIPMENT_LIST_DATA,
    payload: shipments
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

export const updateShipmentRef = (ShipmentKey, data) => dispatch => {
  dispatch({
    type: UPDATE_SHIPMENT_REF,
    id: ShipmentKey,
    payload: data
  });
};

export const fetchMoreShipments = (typeStatus: any) => (dispatch, getState) => {
  const {
    authReducer: {
      user: { uid }
    }
  } = getState();
  let shipments = {};
  CombineShipmentAndShipmentReference(
    typeStatus,
    '',
    'asc',
    getState().shipmentReducer.Shipments.length + 10,
    uid
  ).subscribe({
    next: res => {
      _.forEach(res, item => {
        shipments[item.ShipmentID] = {
          uid: item.ShipmentID,
          ...item,
          ShipmentReferenceList: _.reduce(
            item.ShipmentReferenceList,
            (refs, item) => {
              refs[item.id] = {
                id: item.id,
                ShipmentReferenceKey: item.id,
                ...item.data()
              };
              return refs;
            },
            {}
          ),
          ShipperETDDate: item.ShipperETDDate === undefined ? null : item.ShipperETDDate,
          ConsigneeETAPortDate:
            item.ConsigneeETAPortDate === undefined ? null : item.ConsigneeETAPortDate,
          ConsigneeETAWarehouseDate:
            item.ConsigneeETAWarehouseDate === undefined ? null : item.ConsigneeETAWarehouseDate
        };
      });
      dispatch({
        type: FETCH_SHIPMENT_LIST_DATA,
        payload: shipments
      });
    },
    error: err => {
      console.log(err);
    },
    complete: () => {}
  });
};
export const test = () => null;
