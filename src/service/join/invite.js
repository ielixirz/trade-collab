import { collection, doc } from 'rxfire/firestore';
import { from } from 'rxjs';
import { take } from 'rxjs/operators';

import { FirebaseApp } from '../firebase';

const CompanyInvitationRefPath = CompanyKey => FirebaseApp.firestore()
  .collection('Company')
  .doc(CompanyKey)
  .collection('CompanyInvitation');

const UserInvitationRefPath = UserKey => FirebaseApp.firestore()
  .collection('User')
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
export const CreateCompanyInvitation = (CompanyKey, Data) => from(collection(CompanyInvitationRefPath(CompanyKey).add(Data)));

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

// eslint-disable-next-line max-len
export const CreateUserInvitation = (UserKey, Data) => from(collection(UserInvitationRefPath(UserKey).add(Data)));

export const UpdateCompanyInvitationStatus = (CompanyKey, InvitationKey, Status) => from(
  collection(
    CompanyInvitationRefPath(CompanyKey)
      .doc(InvitationKey)
      .update({ UserInvitationStatus: Status }),
  ),
);

export const UpdateUserInvitationStatus = (CompanyKey, InvitationKey, Status) => from(
  collection(
    UserInvitationRefPath(CompanyKey)
      .doc(InvitationKey)
      .update({ UserInvitationStatus: Status }),
  ),
);
