import { FETCH_SHIPMENT_LIST } from '../constants/constants';

const INITIAL_STATE = {
  Shipments: [],
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SHIPMENT_LIST:
      return {
        ...state,
        Shipments: action.payload,
      };
    default:
      return state;
  }
}
