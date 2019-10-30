import firebase from 'firebase/app';
import {
  collection, doc, collectionData, docData,
} from 'rxfire/firestore';
import {
  from, combineLatest, merge, forkJoin, of, throwError,
} from 'rxjs';
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

export const GetLastestShipment = (ShipmentMemberUserKey) => {
  const DefaultQuery = ShipmentRefPath()
    .where('ShipmentMemberList', 'array-contains', ShipmentMemberUserKey)
    .orderBy('ShipmentCreateTimestamp', 'desc');

  return collectionData(DefaultQuery.limit(1), 'ShipmentID');
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

export const UpdateShipmentMasterDataDetail = (ShipmentKey, GroupType, Data) => from(
  ShipmentMasterDataRefPath(ShipmentKey)
    .doc(GroupType)
    .set(Data, { merge: true }),
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

export const AddShipmentRoleNoRole = (ShipmentKey, Data) => from(
  ShipmentRoleRefPath(ShipmentKey)
    .doc('NoRole')
    .set({ ShipmentNoRole: firebase.firestore.FieldValue.arrayUnion(Data) }, { merge: true }),
);

export const DeleteShipmentRoleNoRole = (ShipmentKey, Data) => from(
  ShipmentRoleRefPath(ShipmentKey)
    .doc('NoRole')
    .set({ ShipmentNoRole: firebase.firestore.FieldValue.arrayRemove(Data) }, { merge: true }),
);

export const GetAllShipmentRole = ShipmentKey => collectionData(ShipmentRoleRefPath(ShipmentKey), 'ShipmentRole');

export const GetShipmentRoleDetail = (ShipmentKey, Role) => docData(ShipmentRoleRefPath(ShipmentKey).doc(Role), 'ShipmentRole').pipe(take(1));

// eslint-disable-next-line max-len
export const isAvailableRole = (ShipmentKey, Role) => GetShipmentRoleDetail(ShipmentKey, Role).pipe(map(Doc => !Doc.ShipmentRoleCompanyKey));

export const GetAvailableRole = ShipmentKey => GetAllShipmentRole(ShipmentKey).pipe(
  map(ShipmentRoleList => ({
    Exporter: !_.isEmpty(_.find(ShipmentRoleList, { ShipmentRole: 'Exporter' })),
    Importer: !_.isEmpty(_.find(ShipmentRoleList, { ShipmentRole: 'Importer' })),
    OutboundForwarder: !_.isEmpty(
      _.find(ShipmentRoleList, { ShipmentRole: 'OutboundForwarder' }),
    ),
    InboundForwarder: !_.isEmpty(
      _.find(ShipmentRoleList, { ShipmentRole: 'InboundForwarder' }),
    ),
    OutboundCustomBroker: !_.isEmpty(
      _.find(ShipmentRoleList, { ShipmentRole: 'OutboundCustomBroker' }),
    ),
    InboundCustomBroker: !_.isEmpty(
      _.find(ShipmentRoleList, { ShipmentRole: 'InboundCustomBroker' }),
    ),
  })),
);

// export const GetShipmentRoleByCompany = (ShipmentKey, CompanyKey) => collectionData(
//   ShipmentRoleRefPath(ShipmentKey).where('ShipmentRoleCompanyKey', '==', CompanyKey),
//   'ShipmentRole',
// ).pipe(map(ShipmentRoleList => ShipmentRoleList[0]));

// export const GetShipmentRoleByCompany = (ShipmentKey, CompanyKey) => collectionData(
//   ShipmentRoleRefPath(ShipmentKey).where('ShipmentRoleCompanyKey', '==', CompanyKey),
//   'ShipmentRole',
// ).pipe(map(ShipmentRoleList => ShipmentRoleList), map((ShipmentRoleArray) => {
//   if (_.find(ShipmentRoleArray, ['ShipmentRole', 'Importer'])) return 'Importer';
//   if (_.find(ShipmentRoleArray, ['ShipmentRole', 'Exporter'])) return 'Exporter';
//   if (_.find(ShipmentRoleArray, ['ShipmentRole', 'InboundForwarder'])) return 'InboundForwarder';
//   if (_.find(ShipmentRoleArray, ['ShipmentRole', 'OutboundForwarder'])) return 'OutboundForwarder';
//   if (_.find(ShipmentRoleArray, ['ShipmentRole', 'OutboundCustomBroker'])) return 'OutboundCustomBroker';
//   if (_.find(ShipmentRoleArray, ['ShipmentRole', 'InboundCustomBroker'])) return 'InboundCustomBroker';
// }));

export const GetShipmentRoleByCompany = (ShipmentKey, CompanyKey) => collectionData(
  ShipmentRoleRefPath(ShipmentKey).where('ShipmentRoleCompanyKey', '==', CompanyKey),
  'ShipmentRole',
).pipe(map(ShipmentRoleList => ShipmentRoleList.map(ShipmentRoleDoc => ShipmentRoleDoc.ShipmentRole)));

export const isCanSeeShipmentDetail = (ShipmentKey, CompanyKey) => GetShipmentRoleByCompany(
  ShipmentKey,
  CompanyKey,
).pipe(
  map(ShipmentRoleList => !!(_.findIndex(ShipmentRoleList, 'Importer') || _.findIndex(ShipmentRoleList, 'Exporter'))),
);

export const isAssignCompanyToShipment = (ShipmentKey, UserKey) => docData(ShipmentRefPath().doc(ShipmentKey), 'ShipmentKey').pipe(
  map(ShipmentDoc => !!ShipmentDoc.data().ShipmentMember[UserKey].ShipmentMemberCompanyKey),
);

export const CreateShipmentBySelectCompanyWithShipmentReferenceAndShipmentMasterData = (
  ShipmentData,
  ShipmentReferenceData,
  ShipmentMasterData,
) => from(ShipmentRefPath().add(ShipmentData)).pipe(
  map(ShipmentDocResult => ShipmentDocResult.id),
  switchMap(ShipmentId => forkJoin(
    of(ShipmentId).pipe(take(1)),
    CreateShipmentReference(ShipmentId, ShipmentReferenceData).pipe(take(1)),
    UpdateShipmentMasterDataDetail(ShipmentId, 'DefaultTemplate', ShipmentMasterData).pipe(
      take(1),
    ),
  )),
);

// export const InviteShipmentRole = (ShipmentKey, Role, CompanyKey, Data) => GetShipmentRoleByCompany(ShipmentKey, CompanyKey).pipe(
//   switchMap((ShipmentRole) => {
//     if (ShipmentRole === 'Importer') {
//       if (Role === 'Exporter' || Role === 'Importer' || Role === 'InboundForwarder' || Role === 'InboundCustomBroker') {
//         return isAvailableRole(ShipmentKey, Role).pipe(switchMap(RoleStatus => (RoleStatus ? AddShipmentRole(ShipmentKey, Role, Data) : of(null))));
//       }
//       return of('Not have permission');
//     }
//     if (ShipmentRole === 'Exporter') {
//       if (Role === 'Exporter' || Role === 'Importer' || Role === 'OutboundForwarder' || Role === 'OutboundCustomBroker') {
//         return isAvailableRole(ShipmentKey, Role).pipe(switchMap(RoleStatus => (RoleStatus ? AddShipmentRole(ShipmentKey, Role, Data) : of(null))));
//       }
//       return of('Not have permission');
//     }
//     if (ShipmentRole === 'OutboundForwarder') {
//       if (Role === 'Exporter' || Role === 'InboundForwarder' || Role === 'OutboundCustomBroker') {
//         return isAvailableRole(ShipmentKey, Role).pipe(switchMap(RoleStatus => (RoleStatus ? AddShipmentRole(ShipmentKey, Role, Data) : of(null))));
//       }
//       return of('Not have permission');
//     }
//     if (ShipmentRole === 'OutboundCustomBroker') {
//       if (Role === 'Exporter' || Role === 'OutboundCustomBroker') {
//         return isAvailableRole(ShipmentKey, Role).pipe(switchMap(RoleStatus => (RoleStatus ? AddShipmentRole(ShipmentKey, Role, Data) : of(null))));
//       }
//       return of('Not have permission');
//     }
//     if (ShipmentRole === 'InboundCustomBroker') {
//       if (Role === 'Importer' || Role === 'InboundCustomBroker') {
//         return isAvailableRole(ShipmentKey, Role).pipe(switchMap(RoleStatus => (RoleStatus ? AddShipmentRole(ShipmentKey, Role, Data) : of(null))));
//       }
//       return of('Not have permission');
//     }
//     if (ShipmentRole === 'InboundForwarder') {
//       if (Role === 'Importer' || Role === 'OutboundForwarder' || Role === 'InboundForwarder' || Role === 'InboundCustomBroker') {
//         return isAvailableRole(ShipmentKey, Role).pipe(switchMap(RoleStatus => (RoleStatus ? AddShipmentRole(ShipmentKey, Role, Data) : of(null))));
//       }
//       return of('Not have permission');
//     }
//     if (ShipmentRole === 'InboundForwarder') {
//       if (Role === 'Importer' || Role === 'OutboundForwarder' || Role === 'InboundForwarder' || Role === 'InboundCustomBroker') {
//         return isAvailableRole(ShipmentKey, Role).pipe(switchMap(RoleStatus => (RoleStatus ? AddShipmentRole(ShipmentKey, Role, Data) : of(null))));
//       }
//       return of('Not have permission');
//     }
//     return of('Company are not a member in the shipment');
//   }),
// );

// export const CheckAvailableThenRemoveRole = (ShipmentKey, Role) => isAvailableRole(ShipmentKey, Role)
//   .pipe(
//     switchMap(RoleStatus => (RoleStatus ? GetShipmentRoleDetail(ShipmentKey, Role).pipe(switchMap(RoleDetail => AddShipmentRoleNoRole(ShipmentKey, RoleDetail)), switchMap(DeleteShipmentRole(ShipmentKey, Role))) : of(null))),
//   );

export const CheckAvailableThenRemoveRole = (ShipmentKey, Role) => isAvailableRole(ShipmentKey, Role)
  .pipe(
    tap(RoleStatus => console.log(RoleStatus)),
    switchMap((RoleStatus) => {
      if (RoleStatus === true) {
        return throwError('Selected role is available');
      }
      if (RoleStatus === false) {
        return GetShipmentRoleDetail(ShipmentKey, Role).pipe(
          // tap(RoleDetail => console.log(RoleDetail)),
          switchMap(RoleDetail => (RoleDetail.ShipmentRoleCompanyName ? forkJoin(AddShipmentRoleNoRole(ShipmentKey, RoleDetail), DeleteShipmentRole(ShipmentKey, Role)) : throwError('Selected role is available'))),
        );
      }
    }),
  );

export const AssignShipmentRole = (ShipmentKey, Role, Data) => isAvailableRole(ShipmentKey, Role)
  .pipe(
    tap(RoleStatus => console.log(RoleStatus)),
    switchMap((RoleStatus) => {
      if (RoleStatus === true) {
        console.log('eiei');
        return forkJoin(DeleteShipmentRoleNoRole(ShipmentKey, Data), AddShipmentRole(ShipmentKey, Role, Data));
      }
      if (RoleStatus === false) {
        return throwError('Selected role not available');
      }
    }),
);

// export const RemoveShipmentRole = (ShipmentKey, Role, CompanyKey) => GetShipmentRoleByCompany(ShipmentKey, CompanyKey).pipe(
//   switchMap((ShipmentRole) => {
//     if (ShipmentRole === 'Importer') {
//       if (Role === 'Exporter' || Role === 'Importer' || Role === 'InboundForwarder' || Role === 'InboundCustomBroker') {
//         return CheckAvailableThenRemoveRole(ShipmentKey, Role);
//       }
//       return of('Not have permission');
//     }
//     if (ShipmentRole === 'Exporter') {
//       if (Role === 'Exporter' || Role === 'Importer' || Role === 'OutboundForwarder' || Role === 'OutboundCustomBroker') {
//         return CheckAvailableThenRemoveRole(ShipmentKey, Role);
//       }
//       return of('Not have permission');
//     }
//     if (ShipmentRole === 'OutboundForwarder') {
//       if (Role === 'OutboundForwarder' || Role === 'InboundForwarder' || Role === 'OutboundCustomBroker') {
//         return CheckAvailableThenRemoveRole(ShipmentKey, Role);
//       }
//       return of('Not have permission');
//     }
//     if (ShipmentRole === 'OutboundCustomBroker') {
//       if (Role === 'OutboundCustomBroker') {
//         return CheckAvailableThenRemoveRole(ShipmentKey, Role);
//       }
//       return of('Not have permission');
//     }
//     if (ShipmentRole === 'InboundCustomBroker') {
//       if (Role === 'InboundCustomBroker') {
//         return CheckAvailableThenRemoveRole(ShipmentKey, Role);
//       }
//       return of('Not have permission');
//     }
//     if (ShipmentRole === 'InboundForwarder') {
//       if (Role === 'OutboundForwarder' || Role === 'InboundForwarder' || Role === 'InboundCustomBroker') {
//         return CheckAvailableThenRemoveRole(ShipmentKey, Role);
//       }
//       return of('Not have permission');
//     }
//     return of('Company are not a member in the shipment');
//   }),
// );

export const RemoveShipmentRole = (ShipmentKey, Role, CompanyKey) => GetShipmentRoleByCompany(
  ShipmentKey,
  CompanyKey,
).pipe(
  switchMap((CompanyRoleList) => {
    if (Role === 'Importer') {
      if (_.includes(CompanyRoleList, 'Importer') || _.includes(CompanyRoleList, 'Exporter')) {
        return CheckAvailableThenRemoveRole(ShipmentKey, Role);
      }
    }
    if (Role === 'Exporter') {
      if (_.includes(CompanyRoleList, 'Importer') || _.includes(CompanyRoleList, 'Exporter')) {
        return CheckAvailableThenRemoveRole(ShipmentKey, Role);
      }
    }
    if (Role === 'InboundForwarder') {
      if (_.includes(CompanyRoleList, 'Importer') || _.includes(CompanyRoleList, 'OutboundForwarder') || _.includes(CompanyRoleList, 'InboundForwarder')) {
        return CheckAvailableThenRemoveRole(ShipmentKey, Role);
      }
    }
    if (Role === 'OutboundForwarder') {
      if (_.includes(CompanyRoleList, 'Exporter') || _.includes(CompanyRoleList, 'InboundForwarder') || _.includes(CompanyRoleList, 'OutboundForwarder')) {
        return CheckAvailableThenRemoveRole(ShipmentKey, Role);
      }
    }
    if (Role === 'InboundCustomBroker') {
      if (_.includes(CompanyRoleList, 'Importer') || _.includes(CompanyRoleList, 'InboundForwarder') || _.includes(CompanyRoleList, 'InboundCustomBroker')) {
        return CheckAvailableThenRemoveRole(ShipmentKey, Role);
      }
    }
    if (Role === 'OutboundCustomBroker') {
      if (_.includes(CompanyRoleList, 'Exporter') || _.includes(CompanyRoleList, 'OutboundForwarder') || _.includes(CompanyRoleList, 'OutboundCustomBroker')) {
        return CheckAvailableThenRemoveRole(ShipmentKey, Role);
      }
    }
  }),
);

export const PermissionRemoveList = (ShipmentKey, CompanyKey) => GetShipmentRoleByCompany(
  ShipmentKey,
  CompanyKey,
).pipe(map(
  (CompanyRoleList) => {
    let PermissionList = [];
    console.log(`CompanyRoleList : ${CompanyRoleList}`);
    if (_.includes(CompanyRoleList, 'Importer')) {
      PermissionList = _.union(PermissionList, ['Importer', 'Exporter']);
    }
    if (_.includes(CompanyRoleList, 'Exporter')) {
      PermissionList = _.union(PermissionList, ['Importer', 'Exporter']);
    }
    if (_.includes(CompanyRoleList, 'InboundForwarder')) {
      PermissionList = _.union(PermissionList, ['Importer', 'OutboundForwarder', 'InboundForwarder']);
    }
    if (_.includes(CompanyRoleList, 'OutboundForwarder')) {
      PermissionList = _.union(PermissionList, ['Exporter', 'InboundForwarder', 'OutboundForwarder']);
    }
    if (_.includes(CompanyRoleList, 'InboundCustomBroker')) {
      PermissionList = _.union(PermissionList, ['InboundCustomBroker']);
    }
    if (_.includes(CompanyRoleList, 'OutboundCustomBroker')) {
      PermissionList = _.union(PermissionList, ['OutboundCustomBroker']);
    }
    return PermissionList;
  },
));
