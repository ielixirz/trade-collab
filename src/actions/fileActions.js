import { FETCH_FILES } from '../constants/constants';
import { GetShipmentFileList } from '../service/shipment/shipment';

export const fetchFiles = (ShipmentKey) => dispatch => {
    console.log('trigger Fetch');
    GetShipmentFileList(ShipmentKey).subscribe({
      next: res => {
        dispatch({
          type: FETCH_FILES,
          id: ShipmentKey,
          payload: res
        });
      },
      error: err => {
        console.log(err);
        alert(err.message);
      },
      complete: () => {}
    });
  };
