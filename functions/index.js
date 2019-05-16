const _ = require('lodash');

const firebase = require('firebase');

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
        .doc(newValue.CompanyInvitationCompanyKey)
        .collection('CompanyMember')
        .doc(context.params.UserKey)
        .set({
          UserMemberEmail: newValue.CompanyInvitationUserEmail,
          UserMemberPosition: newValue.CompanyInvitationPosition,
          UserMemberRoleName: newValue.CompanyInvitationRole,
          UserMatrixRolePermissionCode: newValue.CompanyInvitationRole,
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

    if (oldValue.UserRequestStatus !== 'Approve' && newValue.UserRequestStatus === 'Approve') {
      const UserCompany = admin
        .firestore()
        .collection('UserInfo')
        .doc(newValue.UserRequestUserKey)
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
        .doc(context.params.CompanyKey)
        .collection('CompanyMember')
        .doc(newValue.UserRequestUserKey)
        .set({
          UserMemberEmail: newValue.UserRequestEmail,
          UserMemberPosition: newValue.UserRequestPosition,
          UserMemberRoleName: newValue.UserRequestRoleName,
          UserMatrixRolePermissionCode: newValue.UserRequestRolePermissionCode,
          UserMemberCompanyStandingStatus: 'Active',
          UserMemberJoinedTimestamp: new Date()
        });

      return Promise.all([UserCompany, CompanyMember]);
    }
  });

// exports.ReaderLastestMessage = functions.firestore
//   .document('Shipment/{ShipmentKey}/ChatRoom/{ChatRoomKey}/ChatRoomMessageReader/{ProfileKey}')
//   .onUpdate(async (change, context) => {
//     try {
//       const oldValue = change.before.data();
//       const newValue = change.after.data();

//       if (!oldValue) {
//         return "Don't have before data";
//       }

//       if (context.params.ProfileKey !== 'ChatRoomMessageKeyList') {
//         if (
//           oldValue.ChatRoomMessageReaderLastestMessageKey !==
//           newValue.ChatRoomMessageReaderLastestMessageKey
//         ) {
//           const GetChatRoomMessageKeyList = await change.after.ref.parent
//             .doc('ChatRoomMessageKeyList')
//             .get();

//           const ChatRoomMessageKeyList = GetChatRoomMessageKeyList.data().ChatRoomMessageKeyList;

//           const StartIndex = _.indexOf(
//             ChatRoomMessageKeyList,
//             oldValue.ChatRoomMessageReaderLastestMessageKey
//           );
//           const EndIndex = _.indexOf(
//             ChatRoomMessageKeyList,
//             newValue.ChatRoomMessageReaderLastestMessageKey
//           );

//           const ChatRoomMessageKeyListSlice = _.slice(
//             ChatRoomMessageKeyList,
//             StartIndex,
//             EndIndex + 1
//           );

//           const AddChatRoomMessageReaderServiceList = [];

//           ChatRoomMessageKeyListSlice.forEach(ChatRoomMessageKeyItem => {
//             const AddItem = admin
//               .firestore()
//               .doc(
//                 `Shipment/${context.params.ShipmentKey}/ChatRoom/${
//                   context.params.ChatRoomKey
//                 }/ChatRoomMessage/${ChatRoomMessageKeyItem}`
//               )
//               .set(
//                 {
//                   ChatRoomMessageReader: firebase.firestore.FieldValue.arrayUnion({
//                     ChatRoomMessageReaderProfileKey: change.after.id,
//                     ChatRoomMessageReaderFirstName: newValue.ChatRoomMessageReaderFirstName,
//                     ChatRoomMessageReaderSurName: newValue.ChatRoomMessageReaderSurName
//                   })
//                 },
//                 {
//                   merge: true
//                 }
//               );
//             AddChatRoomMessageReaderServiceList.push(AddItem);
//           });

//           return Promise.all(AddChatRoomMessageReaderServiceList);
//         }
//       }
//     } catch (error) {
//       return error;
//     }
//   });

exports.CreateChatRoomMessageKeyList = functions.firestore
  .document('Shipment/{ShipmentKey}/ChatRoom/{ChatRoomKey}/ChatRoomMessage/{ChatRoomMessageKey}')
  .onCreate((snapshot, context) => {
    try {
      const ChatRoomMessageKey = context.params.ChatRoomMessageKey;
      // console.log(context.params.ShipmentKey);
      // console.log(context.params.ChatRoomKey);
      // //console.log(snapshot.ref.parent.parent.path);
      return admin
        .firestore()
        .collection('Shipment')
        .doc(context.params.ShipmentKey)
        .collection('ChatRoom')
        .doc(context.params.ChatRoomKey)
        .collection('ChatRoomMessageReader')
        .doc('ChatRoomMessageKeyList')
        .set(
          {
            ChatRoomMessageKeyList: admin.firestore.FieldValue.arrayUnion(ChatRoomMessageKey)
          },
          {
            merge: true
          }
        );
    } catch (error) {
      return error;
    }
  });
