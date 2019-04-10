import { FirebaseApp } from '../firebase';
import { collection, doc } from 'rxfire/firestore';
import { from } from 'rxjs'

const ProfileRefPath = UserInfoKey => FirebaseApp.firestore().collection(`UserInfo`).doc(UserInfoKey).collection(`Profile`)

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

export const CreateProfile = (UserInfoKey,Data) => from(ProfileRefPath(UserInfoKey).add(Data))

export const GetProlfileList = UserInfoKey => collection(ProfileRefPath(UserInfoKey))

export const GetProfileDetail = (UserInfoKey,ProfileKey) => doc(ProfileRefPath(UserInfoKey).doc(ProfileKey))