import { map } from 'rxjs/operators';
import { FETCH_FILES } from '../constants/constants';
import { GetShipmentFileList } from '../service/shipment/shipment';

// eslint-disable-next-line import/prefer-default-export
export const fetchFiles = (ShipmentKey, dispatch) => {
  if (dispatch !== undefined) {
    console.log('trigger Fetch');
    GetShipmentFileList(ShipmentKey).pipe(map(docs => docs.map(d => d.data()))).subscribe({
      next: (res) => {
        dispatch({
          type: FETCH_FILES,
          id: ShipmentKey,
          payload: res,
        });
      },
      error: (err) => {
        console.log(err);
        alert(err.message);
      },
      complete: () => { },
    });
  }
};
