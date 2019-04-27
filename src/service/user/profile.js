import { collection, doc } from 'rxfire/firestore';
import { from } from 'rxjs';
import { FirebaseApp } from '../firebase';

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
