import { FirebaseApp } from '../firebase'
import { collection } from 'rxfire/firestore';

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
            .then(res => {
                return res.id
            }).catch(err => {
                console.log(`error message : ${err}`)
                return err
            })
}

export const GetChatMessage = (ShipmentKey,ChatRoomKey) => {
    return collection(ChatRoomMessageRefPathOrderByNewerTimestamp(ShipmentKey,ChatRoomKey))
}






