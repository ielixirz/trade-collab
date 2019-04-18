/* eslint-disable max-len */
import { collection, doc } from 'rxfire/firestore';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
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

const ChatRoomMessageRefPathOrderByNewerTimestamp = (ShipmentKey, ChatRoomKey) => ChatRoomMessageRefPath(ShipmentKey, ChatRoomKey).orderBy('ChatRoomMessageTimestamp', 'asc');

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

export const GetChatMessage = (ShipmentKey, ChatRoomKey) => collection(ChatRoomMessageRefPathOrderByNewerTimestamp(ShipmentKey, ChatRoomKey)).pipe(
  map(docs => docs.map(d => d.data())),
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

export const GetChatRoomList = ShipmentKey => collection(ShipmentRefPath(ShipmentKey));

export const GetChatRoomDetail = (ShipmentKey, ChatRoomKey) => doc(ChatRoomRefPath(ShipmentKey, ChatRoomKey));
