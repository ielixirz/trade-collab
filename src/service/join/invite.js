import { collection, doc } from 'rxfire/firestore';
import {
  from, combineLatest, forkJoin, of, concat, merge,
} from 'rxjs';
import {
  take,
  switchMap,
  concatMap,
  map,
  tap,
  toArray,
  concatAll,
  combineAll,
} from 'rxjs/operators';
import _ from 'lodash';

import { FirebaseApp } from '../firebase';

import { GetUserInfoFromEmail } from '../user/user';
import { GetCompanyDetail } from '../company/company';

const CompanyInvitationRefPath = CompanyKey => FirebaseApp.firestore()
  .collection('Company')
  .doc(CompanyKey)
  .collection('CompanyInvitation');

const UserInvitationRefPath = UserKey => FirebaseApp.firestore()
  .collection('UserInfo')
  .doc(UserKey)
  .collection('UserInvitation');

/* CompanyInvitation
  {
    UserInvitationReference (reference)
    UserInvitationUserKey (string)
    UserInvitationCompanyKey (string)
    UserInvitationFristname (string)
    UserInvitationSurname (string)
    UserInvitationEmail (string)
    UserInvitationPosition (string)
    UserInvitationRole (string)
    UserInvitationTimestamp (timestamp)
    UserInvitationStatus (string) ('Cancel','Pending')
  }
*/

// eslint-disable-next-line max-len
export const CreateCompanyInvitation = (CompanyKey, Data) => from(CompanyInvitationRefPath(CompanyKey).add(Data));

/*  CreateUserInvitation
  {
    CompanyInvitationReference (reference)
    CompanyInvitationCompanyKey (string)
    CompanyInvitationName (string)
    CompanyInvitationEmail (string)
    CompanyInvitationPosition (string)
    CompanyInvitationRole (string)
    CompanyInvitationTimestamp (timestamp)
    CompanyInvitationStatus (string) ('Reject','Approve','Pending')
  }
*/

export const CreateUserInvitation = (UserKey, InvitationKey, Data) => from(
  UserInvitationRefPath(UserKey)
    .doc(InvitationKey)
    .set(Data),
);

export const UpdateCompanyInvitationStatus = (CompanyKey, InvitationKey, Status) => from(
  collection(
    CompanyInvitationRefPath(CompanyKey)
      .doc(InvitationKey)
      .update({ UserInvitationStatus: Status }),
  ),
);

export const UpdateUserInvitationStatus = (UserKey, InvitationKey, Status) => from(
  collection(
    UserInvitationRefPath(UserKey)
      .doc(InvitationKey)
      .update({ UserInvitationStatus: Status }),
  ),
);

export const DeleteCompanyInvitation = (CompanyKey, InvitationKey) => from(
  collection(
    CompanyInvitationRefPath(CompanyKey)
      .doc(InvitationKey)
      .delete(),
  ),
);

export const DeleteUserInvitation = (UserKey, InvitationKey) => from(
  collection(
    CompanyInvitationRefPath(UserKey)
      .doc(InvitationKey)
      .delete(),
  ),
);

