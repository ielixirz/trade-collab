import { collection, doc } from 'rxfire/firestore';
import { from } from 'rxjs';
import { take } from 'rxjs/operators';

import { FirebaseApp } from '../firebase';

const CompanyRequestRefPath = CompanyKey => FirebaseApp.firestore()
  .collection('Company')
  .doc(CompanyKey)
  .collection('CompanyRequest');

const UserRequestRefPath = UserKey => FirebaseApp.firestore()
  .collection('User')
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
        UserInvitationStatus (string) ('Reject','Approve','Pending')
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

export const CreateUserRequest = (UserKey, Data) => from(collection(UserRequestRefPath(UserKey).add(Data)));
