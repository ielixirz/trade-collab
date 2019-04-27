import { collection, doc } from 'rxfire/firestore';
import { from } from 'rxjs';
import { FirebaseApp } from '../firebase';

const ShipmentRefPath = () => FirebaseApp.firestore().collection('Shipment');

const ShipmentFileRefPath = ShipmentKey =>
  FirebaseApp.firestore()
    .collection('Shipment')
    .doc(ShipmentKey)
    .collection('ShipmentFile');

const ShipmentReferenceRefPath = ShipmentKey => FirebaseApp.firestore()
  .collection('Shipment')
  .doc(ShipmentKey)
  .collection('ShipmentReference');

/* ex. CreateShipment
  {
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

export const EditShipment = (ShipmentKey, Data) =>
  from(
    ShipmentRefPath()
      .doc(ShipmentKey)
      .set(Data, { merge: true })
  );

export const GetShipmentList = (
  QueryStatus,
  QueryFieldName,
  QueryFieldDirection = 'asc',
  LimitNumber = 25
) => {
  const DefaultQuery = ShipmentRefPath().orderBy('ShipmentCreateTimestamp', 'desc');

  if (QueryStatus && QueryFieldName) {
    return collection(
      DefaultQuery.orderBy(QueryFieldName, QueryFieldDirection)
        .where('ShipmentStatus', '==', QueryStatus)
        .limit(LimitNumber)
    );
  }
  if (QueryStatus)
    return collection(DefaultQuery.where('ShipmentStatus', '==', QueryStatus).limit(LimitNumber));
  if (QueryFieldName)
    return collection(DefaultQuery.orderBy(QueryFieldName, QueryFieldDirection).limit(LimitNumber));
  return collection(DefaultQuery.limit(LimitNumber));
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

export const DeleteShipmetFile = (ShipmentKey, ShipmentFileKey) =>
  from(
    ShipmentFileRefPath(ShipmentKey)
      .doc(ShipmentFileKey)
      .delete()
  );

export const GetShipmentFileList = ShipmentKey => collection(ShipmentFileRefPath(ShipmentKey).orderBy('FileCreateTimestamp', 'desc'));

/* Example data CreateShipmentReference
{
  ShipmentReferenceID (string)
  ShipmentReferenceCompanyName (string)
  ShipmentReferenceCompanyKey (string)
}
*/

export const CreateShipmentReference = (ShipmentKey, Data) => from(
  ShipmentReferenceRefPath(ShipmentKey).add(Data),
);

export const GetShipmentReferenceList = ShipmentKey => collection(
  ShipmentReferenceRefPath(ShipmentKey),
);