export const CreateMultipleInvitation = (ColleaguesDataList, CompanyKey) => {
  const EmailList = ColleaguesDataList.map(ColleaguesItem => ColleaguesItem.Email);
  const RoleList = ColleaguesDataList.map(ColleaguesItem => ColleaguesItem.Role);
  const PositionList = ColleaguesDataList.map(ColleaguesItem => ColleaguesItem.Position);

  const EmailListSource = from(EmailList).pipe(
    tap(mail => mail),
    concatMap(Email => GetUserInfoFromEmail(Email).pipe(take(1))),
    // prettier-ignore
    map(UserInfoList => UserInfoList.map((UserInfoDoc) => {
      const Data = UserInfoDoc.data();
      const ID = UserInfoDoc.id;
      const Doc = { ...Data, id: ID };
      return Doc;
    })),
    map((UserInfoDocData, index) => ({
      UserInvitationReference: '',
      UserInvitationUserKey: UserInfoDocData[index].id,
      UserInvitationCompanyKey: CompanyKey,
      // UserInvitationFirstname: UserInfoDocData[index].UserInfoFirstname,
      // UserInvitationSurname: UserInfoDocData[index].UserInfoSurname,
      UserInvitationFirstname: '',
      UserInvitationSurname: '',
      UserInvitationEmail: UserInfoDocData[index].UserInfoEmail,
      UserInvitationPosition: ColleaguesDataList[index].Position,
      UserInvitationRole: ColleaguesDataList[index].Role,
      UserInvitationTimestamp: new Date(),
      UserInvitationStatus: 'Pending',
    })),
  );

  // const CompanySource = GetCompanyDetail(CompanyKey).pipe(
  //   map(CompanyDoc => CompanyDoc.data()),
  //   map(CompanyDocData => RoleList.map((RoleItem, Index) => {
  //     const payload = {
  //       CompanyInvitationReference: '',
  //       CompanyInvitationCompanyKey: CompanyKey,
  //       CompanyInvitationName: CompanyDocData.CompanyName,
  //       // CompanyInvitationEmail: CompanyDocData.CompanyEmail,
  //       CompanyInvitationEmail: '',
  //       CompanyInvitationPosition: PositionList[Index],
  //       CompanyInvitationRole: RoleItem,
  //       CompanyInvitationTimestamp: new Date(),
  //       CompanyInvitationStatus: 'Pending',
  //     };
  //     return payload;
  //   })),
  //   take(1),
  // );

  const CompanySource = Email => GetCompanyDetail(CompanyKey).pipe(
    map(CompanyDoc => CompanyDoc.data()),
    map((CompanyDocData) => {
      const PreloadData = _.find(ColleaguesDataList, { Email });
      const payload = {
        CompanyInvitationReference: '',
        CompanyInvitationCompanyKey: CompanyKey,
        CompanyInvitationName: CompanyDocData.CompanyName,
        // CompanyInvitationEmail: CompanyDocData.CompanyEmail,
        CompanyInvitationEmail: '',
        CompanyInvitationPosition: PreloadData.Position,
        CompanyInvitationRole: PreloadData.Role,
        CompanyInvitationTimestamp: new Date(),
        CompanyInvitationStatus: 'Pending',
      };

      return payload;
    }),
    take(1),
  );

  return EmailListSource.pipe(
    concatMap((UserInvitationPayload) => {
      console.log(UserInvitationPayload);
      return combineLatest(
        CreateCompanyInvitation(CompanyKey, UserInvitationPayload),
        CompanySource(UserInvitationPayload.UserInvitationEmail),
        of(UserInvitationPayload.UserInvitationUserKey),
      );
    }),
    concatMap(res => CreateUserInvitation(res[2], res[0].id, res[1])),
  );
  // return of(EmailListSource, CompanySource).pipe(concatAll());

  // return combineLatest(EmailListSource, CompanySource).pipe(
  //   map(r => r[0].map((item, index) => ({ UserInvitation: item, CompanyInvitation: r[1][index] }))),
  //   switchMap(indexing => indexing.map((item) => {
  //     const InvitationKey = CreateCompanyInvitation(CompanyKey, item.UserInvitation)
  //       .pipe(map(res => res.id))
  //       .subscribe();

  //     return InvitationKey;
  //   })),
  // );

  // return concat(EmailListSource, CompanySource).pipe(toArray());

  // const CombineSource = combineLatest(EmailListSource, CompanySource);

  // const UserKey = CombineSource.pipe(
  //   map(Combine => Combine[0].map(item => item.UserInvitationUserKey)),
  // );

  // const InviteKey = CombineSource.pipe(
  //   map(Combine => Combine[1]),
  //   // concatMap(CombineItem => combineLatest(CombineItem)),
  //   // tap(a => console.log(a)),
  //   concatMap(DataItem => DataItem),

  //   // switchMap(UserInvitationData => CreateCompanyInvitation(CompanyKey, UserInvitationData)),
  //   // map(Response => Response.id),
  // );

  // return InviteKey;

  // return forkJoin(UserKey, InviteKey).pipe(

  // );
};
