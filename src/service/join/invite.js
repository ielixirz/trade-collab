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
import { GetProlfileList } from '../user/profile';
import { GetCompanyDetail } from '../company/company';
import { AddChatRoomMember } from '../chat/chat';

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

export const CreateCompanyMultipleInvitation = (ColleaguesDataList, CompanyKey) => {
  const EmailList = ColleaguesDataList.map(ColleaguesItem => ColleaguesItem.Email);

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
    concatMap((Doc, index) => combineLatest(Doc, GetProlfileList(Doc[index].id).pipe(take(1)))),
    tap(a => console.log(a)),
    map((UserInfoDocData, index) => ({
      UserInvitationReference: '',
      UserInvitationUserKey: UserInfoDocData[0].id,
      UserInvitationCompanyKey: CompanyKey,
      UserInvitationFirstname: UserInfoDocData[1][0].data().ProfileFirstname,
      UserInvitationSurname: UserInfoDocData[1][0].data().ProfileSurname,
      UserInvitationEmail: UserInfoDocData[0].UserInfoEmail,
      UserInvitationPosition: ColleaguesDataList[index].Position,
      UserInvitationRole: ColleaguesDataList[index].Role,
      UserInvitationTimestamp: new Date(),
      UserInvitationStatus: 'Pending',
    })),
  );

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
};

export const GetCompanyInvitation = CompanyKey => collection(CompanyInvitationRefPath(CompanyKey));

export const GetUserInvitation = UserKey => collection(UserInvitationRefPath(UserKey));

// const ChatMemberDataList = [
//   {
//     Email: 'holy-wisdom@hotmail.com',
//     Role: 'Importer',
//   },
//   {
//     Email: 'importerMock@mi.com',
//     Role: 'Exporter',
//   },
// ];
export const CreateChatMultipleInvitation = (ChatInviteDataList, ShipmentKey, ChatRoomKey) => {
  const EmailList = ChatInviteDataList.map(ChatInviteItem => ChatInviteItem.Email);

  const EmailListSource = from(EmailList).pipe(
    tap(a => console.log(a)),
    concatMap(Email => GetUserInfoFromEmail(Email).pipe(take(1))),
    map((UserInfoList) => {
      const Data = UserInfoList[0].data();
      const ID = UserInfoList[0].id;
      const Doc = { ...Data, id: ID };
      const PreloadData = _.find(ChatInviteDataList, { Email: Data.UserInfoEmail });

      const PayloadData = {
        ChatRoomMemberUserKey: Doc.id,
        ChatRoomMemberEmail: Doc.UserInfoEmail,
        ChatRoomMemberRole: PreloadData.Role,
      };
      return PayloadData;
    }),
    concatMap(PayloadData => AddChatRoomMember(ShipmentKey, ChatRoomKey, PayloadData)),
  );

  return EmailListSource;
};
