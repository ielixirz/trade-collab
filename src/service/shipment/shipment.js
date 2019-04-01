import { FirebaseApp } from '../firebase';
import { collection } from 'rxfire/firestore';
import { map } from 'rxjs/operators';

const ShipmentFileRefPath = (ShipmentKey) => {
    return FirebaseApp.firestore()
      .collection(`Shipment`)
      .doc(ShipmentKey)
      .collection(`ShipmentFile`);
  };

/* Example data CreateShipmentFile
  {
    FileName (string)
    FileUrl (string)
    FileCreateTimestamp (timestamp)
    FileOwnerKey (string)
    FileStorgeReference (reference)
  }
*/

export const CreateShipmentFile = (ShipmentKey, Data) => {
    return ShipmentFileRefPath(ShipmentKey).add(Data);
};

export const DeleteShipmetFile = (ShipmentKey,ShipmentFileKey) => {
    return ShipmentFileRefPath(ShipmentKey).doc(ShipmentFileKey).delete();
};