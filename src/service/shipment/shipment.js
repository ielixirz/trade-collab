import { collection, doc } from 'rxfire/firestore';
import { from, combineLatest, merge } from 'rxjs';
import {
  take, concatMap, map, tap, mergeMap, toArray,
} from 'rxjs/operators';
import { FirebaseApp } from '../firebase';

const ShipmentRefPath = () => FirebaseApp.firestore().collection('Shipment');

const OwnShipmentRefPath = ShipmentMemberUserKey => FirebaseApp.firestore()
  .collectionGroup('ShipmentMember')
  .where('ShipmentMemberUserKey', '==', ShipmentMemberUserKey);

const ShipmentFileRefPath = ShipmentKey => FirebaseApp.firestore()
  .collection('Shipment')
  .doc(ShipmentKey)
  .collection('ShipmentFile');

const ShipmentReferenceRefPath = ShipmentKey => FirebaseApp.firestore()
  .collection('Shipment')
  .doc(ShipmentKey)
  .collection('ShipmentReference');

const ShipmentMasterDataRefPath = ShipmentKey => FirebaseApp.firestore()
  .collection('Shipment')
  .doc(ShipmentKey)
  .collection('ShipmentShareData');

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

export const EditShipment = (ShipmentKey, Data) => from(
  ShipmentRefPath()
    .doc(ShipmentKey)
    .set(Data, { merge: true }),
);

export const GetShipmentList = (
  QueryStatus,
  QueryFieldName,
  QueryFieldDirection = 'asc',
  LimitNumber = 25,
  ShipmentMemberUserKey,
) => {
  const DefaultQuery = ShipmentRefPath()
    .where(`ShipmentMember.${ShipmentMemberUserKey}`, '>=', {})
    .orderBy('ShipmentCreateTimestamp', 'desc');

  if (QueryStatus && QueryFieldName) {
    return collection(
      DefaultQuery.orderBy(QueryFieldName, QueryFieldDirection)
        .where('ShipmentStatus', '==', QueryStatus)
        .limit(LimitNumber),
    );
  }
  if (QueryStatus) return collection(DefaultQuery.where('ShipmentStatus', '==', QueryStatus).limit(LimitNumber));
  // eslint-disable-next-line max-len
  if (QueryFieldName) return collection(DefaultQuery.orderBy(QueryFieldName, QueryFieldDirection).limit(LimitNumber));
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

// eslint-disable-next-line max-len
export const CreateShipmentFile = (ShipmentKey, Data) => from(ShipmentFileRefPath(ShipmentKey).add(Data));

export const DeleteShipmetFile = (ShipmentKey, ShipmentFileKey) => from(
  ShipmentFileRefPath(ShipmentKey)
    .doc(ShipmentFileKey)
    .delete(),
);

export const GetShipmentFileList = ShipmentKey => collection(ShipmentFileRefPath(ShipmentKey).orderBy('FileCreateTimestamp', 'desc'));

/* Example data CreateShipmentReference
{
  ShipmentReferenceID (string)
  ShipmentReferenceCompanyName (string)
  ShipmentReferenceCompanyKey (string)
}
*/

// eslint-disable-next-line max-len
export const CreateShipmentReference = (ShipmentKey, Data) => from(ShipmentReferenceRefPath(ShipmentKey).add(Data));

// eslint-disable-next-line max-len
export const GetShipmentReferenceList = ShipmentKey => collection(ShipmentReferenceRefPath(ShipmentKey));

export const UpdateShipmentReference = (ShipmentKey, ShipmentReferenceKey, Data) => from(
  ShipmentReferenceRefPath(ShipmentKey)
    .doc(ShipmentReferenceKey)
    .set(Data, { merge: true }),
);

// eslint-disable-next-line max-len
export const GetShipmentMasterDataDetail = (ShipmentKey, GroupType) => doc(ShipmentMasterDataRefPath(ShipmentKey).doc(GroupType)).pipe(take(1));

export const UpdateShipmetMasterDataDetail = (ShipmentKey, GroupType, Data) => from(
  ShipmentMasterDataRefPath(ShipmentKey)
    .doc(GroupType)
    .update(Data),
);

export const CombineShipmentAndShipmentReference = (
  QueryStatus,
  QueryFieldName,
  QueryFieldDirection = 'asc',
  LimitNumber = 25,
  ShipmentMemberUserKey,
) => {
  const ShipmentListSource = GetShipmentList(
    QueryStatus,
    QueryFieldName,
    QueryFieldDirection,
    LimitNumber,
    ShipmentMemberUserKey,
  );

  const ShipmentKeyListSource = ShipmentListSource.pipe(
    map(ShipmentList => ShipmentList.map(ShipmentItem => ShipmentItem.id)),
  );

  const ShipmentReferenceListSource = combineLatest(ShipmentKeyListSource.pipe(take(1))).pipe(
    concatMap(ShipmentKeyList => combineLatest(ShipmentKeyList)),
    concatMap(ShipmentKeyItem => ShipmentKeyItem),
    mergeMap(ShipmentKey => GetShipmentReferenceList(ShipmentKey).pipe(take(1))),
    toArray(),
  );

  return combineLatest(ShipmentListSource, ShipmentReferenceListSource).pipe(
    map(CombineResult => CombineResult[0].map((Item, Index) => {
      const ShipmentData = Item.data();
      const ShipmentID = Item.id;
      const ShipmentReferenceList = CombineResult[1][Index];

      return { ...ShipmentData, ShipmentID, ShipmentReferenceList };
    })),
  );
};

export const CreateShipmentMember = (ShipmentKey, ShipmentMemberUserKey, Data) => {
  const PayloadObject = {};

  PayloadObject[ShipmentMemberUserKey] = Data;

  return from(
    ShipmentRefPath()
      .doc(ShipmentKey)
      .set({ ShipmentMember: PayloadObject }, { merge: true }),
  );
};

// eslint-disable-next-line max-len
export const TestCollectionGroup = ShipmentMemberUserKey => collection(ShipmentRefPath().where(`ShipmentMember.${ShipmentMemberUserKey}`, '>=', {}));
