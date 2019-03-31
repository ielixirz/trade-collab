import { FirebaseApp } from '../firebase';
import { collection } from 'rxfire/firestore';
import { map } from 'rxjs/operators';

const ShipmentRefPath = ShipmentKey => {
  return FirebaseApp.firestore()
    .collection(`Shipment`)
    .doc(ShipmentKey)
    .collection(`ChatRoom`);
};

const ChatRoomRefPath = (ShipmentKey, ChatRoomKey) => {
  return FirebaseApp.firestore()
    .collection(`Shipment`)
    .doc(ShipmentKey)
    .collection(`ChatRoom`)
    .doc(ChatRoomKey);
};

const ChatRoomMessageRefPath = (ShipmentKey, ChatRoomKey) => {
  return FirebaseApp.firestore()
    .collection(`Shipment`)
    .doc(ShipmentKey)
    .collection(`ChatRoom`)
    .doc(ChatRoomKey)
    .collection(`ChatRoomMessage`);
};

const ChatRoomMessageRefPathOrderByNewerTimestamp = (
  ShipmentKey,
  ChatRoomKey
) => {
  return ChatRoomMessageRefPath(ShipmentKey, ChatRoomKey).orderBy(
    'ChatRoomMessageTimestamp',
    'asc'
  );
};

// Example Data CreateChatMessage

/*
{
    ChatRoomMessageSender : ProfileKey,
    ChatRoomMessageContext : "หวัดดีครับ",
    ChatRoomMessageType : "Text",
    ChatRoomMessageTimestamp : new Date()
}
*/

export const CreateChatMessage = (ShipmentKey, ChatRoomKey, Data) => {
  return ChatRoomMessageRefPath(ShipmentKey, ChatRoomKey).add(Data);
};

export const GetChatMessage = (ShipmentKey, ChatRoomKey) => {
  return collection(
    ChatRoomMessageRefPathOrderByNewerTimestamp(ShipmentKey, ChatRoomKey)
  ).pipe(map(docs => docs.map(d => d.data())));
};

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

export const CreateChatRoom = (ShipmentKey, Data) => {
  return ShipmentRefPath(ShipmentKey).add(Data);
};

export const EditChatRoom = (ShipmentKey, ChatRoomKey, Data) => {
  return ChatRoomRefPath(ShipmentKey, ChatRoomKey).update(Data);
};
