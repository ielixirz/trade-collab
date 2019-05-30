import { collection, doc } from 'rxfire/firestore';
import { from, combineLatest } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

import firebase from 'firebase/app';
import { FirebaseApp } from '../firebase';

const UserPersonalizeRefPath = ProfileKey => FirebaseApp.firestore()
  .collection('UserPersonalize')
  .doc(ProfileKey);

const UserPersonalizeChatRoomCountRefPath = (ProfileKey, ShipmentKey) => FirebaseApp.firestore()
  .collection('UserPersonalize')
  .doc(ProfileKey)
  .collection('ShipmentNotificationCount')
  .doc(ShipmentKey);

export const AddShipmentPin = (ProfileKey, ShipmentKey) => from(
  UserPersonalizeRefPath(ProfileKey).set(
    {
      ShipmentPin: firebase.firestore.FieldValue.arrayUnion(ShipmentKey),
    },
    { merge: true },
  ),
);

export const DeleteShipmentPin = (ProfileKey, ShipmentKey) => from(
  UserPersonalizeRefPath(ProfileKey).set(
    {
      ShipmentPin: firebase.firestore.FieldValue.arrayRemove(ShipmentKey),
    },
    { merge: true },
  ),
);

export const GetShipmentPin = ProfileKey => doc(UserPersonalizeRefPath(ProfileKey)).pipe(
  map(UserPersonalizeDoc => UserPersonalizeDoc.data().ShipmentPin),
);

export const ClearUnReadChatMessage = (ProfileKey, ShipmentKey, ChatRoomKey) => {
  const PayloadObject = { ChatRoomCount: {} };

  PayloadObject.ChatRoomCount[ChatRoomKey] = 0;

  return from(
    UserPersonalizeChatRoomCountRefPath(ProfileKey, ShipmentKey).set(PayloadObject, {
      merge: true,
    }),
  );
};
