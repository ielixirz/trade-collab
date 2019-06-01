import { doc } from 'rxfire/firestore';
import { from, of, combineLatest } from 'rxjs';
import { take, map, concatMap, tap, switchMap, mergeMap, toArray, concatAll } from 'rxjs/operators';
import { FirebaseApp } from '../firebase';

import { GetShipmentMasterDataDetail } from '../shipment/shipment';
import { GetChatRoomPrivateMasterDataDetail } from '../chat/chat';

const MasterDataRefPath = () => FirebaseApp.firestore().collection('MasterShipmentData');

const ShipmentRefPath = () => FirebaseApp.firestore().collection('Shipment');

const ShipmentShareData = (ShipmentKey, GroupType) =>
  ShipmentRefPath()
    .doc(ShipmentKey)
    .collection('ShipmentShareData')
    .doc(GroupType);

const ChatRoomRefPath = (ShipmentKey, ChatRoomKey) =>
  FirebaseApp.firestore()
    .collection('Shipment')
    .doc(ShipmentKey)
    .collection('ChatRoom')
    .doc(ChatRoomKey);

/* ex. CreateMasterData
  {
    abstract data field name : abstract data initial value

    ex. abstract data

    ShipperCompanyName : ''
  }
*/

export const CreateMasterData = (GroupType, Data) =>
  from(
    MasterDataRefPath()
      .doc(GroupType)
      .set(Data)
  );

export const GetMasterDataDetail = GroupType => doc(MasterDataRefPath().doc(GroupType));

// eslint-disable-next-line max-len
export const GetCurrentMasterDataTitleList = ShipmentKey =>
  doc(ShipmentRefPath().doc(ShipmentKey)).pipe(
    map(ShipmentData => ShipmentData.data().ShipmentShareList),
    take(1)
  );

// eslint-disable-next-line max-len
export const GetMasterDataChatRoom = (ShipmentKey, ChatRoomKey) => {
  const ArrayOfObserable = doc(ChatRoomRefPath(ShipmentKey, ChatRoomKey)).pipe(
    map(ChatRoomData => ChatRoomData.data().ChatRoomShareDataList),
    take(1)
  );

  return combineLatest(ArrayOfObserable).pipe(
    concatMap(col => combineLatest(col)),
    concatMap(ShareDataItem => ShareDataItem),
    mergeMap(ShareDataItem => GetShipmentMasterDataDetail(ShipmentKey, ShareDataItem)),
    toArray()
  );
};

// eslint-disable-next-line max-len
export const GetPrivateMasterDataChatRoom = (ShipmentKey, ChatRoomKey) => {
  const ArrayOfObserable = doc(ChatRoomRefPath(ShipmentKey, ChatRoomKey)).pipe(
    map(ChatRoomData => ChatRoomData.data().ChatRoomPrivateShareDataList),
    take(1)
    // eslint-disable-next-line max-len
  );

  return combineLatest(ArrayOfObserable).pipe(
    concatMap(col => combineLatest(col)),
    concatMap(ShareDataItem => ShareDataItem),
    // eslint-disable-next-line max-len
    mergeMap(ShareDataItem =>
      GetChatRoomPrivateMasterDataDetail(ShipmentKey, ChatRoomKey, ShareDataItem)
    ),
    toArray()
  );
};

// eslint-disable-next-line max-len
export const UpdateMasterData = (ShipmentKey, GroupType, Data) =>
  from(ShipmentShareData(ShipmentKey, GroupType).set(Data, { merge: true }));
