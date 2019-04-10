import { FirebaseApp } from '../firebase';
import { collection, doc } from 'rxfire/firestore';
import { from } from 'rxjs'
import { map } from 'rxjs/operators';

const UserInfoRefPath = () => FirebaseApp.firestore().collection(`UserInfo`)

/*
    {
        UserInfoUsername (string)
        UserInfoEmail (string)
        UserInfoBio (string)
        UserInfoProfileImageLink (string) *(Note-Ask)
        UserInfoCreateTimestamp (timestamp)
        UserInfoAccountType (string)
        UserInfoCompanyName (string)
        UserInfoCompanyRelate (string)
        UserInfoNotificationToken (Array<string>)
    }
*/

export const CreateUserInfo = (UserInfoKey, Data) => from(UserInfoRefPath().doc(UserInfoKey).set(Data))

export const UpdateUserInfo = (UserInfoKey, Data) => from(UserInfoRefPath().doc(UserInfoKey).set(Data,{merge:true}))

export const GetUserInfoDetail = UserInfoKey => doc(UserInfoRefPath().doc(UserInfoKey))

export const GetUserInfoFromEmail = Email => collection(UserInfoRefPath().where('UserInfoEmail','==',Email))

export const GetUserInfoFromUsername = Username => collection(UserInfoRefPath().where('UserInfoUsername','==',Username))

export const GetUserInfoUsername = UserInfoKey => doc(UserInfoRefPath().doc(UserInfoKey)).pipe(map(User => User.UserInfoUsername))

export const GetUserInfoUserInfoNotificationToken = UserInfoKey => doc(UserInfoRefPath().doc(UserInfoKey)).pipe(map(User => User.UserInfoNotificationToken))

  