import { collection, doc } from 'rxfire/firestore';
import { from, combineLatest } from 'rxjs';
import {
 take, map, switchMap, tap, concatMap,
} from 'rxjs/operators';

import { FirebaseApp } from '../firebase';

import { CreateUserCompany } from '../user/user';

const CompanyRefPath = () => FirebaseApp.firestore().collection('Company');

const CompanyMemberRefPath = CompanyKey => FirebaseApp.firestore()
    .collection('Company')
    .doc(CompanyKey)
    .collection('CompanyMember');

const CompanyUserAccessibilityRefPath = CompanyKey => FirebaseApp.firestore()
    .collection('Company')
    .doc(CompanyKey)
    .collection('CompanyUserAccessibility');

/* Example CreateCompany
    {
        CompanyName (string)
        CompanyID (string) *(ID is not a key)
        CompanyImageLink (string)
        CompanyTelNumber (string)
        CompanyAddress (string)
        CompanyWebsiteUrl (string)
        CompanyEmail (string)
        CompanyAboutUs (string)
    }
*/

export const CreateCompany = Data => from(CompanyRefPath().add(Data));

export const UpdateCompany = (CompanyKey, Data) => from(
    CompanyRefPath()
      .doc(CompanyKey)
      .set(Data, { merge: true }),
  );

export const GetCompanyDetail = CompanyKey => doc(CompanyRefPath().doc(CompanyKey));

export const CheckAvaliableCompanyName = CompanyName => collection(CompanyRefPath().where('CompanyName', '==', CompanyName)).pipe(take(1));

export const SetCompanyID = (CompanyKey, CompanyID) => from(
    CompanyRefPath()
      .doc(CompanyKey)
      .set({ CompanyID }, { merge: true }),
  );

export const SetCompanyImageLink = (CompanyKey, CompanyImageLink) => from(
    CompanyRefPath()
      .doc(CompanyKey)
      .set({ CompanyImageLink }, { merge: true }),
  );

// eslint-disable-next-line max-len
export const IsCompanyMember = (CompanyKey, UserKey) => doc(CompanyMemberRefPath(CompanyKey).doc(UserKey)).pipe(
    take(1),
    map(Result => !!Result.data()),
  );

// eslint-disable-next-line max-len
export const KeepIsCompanyMember = (CompanyKey, UserKey) => doc(CompanyMemberRefPath(CompanyKey).doc(UserKey)).pipe(map(Result => !!Result.data()));

export const GetCompanyMember = CompanyKey => collection(CompanyMemberRefPath(CompanyKey));

export const UpdateCompanyMember = (CompanyKey, UserInfoKey, Data) => from(
    CompanyMemberRefPath(CompanyKey)
      .doc(UserInfoKey)
      .update(Data),
  );

export const CreateCompanyMember = (CompanyKey, UserInfoKey, CompanyMemberData) => from(
    CompanyMemberRefPath(CompanyKey)
      .doc(UserInfoKey)
      .set(CompanyMemberData),
  );

export const CombineCreateCompanyWithCreateCompanyMember = (
  CompanyData,
  UserInfoKey,
  CompanyMemberData,
) => CreateCompany(CompanyData).pipe(
    map(CompanyDocData => CompanyDocData.id),
    concatMap(CompanyID => combineLatest(
        CreateCompanyMember(CompanyID, UserInfoKey, CompanyMemberData),
        CreateUserCompany(UserInfoKey, {
          UserCompanyReference: FirebaseApp.firestore()
            .collection('Company')
            .doc(CompanyID),
          UserCompanyTimestamp: new Date(),
        }),
      )),
  );

/* ex. CreateCompanyUserAccessibility
    {
      CompanyUserAccessibilityRoleName (string)
      CompanyUserAccessibilityRolePermissionCode (string)
    }
*/

// eslint-disable-next-line max-len
export const CreateCompanyUserAccessibility = (CompanyKey, Data) => from(CompanyUserAccessibilityRefPath(CompanyKey).add(Data));

// eslint-disable-next-line max-len
export const GetCompanyUserAccessibility = CompanyKey => collection(
    CompanyUserAccessibilityRefPath(CompanyKey).orderBy('CompanyUserAccessibilityIndex', 'asc'),
  );

// eslint-disable-next-line max-len
export const UpdateCompanyUserAccessibility = (CompanyKey, CompanyUserAccessibilityKey, Data) => from(
    CompanyUserAccessibilityRefPath(CompanyKey)
      .doc(CompanyUserAccessibilityKey)
      .set(Data, { merge: true }),
  );

export const DeleteCompanyUserAccessibility = (CompanyKey, CompanyUserAccessibilityKey) => from(
    CompanyUserAccessibilityRefPath(CompanyKey)
      .doc(CompanyUserAccessibilityKey)
      .delete(),
  );

export const RemoveFromCompany = (CompanyKey, UserKey) => CompanyMemberRefPath(CompanyKey)
    .doc(UserKey)
    .delete();

export const CompanyUserAccessibilityIsTargetRole = (
  CompanyKey,
  CompanyUserAccessibilityRoleName,
) => collection(
    CompanyMemberRefPath(CompanyKey).where(
      'UserMemberRoleName',
      '==',
      CompanyUserAccessibilityRoleName,
    ),
  ).pipe(
    take(1),
    map(CompanyUserAccessibilityDoc => CompanyUserAccessibilityDoc.length > 0),
  );

export const CompanyUserAccessibilityIsOnlyOneOwner = CompanyKey => collection(CompanyMemberRefPath(CompanyKey).where('UserMemberRoleName', '==', 'Owner')).pipe(
    take(1),
    map(CompanyUserAccessibilityDoc => CompanyUserAccessibilityDoc.length === 1),
  );
