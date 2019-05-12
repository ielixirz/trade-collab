import { collection, doc } from 'rxfire/firestore';
import { from } from 'rxjs';
import { take } from 'rxjs/operators';

import { FirebaseApp } from '../firebase';

const CompanyRequestRefPath = CompanyKey => FirebaseApp.firestore()
  .collection('Company')
  .doc(CompanyKey)
  .collection('CompanyRequest');

const CompanyRequestApproveRefPath = CompanyKey => FirebaseApp.firestore()
  .collection('Company')
  .doc(CompanyKey)
  .collection('CompanyRequest')
  .where('UserRequestStatus', '==', 'Pending');

const UserRequestRefPath = UserKey => FirebaseApp.firestore()
  .collection('UserInfo')
  .doc(UserKey)
  .collection('UserRequest');

const UserRequestApproveRefPath = UserKey => FirebaseApp.firestore()
  .collection('UserInfo')
  .doc(UserKey)
  .collection('UserRequest')
  .where('CompanyRequestStatus', '==', 'Pending')
  .where('CompanyRequestStatus', '==', 'Reject');

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
export const CreateUserRequest = (UserKey, Data) => from(UserRequestRefPath(UserKey).add(Data));

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
      .update({ UserRequestStatus: Status, CompanyRequestStatus: Status }),
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

export const GetCompanyRequest = CompanyKey => collection(CompanyRequestApproveRefPath(CompanyKey));

export const GetUserRequest = UserKey => collection(UserRequestApproveRefPath(UserKey));
