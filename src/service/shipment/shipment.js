import { collection, doc } from 'rxfire/firestore';
import { from } from 'rxjs';
import { FirebaseApp } from '../firebase';

const ShipmentRefPath = () => FirebaseApp.firestore().collection('Shipment');

const ShipmentFileRefPath = ShipmentKey => FirebaseApp.firestore()
  .collection('Shipment')
  .doc(ShipmentKey)
  .collection('ShipmentFile');

/* ex. CreateShipment
  {
      ShipmentReference (array<object>)
        [{ "RefOwner" : "Seller" , "RefID" : "Ref1234" , "RefTimestampUpdate" : "1234567673242"  }]
      ShipmentSellerCompanyName (string)
      ShipmentSourceLocation (string)
      ShipmentBuyerCompanyName (string)
      ShipmentDestinationLocation (string)
      ShipmentProductName (string)
      ShipmentETD (timestamp)
      ShipmentETAPort (timestamp)
      ShipmentETAWarehouse (timestamp)
      ShipmentStatus (string)
      ShipmentPriceDescription (string)
      ShipmentCreatorType (string) *Importer or Exporter
      ShipmentCreatorUserKey (string)
      ShipmentCreateTimestamp (timestamp)
  }
*/

export const CreateShipment = Data => from(ShipmentRefPath().add(Data));

export const EditShipment = (ShipmentKey, Data) => from(
  ShipmentRefPath().doc(ShipmentKey).set(Data, { merge: true }),
);

export const GetShipmentList = (QueryStatus, QueryFieldName, QueryFieldDirection = 'asc') => {
  const DefaultQuery = ShipmentRefPath().orderBy('ShipmentCreateTimestamp', 'desc');

  if (QueryStatus && QueryFieldName) return collection(DefaultQuery.orderBy(QueryFieldName, QueryFieldDirection).where('ShipmentStatus', '==', QueryStatus));
  if (QueryStatus) return collection(DefaultQuery.where('ShipmentStatus', '==', QueryStatus));
  if (QueryFieldName) return collection(DefaultQuery.orderBy(QueryFieldName, QueryFieldDirection));
  return DefaultQuery;
};

export const GetShipmentDetail = ShipmentKey => doc(ShipmentRefPath().doc(ShipmentKey));

/* Example data CreateShipmentFile
  {
    FileName (string)
    FileUrl (string)
    FileCreateTimestamp (timestamp)
    FileOwnerKey (string)
    FileStorgeReference (reference)
  }
*/

export const CreateShipmentFile = (ShipmentKey, Data) => from(
  ShipmentFileRefPath(ShipmentKey).add(Data),
);

export const DeleteShipmetFile = (ShipmentKey, ShipmentFileKey) => from(
  ShipmentFileRefPath(ShipmentKey).doc(ShipmentFileKey).delete(),
);

export const GetShipmentFileList = ShipmentKey => collection(ShipmentFileRefPath(ShipmentKey).orderBy('FileCreateTimestamp', 'desc'));
