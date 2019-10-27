/* eslint-disable max-len */
import {
  collection, doc, docData, collectionData,
} from 'rxfire/firestore';
import { from } from 'rxjs';
import {
  map, retry, take, filter,
} from 'rxjs/operators';
import { FirebaseApp } from '../firebase';

const ShipmentRefPath = ShipmentKey => FirebaseApp.firestore()
  .collection('Shipment')
  .doc(ShipmentKey)
  .collection('ChatRoom');

const ChatRoomRefPath = (ShipmentKey, ChatRoomKey) => FirebaseApp.firestore()
  .collection('Shipment')
  .doc(ShipmentKey)
  .collection('ChatRoom')
  .doc(ChatRoomKey);

const ChatRoomMessageRefPath = (ShipmentKey, ChatRoomKey) => FirebaseApp.firestore()
  .collection('Shipment')
  .doc(ShipmentKey)
  .collection('ChatRoom')
  .doc(ChatRoomKey)
  .collection('ChatRoomMessage');

const ChatRoomMessageRefPathOrderByNewerTimestamp = (ShipmentKey, ChatRoomKey) => ChatRoomMessageRefPath(ShipmentKey, ChatRoomKey).orderBy('ChatRoomMessageTimestamp', 'desc');

const ChatRoomPrivateShareDataRefPath = (ShipmentKey, ChatRoomKey) => FirebaseApp.firestore()
  .collection('Shipment')
  .doc(ShipmentKey)
  .collection('ChatRoom')
  .doc(ChatRoomKey)
  .collection('ChatRoomPrivateShareData');

const ChatRoomMemberRefPath = (ShipmentKey, ChatRoomKey) => FirebaseApp.firestore()
  .collection('Shipment')
  .doc(ShipmentKey)
  .collection('ChatRoom')
  .doc(ChatRoomKey)
  .collection('ChatRoomMember');

const ChatRoomMessageReaderRefPath = (ShipmentKey, ChatRoomKey, ProfileKey) => FirebaseApp.firestore()
  .collection('Shipment')
  .doc(ShipmentKey)
  .collection('ChatRoom')
  .doc(ChatRoomKey)
  .collection('ChatRoomMessageReader')
  .doc(ProfileKey);

// Example Data CreateChatMessage

/*
{
    ChatRoomMessageSender : ProfileKey,
    ChatRoomMessageContext : "หวัดดีครับ",
    ChatRoomMessageType : "Text",
    ChatRoomMessageTimestamp : new Date()
}
*/

export const CreateChatMessage = (ShipmentKey, ChatRoomKey, Data) => from(ChatRoomMessageRefPath(ShipmentKey, ChatRoomKey).add(Data));

export const GetChatMessage = (ShipmentKey, ChatRoomKey, LimitNumber = 25) => collection(
  ChatRoomMessageRefPathOrderByNewerTimestamp(ShipmentKey, ChatRoomKey).limit(LimitNumber),
).pipe(
  map(docs => docs.map(d => ({
    id: d.id,
    ...d.data(),
  }))),
);

// Example Data CreateChatRoom

/*
{
    ChatRoomName : "Exporter",
    ChatRoomFileLink :
        [ {FileName : "FileA.jpg" , FileUrl : "'https://firebasestorage.googleapis.com'" , FileCreateTimestamp : "123123124124124" , FilePath : "/Shipment/{ShipmentKey}/ShipmentFile/{FileKey}" }] ,
    ChatRoomMember : {},
    ChatRoomParticipleNotificationToken : [],
    ChatRoomhareDataList :
        ['Shipper','ShipmentDetail'],
    ChatRoomPrivateShareDataList :
        ['Trucking']
}
*/

export const CreateChatRoom = (ShipmentKey, Data) => from(ShipmentRefPath(ShipmentKey).add(Data));

export const EditChatRoom = (ShipmentKey, ChatRoomKey, Data) => from(ChatRoomRefPath(ShipmentKey, ChatRoomKey).update(Data));

/* Example Data AddChatRoomFileLink
  [ {FileName : "FileA.jpg" , FileUrl : "'https://firebasestorage.googleapis.com'" , FileCreateTimestamp : "123123124124124" , FilePath : "/Shipment/{ShipmentKey}/ShipmentFile/{FileKey}" }]
*/

