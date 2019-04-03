import { FirebaseApp } from '../firebase';
import { collection } from 'rxfire/firestore';
import { from } from 'rxjs'
import { map } from 'rxjs/operators';

const ShipmentRefPath = () => {
  return FirebaseApp.firestore().collection(`Shipment`)
}

const ShipmentFileRefPath = (ShipmentKey) => {
    return FirebaseApp.firestore()
      .collection(`Shipment`)
      .doc(ShipmentKey)
      .collection(`ShipmentFile`);
  };

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

export const CreateShipment = (Data) => (from(ShipmentRefPath().add(Data)))

export const EditShipment = (ShipmentKey,Data) => (from(ShipmentRefPath().doc(ShipmentKey).set(Data,{merge:true})))


export const GetShipmentList = (QueryStatus) => {

  const DefaultQuery = collection(ShipmentRefPath().orderBy('ShipmentCreateTimestamp','asc'))
  
  return QueryStatus ? DefaultQuery.where('ShipmentStatus','==',QueryStatus) : DefaultQuery
}

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
    return from(ShipmentFileRefPath(ShipmentKey).add(Data));
};

export const DeleteShipmetFile = (ShipmentKey,ShipmentFileKey) => {
    return from(ShipmentFileRefPath(ShipmentKey).doc(ShipmentFileKey).delete());
};