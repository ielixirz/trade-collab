import { collection, doc } from 'rxfire/firestore';
import { from, combineLatest } from 'rxjs';
import {
  map, concatMap, tap, mergeMap, toArray, take, concatAll,
} from 'rxjs/operators';

import { FirebaseApp } from '../firebase';

const UserInfoRefPath = () => FirebaseApp.firestore().collection('UserInfo');

const UserCompanyRefPath = UserInfoKey => FirebaseApp.firestore()
  .collection('UserInfo')
  .doc(UserInfoKey)
  .collection('UserCompany');

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

export const CreateUserInfo = (UserInfoKey, Data) => from(
  UserInfoRefPath()
    .doc(UserInfoKey)
    .set(Data),
);

export const UpdateUserInfo = (UserInfoKey, Data) => from(
  UserInfoRefPath()
    .doc(UserInfoKey)
    .set(Data, { merge: true }),
);

export const GetUserInfoDetail = UserInfoKey => doc(UserInfoRefPath().doc(UserInfoKey));

export const GetUserInfoFromEmail = Email => collection(UserInfoRefPath().where('UserInfoEmail', '==', Email));

export const GetUserInfoFromUsername = Username => collection(UserInfoRefPath().where('UserInfoUsername', '==', Username));

// eslint-disable-next-line max-len
export const GetUserInfoUsername = UserInfoKey => doc(UserInfoRefPath().doc(UserInfoKey)).pipe(map(User => User.UserInfoUsername));

// eslint-disable-next-line max-len
export const GetUserInfoUserInfoNotificationToken = UserInfoKey => doc(UserInfoRefPath().doc(UserInfoKey)).pipe(map(User => User.UserInfoNotificationToken));

export const GetUserCompany = (UserInfoKey) => {
  const UserCompany = collection(
    UserCompanyRefPath(UserInfoKey).orderBy('UserCompanyReference', 'desc'),
  ).pipe(
    map(UserCompanyList => UserCompanyList.map(UserCompanyItem => UserCompanyItem.data().UserCompanyReference)),
    take(1),
  );

  return combineLatest(UserCompany).pipe(
    concatMap(UserCompanyItem => combineLatest(UserCompanyItem)),
    concatMap(Item => Item),
    mergeMap(UserCompanyItem => doc(UserCompanyItem).pipe(take(1))),
    map(CompanyData => CompanyData.data()),
    toArray(),
  );
};
