import { collection, doc } from 'rxfire/firestore';
import { from, combineLatest } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

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

const UserRequestPendingRefPath = UserKey => FirebaseApp.firestore()
  .collection('UserInfo')
  .doc(UserKey)
  .collection('UserRequest')
  .where('CompanyRequestStatus', '==', 'Pending');

const UserRequestRejectRefPath = UserKey => FirebaseApp.firestore()
  .collection('UserInfo')
  .doc(UserKey)
  .collection('UserRequest')
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

export const UpdateCompanyRequestStatus = (
  CompanyKey,
  RequestKey,
  Status,
  RoleName,
  RolePermissionCode,
  Position,
) => from(
  collection(
    CompanyRequestRefPath(CompanyKey)
      .doc(RequestKey)
      .set(
        {
          UserRequestStatus: Status,
          UserRequestRoleName: RoleName,
          UserRequestRolePermissionCode: RolePermissionCode,
          UserRequestPosition: Position,
        },
        { merge: true },
      ),
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

export const GetUserRequest = (UserKey) => {
  const UserRequestPending = collection(UserRequestPendingRefPath(UserKey));
  const UserRequestReject = collection(UserRequestRejectRefPath(UserKey));

  return combineLatest(UserRequestPending, UserRequestReject).pipe(
    map(UserRequestList => UserRequestList.map(Listitem => Listitem.map(item => item.data()))),
    map(UserRequestArray => [...UserRequestArray[0], ...UserRequestArray[1]]),
  );
};
export const IsExistRequest = (UserKey, CompanyKey) => {
  const CompanyRequestStatusPendingSource = collection(
    CompanyRequestRefPath(CompanyKey)
      .where('UserRequestUserKey', '==', UserKey)
      .where('UserRequestStatus', '==', 'Pending'),
  ).pipe(take(1));

  const CompanyRequestStatusRejectSource = collection(
    CompanyRequestRefPath(CompanyKey)
      .where('UserRequestUserKey', '==', UserKey)
      .where('UserRequestStatus', '==', 'Reject'),
  ).pipe(take(1));

  return combineLatest(CompanyRequestStatusPendingSource, CompanyRequestStatusRejectSource).pipe(
    map(Result => Result[0].length > 0 || Result[1].length > 0),
  );
};
