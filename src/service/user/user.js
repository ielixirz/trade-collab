import { FirebaseApp } from '../firebase';
import { collection, doc } from 'rxfire/firestore';
import { from } from 'rxjs'

const UserInfoRefPath = () => FirebaseApp.firestore().collection(`UserInfo`)

const UpdateUserInfo = (UserInfoKey,Data) => UserInfoRefPath().doc(UserInfoKey).set(Data,{merge:true})

const GetUserInfoDetail = UserInfoKey => doc(UserInfoRefPath().doc(UserInfoKey))


  