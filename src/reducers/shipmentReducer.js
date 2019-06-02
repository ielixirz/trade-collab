import {
  EDIT_SHIPMENT_REF,
  FETCH_SHIPMENT_LIST_DATA,
  FETCH_SHIPMENT_REF_LIST,
  NOTIFICATIONS,
  UPDATE_SHIPMENT_REF
} from '../constants/constants';

const INITIAL_STATE = {
  Shipments: [],
  ShipmentRefs: {},
  notification: {}
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SHIPMENT_LIST_DATA:
      return {
        ...state,
        Shipments: action.payload
      };
    case NOTIFICATIONS:
      return {
        ...state,
        notification: action.payload
      };
    case FETCH_SHIPMENT_REF_LIST:
      return {
        ...state,
        ShipmentRefs: action.payload
      };

    case UPDATE_SHIPMENT_REF:
      return {
        ...state,
        ShipmentRefs: {
          ...state.ShipmentRefs,
          [action.id]: action.payload
        }
      };
    case EDIT_SHIPMENT_REF:
      return {
        ...state,
        ShipmentRefs: {
          ...state.ShipmentRefs,
          [action.id]: {
            ...state.ShipmentRefs[action.id],
            [action.refKey]: action.payload
          }
        }
      };
    default:
      return state;
  }
}
