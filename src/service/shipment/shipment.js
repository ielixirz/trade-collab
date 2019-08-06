import {
  collection, doc, collectionData, docData,
} from 'rxfire/firestore';
import { from, combineLatest, merge } from 'rxjs';
import {
  take, concatMap, map, tap, mergeMap, toArray, switchMap, filter,
} from 'rxjs/operators';
import _ from 'lodash';
import { FirebaseApp } from '../firebase';

const ShipmentRefPath = () => FirebaseApp.firestore().collection('Shipment');

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

const ShipmentRoleRefPath = ShipmentKey => FirebaseApp.firestore()
  .collection('Shipment')
  .doc(ShipmentKey)
  .collection('ShipmentRole');

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
    .update(Data),
);

export const GetShipmentList = (
  QueryStatus,
  QueryFieldName,
  QueryFieldDirection = 'asc',
  LimitNumber = 25,
  ShipmentMemberUserKey,
) => {
  const DefaultQuery = ShipmentRefPath()
    .where('ShipmentMemberList', 'array-contains', ShipmentMemberUserKey)
    .orderBy('ShipmentCreateTimestamp', 'desc');

  if (QueryStatus && QueryFieldName) {
    return collectionData(
      DefaultQuery.orderBy(QueryFieldName, QueryFieldDirection)
        .where('ShipmentStatus', '==', QueryStatus)
        .limit(LimitNumber),
      'ShipmentID',
    );
  }
  if (QueryStatus) {
    return collectionData(
      DefaultQuery.where('ShipmentStatus', '==', QueryStatus).limit(LimitNumber),
      'ShipmentID',
    );
  }
  // eslint-disable-next-line max-len
  if (QueryFieldName) {
    return collectionData(
      DefaultQuery.orderBy(QueryFieldName, QueryFieldDirection).limit(LimitNumber),
      'ShipmentID',
    );
  }
  return collectionData(DefaultQuery.limit(LimitNumber), 'ShipmentID');
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
export const GetShipmentReferenceList = ShipmentKey => collectionData(ShipmentReferenceRefPath(ShipmentKey), 'ShipmentReferenceKey');

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

  return ShipmentListSource.pipe(
    switchMap(ShipmentList => combineLatest(
      ...ShipmentList.map(ShipmentDoc => GetShipmentReferenceList(ShipmentDoc.ShipmentID).pipe(
        map(ShipmentReferenceList => ({ ShipmentReferenceList, ...ShipmentDoc })),
      )),
    )),
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

export const SearchShipment = (
  ShipmentMemberUserKey,
  SearchText,
  SearchTitle,
  LimitNumber = 15,
) => {
  const DefaultQuery = ShipmentRefPath().where(
    'ShipmentMemberList',
    'array-contains',
    ShipmentMemberUserKey,
  );

  let ShipmentListSource = collectionData(
    DefaultQuery.where(SearchTitle, '>=', SearchText)
      .orderBy(SearchTitle, 'asc')
      .limit(LimitNumber),
    'ShipmentID',
  );

  if (SearchTitle === 'ShipmentReferenceList') {
    ShipmentListSource = collectionData(DefaultQuery, 'ShipmentID');
  }

  return ShipmentListSource.pipe(
    switchMap(ShipmentList => combineLatest(
      ...ShipmentList.map(ShipmentDoc => GetShipmentReferenceList(ShipmentDoc.ShipmentID).pipe(
        map(ShipmentReferenceList => ({ ShipmentReferenceList, ...ShipmentDoc })),
      )),
    )),
  );
};

// eslint-disable-next-line max-len
export const isShipmentMember = (ShipmentKey, UserKey) => doc(ShipmentRefPath().doc(ShipmentKey)).pipe(
  filter(DocData => !!DocData.data().ShipmentMemberList.find(Item => Item === UserKey)),
);

/* ex AddShipmentRole
  ShipmentRoleCompanyName (string)
  ShipmentRoleCompanyKey (string)
*/

export const AddShipmentRole = (ShipmentKey, Role, Data) => from(
  ShipmentRoleRefPath(ShipmentKey)
    .doc(Role)
    .set(Data),
);

export const DeleteShipmentRole = (ShipmentKey, Role) => from(
  ShipmentRoleRefPath(ShipmentKey)
    .doc(Role)
    .delete(),
);
