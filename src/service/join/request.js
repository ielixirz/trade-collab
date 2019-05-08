import { collection, doc } from 'rxfire/firestore';
import { from } from 'rxjs';
import { take } from 'rxjs/operators';

import { FirebaseApp } from '../firebase';

const CompanyRequestRefPath = CompanyKey => FirebaseApp.firestore()
  .collection('Company')
  .doc(CompanyKey)
  .collection('CompanyRequest');

const UserRequestRefPath = UserKey => FirebaseApp.firestore()
  .collection('UserInfo')
  .doc(UserKey)
  .collection('UserRequest');

/* CreateCompanyRequest
    {
        UserRequestReference (reference)
        UserRequestKey (reference)
        UserRequestUserKey (string)
        UserRequestCompanyKey (string)
        UserRequestFristname (string)
        UserRequestSurname (string)
        UserRequestEmail (string)
        UserRequestNote (string)
        UserRequestTimestamp (timestamp)
        UserRequestStatus (string) ('Reject','Approve','Pending')
    }
*/

export const CreateCompanyRequest = (CompanyKey, RequestKey, Data) => from(
  collection(
    CompanyRequestRefPath(CompanyKey)
      .doc(RequestKey)
      .set(Data),
  ),
);

/* CreateUserRequest
    {
        CompanyRequestReference (reference)
        CompanyRequestCompanyKey (string)
        CompanyRequestCompanyName (string)
        CompanyRequestNote (string)
        CompanyRequestTimestamp (timestamp)
        CompanyRequestStatus (string) ('Cancel','Pending')
    }
*/

// eslint-disable-next-line max-len
export const CreateUserRequest = (UserKey, Data) => from(collection(UserRequestRefPath(UserKey).add(Data)));

export const UpdateCompanyRequestStatus = (CompanyKey, RequestKey, Status) => from(
  collection(
    CompanyRequestRefPath(CompanyKey)
      .doc(RequestKey)
      .update({ UserRequestStatus: Status }),
  ),
);

export const UpdateUserRequestStatus = (UserKey, RequestKey, Status) => from(
  collection(
    UserRequestRefPath(UserKey)
      .doc(RequestKey)
      .update({ UserRequestStatus: Status }),
  ),
);

export const DeleteCompanyRequest = (CompanyKey, RequestKey) => from(
  collection(
    CompanyRequestRefPath(CompanyKey)
      .doc(RequestKey)
      .delete(),
  ),
);

export const DeleteUserRequest = (UserKey, RequestKey) => from(
  collection(
    CompanyRequestRefPath(UserKey)
      .doc(RequestKey)
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
