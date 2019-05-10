import { collection, doc } from 'rxfire/firestore';
import { from, combineLatest } from 'rxjs';
import {
  concatMap, map, toArray, take, tap, mergeMap,
} from 'rxjs/operators';
import { FirebaseApp } from '../firebase';

import { GetUserInfoFromEmail } from './user';

const ProfileRefPath = UserInfoKey => FirebaseApp.firestore()
  .collection('UserInfo')
  .doc(UserInfoKey)
  .collection('Profile');

/*
 {
    ProfileFirstname (string)
    ProfileSurname (string)
    ProfileName (string) *(Note-Ask)
    ProfileEmail (string)
    ProfileProfileImageLink (string) *(Note-Ask)
    ProfileNotificationToken (Array<string>)
 }
*/

export const CreateProfile = (UserInfoKey, Data) => from(ProfileRefPath(UserInfoKey).add(Data));

export const GetProlfileList = UserInfoKey => collection(ProfileRefPath(UserInfoKey));

// eslint-disable-next-line max-len
export const GetProfileDetail = (UserInfoKey, ProfileKey) => doc(ProfileRefPath(UserInfoKey).doc(ProfileKey));

export const UpdateProfile = (UserInfoKey, ProfileKey, Data) => from(
  ProfileRefPath(UserInfoKey)
    .doc(ProfileKey)
    .set(Data, { merge: true }),
);

export const GetProfileListFromEmail = (UserInfoEmail) => {
  const UserInfoFromEmailSource = GetUserInfoFromEmail(UserInfoEmail).pipe(
    map(UserInfoList => UserInfoList.map(UserInfoItem => UserInfoItem.id)),
    take(1),
  );

  return combineLatest(UserInfoFromEmailSource).pipe(
    concatMap(col => combineLatest(col)),
    concatMap(ShareDataItem => ShareDataItem),
    mergeMap(ShareDataItem => GetProlfileList(ShareDataItem).pipe(take(1))),
    toArray(),
  );
};
