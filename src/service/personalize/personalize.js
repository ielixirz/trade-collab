import { collection, doc } from 'rxfire/firestore';
import { from, combineLatest } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

import firebase from 'firebase/app';
import { FirebaseApp } from '../firebase';

const UserPersonalizeRefPath = ProfileKey => FirebaseApp.firestore()
  .collection('UserPersonalize')
  .doc(ProfileKey);

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