export const EditChatRoomFileLink = (ShipmentKey, ChatRoomKey, Data) => from(ChatRoomRefPath(ShipmentKey, ChatRoomKey).set({ ChatRoomFileLink: Data }, { merge: true }));

export const GetChatRoomList = (ShipmentKey, UserKey) => collection(ShipmentRefPath(ShipmentKey).where('ChatRoomMemberList', 'array-contains', UserKey));

export const GetChatRoomDetail = (ShipmentKey, ChatRoomKey) => doc(ChatRoomRefPath(ShipmentKey, ChatRoomKey));

// eslint-disable-next-line max-len
export const GetChatRoomPrivateMasterDataDetail = (ShipmentKey, ChatRoomKey, GroupType) => doc(ChatRoomPrivateShareDataRefPath(ShipmentKey, ChatRoomKey).doc(GroupType)).pipe(take(1));

export const UpdateShipmentMasterDataDetail = (ShipmentKey, ChatRoomKey, GroupType, Data) => from(
  ChatRoomPrivateShareDataRefPath(ShipmentKey, ChatRoomKey)
    .doc(GroupType)
    .update(Data),
);

/* ex. AddChatRoomMember

{
  ChatRoomMemberUserKey (string)
  ChatRoomMemberName (string)
  ChatRoomMemberEmail (string)
  ChatRoomMemberName (string)
  ChatRoomMemberImageURL (string)
  ChatRoomMemberRole (string)
  ChatRoomMemberCompanyName (string)
  ChatRoomMemberCompanyKey (string)
}
*/

export const AddChatRoomMember = (ShipmentKey, ChatRoomKey, Data) => from(ChatRoomMemberRefPath(ShipmentKey, ChatRoomKey).add(Data));

export const UpdateChatRoomMember = (ShipmentKey, ChatRoomKey, ChatRoomMemberKey, Data) => from(
  ChatRoomMemberRefPath(ShipmentKey, ChatRoomKey)
    .doc(ChatRoomMemberKey)
    .set(Data, { merge: true }),
);

export const DeleteChatRoomMember = (ShipmentKey, ChatRoomKey, ChatRoomMemberKey) => from(
  ChatRoomMemberRefPath(ShipmentKey, ChatRoomKey)
    .doc(ChatRoomMemberKey)
    .delete(),
);

export const GetChatRoomMemberList = (ShipmentKey, ChatRoomKey) => collection(ChatRoomMemberRefPath(ShipmentKey, ChatRoomKey));

export const UpdateChatRoomMessageReader = (ShipmentKey, ChatRoomKey, ProfileKey, Data) => from(
  ChatRoomMessageReaderRefPath(ShipmentKey, ChatRoomKey, ProfileKey).set(Data, { merge: true }),
);

export const LeaveChatRoomMember = (ShipmentKey, ChatRoomKey, ChatRoomMemberKey) => from(
  ChatRoomMemberRefPath(ShipmentKey, ChatRoomKey)
    .doc(ChatRoomMemberKey)
    .set({ ChatRoomMemberIsLeave: true }, { merge: true }),
);

export const isChatRoomMember = (ShipmentKey, ChatRoomKey, UserKey) => collection(
  ChatRoomMemberRefPath(ShipmentKey, ChatRoomKey).where('ChatRoomMemberUserKey', '==', UserKey),
).pipe(filter(data => data.length > 0));

export const isInternalChatRoom = (ShipmentKey, ChatRoomKey) => docData(ChatRoomRefPath(ShipmentKey, ChatRoomKey), 'ChatRoomKey').pipe(
  map(ChatRoomDoc => ChatRoomDoc.data().ChatRoomIsInternal),
);

export const GetCompanyInternalChatRoom = (ShipmentKey, CompanyKey) => collectionData(
  ShipmentRefPath(ShipmentKey).where('ChatRoomCompanyKey', '==', CompanyKey),
  'ChatRoomKey',
).pipe(map(ChatRoomList => ChatRoomList[0]));
