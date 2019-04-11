import { FETCH_SHIPMENT } from '../constants/constants';

const INITIAL_STATE = {
  Shipments: []
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SHIPMENT:
      return {
        ...state,
        Shipments: action.payload
      };
    default:
      return state;
  }
}
