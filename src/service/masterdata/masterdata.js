import { doc } from 'rxfire/firestore';
import { from } from 'rxjs';
import { take, map, concatMap } from 'rxjs/operators';
import { FirebaseApp } from '../firebase';

import { GetShipmentMasterDataDetail } from '../shipment/shipment';

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
export const GetMasterDataChatRoom = (ShipmentKey, ChatRoomKey) => doc(ChatRoomRefPath(ShipmentKey, ChatRoomKey)).pipe(
  map(ChatRoomData => ChatRoomData.data().ChatRoomShareDataList),
  // eslint-disable-next-line max-len
  concatMap(ChatRoomShareDataList => ChatRoomShareDataList.map(ShareDataItem => GetShipmentMasterDataDetail(ShipmentKey, ShareDataItem))),
);
