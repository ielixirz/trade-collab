import { FirebaseApp } from '../firebase'
import { collection } from 'rxfire/firestore';
import { map } from 'rxjs/operators';

const ChatRoomRefPath = (ShipmentKey,ChatRoomKey) => {
    return FirebaseApp.firestore().collection(`Shipment`).doc(ShipmentKey).collection(`ChatRoom`).doc(ChatRoomKey)
}

const ChatRoomMessageRefPath = (ShipmentKey,ChatRoomKey) => {
    return FirebaseApp.firestore().collection(`Shipment`).doc(ShipmentKey).collection(`ChatRoom`).doc(ChatRoomKey).collection(`ChatRoomMessage`)
}

const ChatRoomMessageRefPathOrderByNewerTimestamp = (ShipmentKey,ChatRoomKey) => {
    return ChatRoomMessageRefPath(ShipmentKey,ChatRoomKey).orderBy("ChatRoomMessageTimestamp", "desc")
}

// Example Data CreateChatMessage

/*
{
    ChatRoomMessageSender : ProfileKey,
    ChatRoomMessageContext : "หวัดดีครับ",
    ChatRoomMessageType : "Text", 
    ChatRoomMessageTimestamp : new Date()
}
*/

export const CreateChatMessage = (ShipmentKey,ChatRoomKey,data) => {
    return ChatRoomMessageRefPath(ShipmentKey,ChatRoomKey).add(data)
}

export const GetChatMessage = (ShipmentKey,ChatRoomKey) => {
    return collection(ChatRoomMessageRefPathOrderByNewerTimestamp(ShipmentKey,ChatRoomKey)).pipe(map(docs => docs.map(d => d.data())))
}






