import { doc } from 'rxfire/firestore';
import { from, of, combineLatest } from 'rxjs';
import {
  take, map, concatMap, tap, switchMap, mergeMap, toArray, concatAll,
} from 'rxjs/operators';
import { FirebaseApp } from '../firebase';

import { GetShipmentMasterDataDetail } from '../shipment/shipment';
import { GetChatRoomPrivateMasterDataDetail } from '../chat/chat';

const MasterDataRefPath = () => FirebaseApp.firestore().collection('MasterShipmentData');

const ShipmentRefPath = () => FirebaseApp.firestore().collection('Shipment');

const ChatRoomRefPath = (ShipmentKey, ChatRoomKey) => FirebaseApp.firestore()
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

export const CreateMasterData = (GroupType, Data) => from(
  MasterDataRefPath()
    .doc(GroupType)
    .set(Data),
);

export const GetMasterDataDetail = GroupType => doc(MasterDataRefPath().doc(GroupType));

// eslint-disable-next-line max-len
export const GetCurrentMasterDataTitleList = ShipmentKey => doc(ShipmentRefPath().doc(ShipmentKey)).pipe(
  map(ShipmentData => ShipmentData.data().ShipmentShareList),
  take(1),
);

// eslint-disable-next-line max-len
export const GetMasterDataChatRoom = (ShipmentKey, ChatRoomKey) => {
  const ArrayOfObserable = doc(ChatRoomRefPath(ShipmentKey, ChatRoomKey)).pipe(
    map(ChatRoomData => ChatRoomData.data().ChatRoomShareDataList),
    take(1),
    // concatMap((collection) => {
    //   console.log(collection);
    //   const combined = combineLatest(...collection);
    //   console.log('Concat', combined);
    //   return combined;
    // }),
    // map((ChatRoomShareDataList) => {
    //   const ObserableArray = [];
    //   ChatRoomShareDataList.forEach((ShareDataItem) => {
    //     ObserableArray.push(GetShipmentMasterDataDetail(ShipmentKey, ShareDataItem));
    //   });
    //   return combineLatest(ObserableArray);
    // }),
    // tap(a => console.log(a)),
    // concatMap(ChatRoomShareDataList => ChatRoomShareDataList.map(ShareDataItem => GetShipmentMasterDataDetail(ShipmentKey, ShareDataItem))),
  );

  // const eiei = ArrayOfObserable.pipe(
  //   map(item => item.map(a => mergeMap(a => GetShipmentMasterDataDetail(ShipmentKey, a)))),
  // );

  // combineLatest(ArrayOfObserable).subscribe(console.log);
  // .pipe(
  //   mergeMap(ChatRoomShareDataItem => GetShipmentMasterDataDetail(ShipmentKey, ChatRoomShareDataItem).pipe(take(1))),
  //   toArray(),
  // );

  // Good
  // ArrayOfObserable.pipe(concatMap(ShareDataItem => ShareDataItem)).subscribe(console.log);

  return combineLatest(ArrayOfObserable).pipe(
    concatMap(col => combineLatest(col)),
    concatMap(ShareDataItem => ShareDataItem),
    mergeMap(ShareDataItem => GetShipmentMasterDataDetail(ShipmentKey, ShareDataItem)),
    toArray(),
  );
};

// eslint-disable-next-line max-len
export const GetPrivateMasterDataChatRoom = (ShipmentKey, ChatRoomKey) => doc(ChatRoomRefPath(ShipmentKey, ChatRoomKey)).pipe(
  map(ChatRoomData => ChatRoomData.data().ChatRoomPrivateShareDataList),
  // eslint-disable-next-line max-len
  concatMap(ChatRoomPrivateShareDataList => ChatRoomPrivateShareDataList.map(PrivateShareDataItem => GetChatRoomPrivateMasterDataDetail(ShipmentKey, ChatRoomKey, PrivateShareDataItem))),
);
