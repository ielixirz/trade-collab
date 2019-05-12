const from = require('rxjs');

const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require('./yterminal-b0906-firebase-adminsdk-65p2b-1b8bfd2c44.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://yterminal-b0906.firebaseio.com'
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.ApproveCompanyInvitation = functions.firestore
  .document('UserInfo/{UserKey}/UserInvitation/{InvitationKey}')
  .onUpdate((change, context) => {
    const oldValue = change.before.data();
    const newValue = change.after.data();

    if (
      oldValue.CompanyInvitationStatus !== 'Approve' &&
      newValue.CompanyInvitationStatus === 'Approve'
    ) {
      const UserCompany = admin
        .firestore()
        .collection('UserInfo')
        .doc(context.params.UserKey)
        .collection('UserCompany')
        .add({
          UserCompanyReference: admin
            .firestore()
            .collection('Company')
            .doc(newValue.CompanyInvitationCompanyKey),
          UserCompanyTimestamp: new Date()
        });

      const CompanyMember = admin
        .firestore()
        .collection('Company')
        .doc(context.params.UserKey)
        .collection('CompanyMember')
        .add({
          UserMemberEmail: CompanyInvitationEmail,
          UserMemberPosition: CompanyInvitationPosition,
          UserMemberRoleName: CompanyInvitationRole,
          UserMatrixRolePermissionCode: CompanyInvitationRole,
          UserMemberCompanyStandingStatus: 'Active',
          UserMemberJoinedTimestamp: new Date()
        });

      return Promise.all([UserCompany, CompanyMember]);
    }
  });

exports.ApproveUserRequest = functions.firestore
  .document('Company/{CompanyKey}/CompanyRequest/{RequestKey}')
  .onUpdate((change, context) => {
    const oldValue = change.before.data();
    const newValue = change.after.data();

    if (
      oldValue.UserInvitationStatus !== 'Approve' &&
      newValue.UserInvitationStatus === 'Approve'
    ) {
      const UserCompany = admin
        .firestore()
        .collection('UserInfo')
        .doc(context.params.UserKey)
        .collection('UserCompany')
        .add({
          UserCompanyReference: admin
            .firestore()
            .collection('Company')
            .doc(context.params.CompanyKey),
          UserCompanyTimestamp: new Date()
        });

      const CompanyMember = admin
        .firestore()
        .collection('Company')
        .doc(context.params.UserKey)
        .collection('CompanyMember')
        .add({
          UserMemberEmail: UserRequestEmail,
          UserMemberPosition: UserRequestPosition,
          UserMemberRoleName: UserRequestRoleName,
          UserMatrixRolePermissionCode: UserRequestRolePermissionCode,
          UserMemberCompanyStandingStatus: 'Active',
          UserMemberJoinedTimestamp: new Date()
        });

      return Promise.all([UserCompany, CompanyMember]);
    }
  });
