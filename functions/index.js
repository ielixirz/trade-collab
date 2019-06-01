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

exports.ReaderLastestMessage = functions.firestore
  .document('Shipment/{ShipmentKey}/ChatRoom/{ChatRoomKey}/ChatRoomMessageReader/{ProfileKey}')
  .onUpdate(async (change, context) => {
    try {
      const oldValue = change.before.data();
      const newValue = change.after.data();

      if (!oldValue) {
        return "Don't have before data";
      }

      if (context.params.ProfileKey !== 'ChatRoomMessageKeyList') {
        if (
          oldValue.ChatRoomMessageReaderLastestMessageKey !==
          newValue.ChatRoomMessageReaderLastestMessageKey
        ) {
          const GetChatRoomMessageKeyList = await change.after.ref.parent
            .doc('ChatRoomMessageKeyList')
            .get();

          const ChatRoomMessageKeyList = GetChatRoomMessageKeyList.data().ChatRoomMessageKeyList;

          const StartIndex = _.indexOf(
            ChatRoomMessageKeyList,
            oldValue.ChatRoomMessageReaderLastestMessageKey
          );
          const EndIndex = _.indexOf(
            ChatRoomMessageKeyList,
            newValue.ChatRoomMessageReaderLastestMessageKey
          );

          const ChatRoomMessageKeyListSlice = _.slice(
            ChatRoomMessageKeyList,
            StartIndex,
            EndIndex + 1
          );

          const AddChatRoomMessageReaderServiceList = [];

          ChatRoomMessageKeyListSlice.forEach(ChatRoomMessageKeyItem => {
            const AddItem = admin
              .firestore()
              .doc(
                `Shipment/${context.params.ShipmentKey}/ChatRoom/${
                  context.params.ChatRoomKey
                }/ChatRoomMessage/${ChatRoomMessageKeyItem}`
              )
              .set(
                {
                  ChatRoomMessageReader: admin.firestore.FieldValue.arrayUnion({
                    ChatRoomMessageReaderProfileKey: change.after.id,
                    ChatRoomMessageReaderFirstName: newValue.ChatRoomMessageReaderFirstName,
                    ChatRoomMessageReaderSurName: newValue.ChatRoomMessageReaderSurName
                  })
                },
                {
                  merge: true
                }
              );
            AddChatRoomMessageReaderServiceList.push(AddItem);
          });

          return Promise.all(AddChatRoomMessageReaderServiceList);
        }
      }
    } catch (error) {
      return error;
    }
  });

exports.CreateChatRoomMessageKeyList = functions.firestore
  .document('Shipment/{ShipmentKey}/ChatRoom/{ChatRoomKey}/ChatRoomMessage/{ChatRoomMessageKey}')
  .onCreate(async (snapshot, context) => {
    try {
      const ChatRoomMessageKey = context.params.ChatRoomMessageKey;
      await admin
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

      const GetChatRoomProfileList = await admin
        .firestore()
        .collection('Shipment')
        .doc(context.params.ShipmentKey)
        .collection('ChatRoom')
        .doc(context.params.ChatRoomKey)
        .collection('ChatRoomMessageReader')
        .get();

      const GetChatRoomMessageKeyList = await admin
        .firestore()
        .collection('Shipment')
        .doc(context.params.ShipmentKey)
        .collection('ChatRoom')
        .doc(context.params.ChatRoomKey)
        .collection('ChatRoomMessageReader')
        .doc('ChatRoomMessageKeyList')
        .get();

      // const ChatRoomMessageKeyList = GetChatRoomMessageKeyList.data().ChatRoomMessageKeyList;

      const ChatRoomProfileBatch = admin.firestore().batch();

      GetChatRoomProfileList.docs.map(async ProfileItem => {
        if (
          ProfileItem.id !== 'ChatRoomMessageKeyList' &&
          ProfileItem.id !== snapshot.data().ChatRoomMessageSenderKey
        ) {
          const CountPayload = {};

          // CountPayload[context.params.ChatRoomKey] = firebase.firestore.FieldValue.increment(1);

          _.set(
            CountPayload,
            `ChatRoomCount.${context.params.ChatRoomKey}`,
            admin.firestore.FieldValue.increment(1)
          );

          console.log(CountPayload);

          // CountPayload[context.params.ChatRoomKey] = 0;

          const SetCount = admin
            .firestore()
            .collection('UserPersonalize')
            .doc(ProfileItem.id)
            .collection('ShipmentNotificationCount')
            .doc(context.params.ShipmentKey);

          // const StartIndex = _.indexOf(
          //   ChatRoomMessageKeyList,
          //   ProfileItem.data().ChatRoomMessageReaderLastestMessageKey
          // );

          // const EndIndex = _.indexOf(
          //   ChatRoomMessageKeyList,
          //   ChatRoomMessageKeyList.slice(-1).pop()
          // );

          // const ChatRoomMessageKeyListSlice = _.slice(
          //   ChatRoomMessageKeyList,
          //   StartIndex,
          //   EndIndex + 1
          // );

          // const UnReadMessageCount = ChatRoomMessageKeyListSlice.length - 1;

          ChatRoomProfileBatch.set(SetCount, CountPayload, { merge: true });
        }
      });

      return ChatRoomProfileBatch.commit();
    } catch (error) {
      return error;
    }
  });

exports.OnCreateShipment = functions.firestore
  .document('Shipment/{ShipmentKey}')
  .onCreate(async (snapshot, context) => {
    try {
      // AutoCreateMasterDataDefaultTemplate

      const GetMasterDataDefaultTemplate = await admin
        .firestore()
        .collection('MasterData')
        .doc('DefaultTemplate')
        .get();

      const MasterDataDefaultTemplateData = GetMasterDataDefaultTemplate.data();

      const CreateShipmentShareData = await admin
        .firestore()
        .collection('Shipment')
        .doc(context.params.ShipmentKey)
        .collection('ShipmentShareData')
        .doc('DefaultTemplate')
        .set(MasterDataDefaultTemplateData);

      const AddShipmentShareList = await admin
        .firestore()
        .collection('Shipment')
        .doc(context.params.ShipmentKey)
        .set(
          {
            ShipmentShareList: admin.firestore.FieldValue.arrayUnion('DefaultTemplate')
          },
          {
            merge: true
          }
        );

      // End AutoCreateMasterDataDefaultTemplate

      // AutoAddOwnerShipmemtMemberWhenCreateShipment

      let PayloadObject = {};

      const ShipmentMemberUserKey = snapshot.data().ShipmentCreatorUserKey;
      const ShipmetMemberRole = snapshot.data().ShipmentCreatorType;

      const GetUserInfo = await admin
        .firestore()
        .collection('UserInfo')
        .doc(ShipmentMemberUserKey)
        .get();
      const UserEmail = GetUserInfo.data().UserInfoEmail;

      PayloadObject[ShipmentMemberUserKey] = {};

      PayloadObject[ShipmentMemberUserKey]['ShipmentMemberEmail'] = UserEmail;
      PayloadObject[ShipmentMemberUserKey]['ShipmentMemberRole'] = ShipmetMemberRole;

      const AddShipmentMember = await admin
        .firestore()
        .collection('Shipment')
        .doc(context.params.ShipmentKey)
        .set({ ShipmentMember: PayloadObject }, { merge: true });

      const AddShipmentMemberList = await admin
        .firestore()
        .collection('Shipment')
        .doc(context.params.ShipmentKey)
        .set(
          { ShipmentMemberList: admin.firestore.FieldValue.arrayUnion(ShipmentMemberUserKey) },
          { merge: true }
        );

      // End AutoAddOwnerShipmemtMemberWhenCreateShipment
      return Promise.all([
        CreateShipmentShareData,
        AddShipmentShareList,
        AddShipmentMember,
        AddShipmentMemberList
      ]);
    } catch (error) {
      return error;
    }
  });

exports.AddChatRoomShareDataList = functions.firestore
  .document('Shipment/{ShipmentKey}/ChatRoom/{ChatRoomKey}')
  .onCreate(async (snapshot, context) => {
    return admin
      .firestore()
      .collection('Shipment')
      .doc(context.params.ShipmentKey)
      .collection('ChatRoom')
      .doc(context.params.ChatRoomKey)
      .set(
        {
          ChatRoomShareDataList: admin.firestore.FieldValue.arrayUnion('DefaultTemplate')
        },
        { merge: true }
      );
  });

exports.ManageShipmentMember = functions.firestore
  .document('Shipment/{ShipmentKey}/ChatRoom/{ChatRoomKey}/ChatRoomMember/{ChatRoomMemberKey}')
  .onWrite(async (change, context) => {
    const oldValue = change.before.data();
    const newValue = change.after.data();

    const UserKey = newValue.ChatRoomMemberUserKey;

    const GetUserProfileList = await admin
      .firestore()
      .collection('UserInfo')
      .doc(UserKey)
      .collection('Profile')
      .get();

    const ProfileKeyList = GetUserProfileList.docs.map(ProfileItem => ProfileItem.id);

    // ChatRoomMemberList

    if (!oldValue && newValue) {
      await admin
        .firestore()
        .collection('Shipment')
        .doc(context.params.ShipmentKey)
        .collection('ChatRoom')
        .doc(context.params.ChatRoomKey)
        .set(
          { ChatRoomMemberList: admin.firestore.FieldValue.arrayUnion(UserKey) },
          { merge: true }
        );
    }

    const DeleteNotiCountServiceList = [];

    if (oldValue && !newValue) {
      // Delete ChatRoomMemberKey from ChatRoomMemberList
      await admin
        .firestore()
        .collection('Shipment')
        .doc(context.params.ShipmentKey)
        .collection('ChatRoom')
        .doc(context.params.ChatRoomKey)
        .set(
          { ChatRoomMemberList: admin.firestore.FieldValue.arrayRemove(UserKey) },
          { merge: true }
        );

      // Delete Noti-Count

      ProfileKeyList.forEach(async Item => {
        const DeletePayload = {};
        DeletePayload[context.params.ChatRoomKey] = admin.firestore.FieldValue.delete();

        const DeleteNotiCount = await admin
          .firestore()
          .collection('UserPersonalize')
          .doc(Item)
          .collection('ShipmentNotificationCount')
          .doc(context.params.ShipmentKey)
          .update(DeletePayload);

        DeleteNotiCountServiceList.push(DeleteNotiCount);
      });
    }

    // End ChatRoomMemberList

    // NotiCount First join shipment

    const UserPersonalizeProfileActionList = [];

    if (!oldValue && newValue) {
      ProfileKeyList.forEach(async Item => {
        const TriggerFirstJoin = admin
          .firestore()
          .collection('UserPersonalize')
          .doc(Item)
          .collection('ShipmentNotificationCount')
          .doc(context.params.ShipmentKey);

        const GetFirstJoin = await TriggerFirstJoin.get();
        let FirstJoinStatus = undefined;

        if (GetFirstJoin.data() !== undefined) {
          FirstJoinStatus = GetFirstJoin.data().ShipmentFristJoin;
        }

        console.log(FirstJoinStatus);

        if (!GetFirstJoin || FirstJoinStatus === undefined) {
          const SetFirstJoinAction = await TriggerFirstJoin.set(
            { ShipmentFristJoin: true },
            { merge: true }
          );
          UserPersonalizeProfileActionList.push(SetFirstJoinAction);
        }
      });
    }

    // End NotiCount First join shipment

    let PayloadObject = {};

    if (newValue) {
      const SnapshotDataObject = newValue;
      const ShipmentMemberUserKey = SnapshotDataObject['ChatRoomMemberUserKey'];

      PayloadObject[ShipmentMemberUserKey] = {};

      if (SnapshotDataObject['ChatRoomMemberEmail'])
        PayloadObject[ShipmentMemberUserKey]['ShipmentMemberEmail'] =
          SnapshotDataObject['ChatRoomMemberEmail'];

      if (SnapshotDataObject['ChatRoomMemberRole'])
        PayloadObject[ShipmentMemberUserKey]['ShipmentMemberRole'] =
          SnapshotDataObject['ChatRoomMemberRole'];

      if (SnapshotDataObject['ChatRoomMemberCompanyName'])
        PayloadObject[ShipmentMemberUserKey]['ShipmentMemberCompanyName'] =
          SnapshotDataObject['ChatRoomMemberCompanyName'];

      if (SnapshotDataObject['ChatRoomMemberCompanyKey'])
        PayloadObject[ShipmentMemberUserKey]['ShipmentMemberCompanyKey'] =
          SnapshotDataObject['ChatRoomMemberCompanyKey'];

      const AddShipmentMember = await admin
        .firestore()
        .collection('Shipment')
        .doc(context.params.ShipmentKey)
        .set({ ShipmentMember: PayloadObject }, { merge: true });

      const AddShipmentMemberList = await admin
        .firestore()
        .collection('Shipment')
        .doc(context.params.ShipmentKey)
        .set(
          { ShipmentMemberList: admin.firestore.FieldValue.arrayUnion(ShipmentMemberUserKey) },
          { merge: true }
        );

      return Promise.all([
        UserPersonalizeProfileActionList,
        AddShipmentMember,
        AddShipmentMemberList
      ]);
    } else if (oldValue && !newValue) {
      PayloadObject[oldValue['ChatRoomMemberUserKey']] = null;

      const SnapshotDataObject = oldValue;
      const ShipmentMemberUserKey = SnapshotDataObject['ChatRoomMemberUserKey'];

      const DeletePayload = {};

      DeletePayload[ShipmentMemberUserKey] = admin.firestore.FieldValue.delete();

      const DeleteShipmentMember = await admin
        .firestore()
        .collection('Shipment')
        .doc(context.params.ShipmentKey)
        .update(DeletePayload);

      const DeleteShipmentMemberList = await admin
        .firestore()
        .collection('Shipment')
        .doc(context.params.ShipmentKey)
        .update({
          ShipmentMemberList: admin.firestore.FieldValue.arrayRemove(ShipmentMemberUserKey)
        });

      return Promise.all([
        DeleteShipmentMember,
        DeleteShipmentMemberList,
        DeleteNotiCountServiceList
      ]);
    }
  });

exports.CreateDefaultTemplateCompanyUserAccessibility = functions.firestore
  .document('Company/{CompanyKey}')
  .onCreate(async (snapshot, context) => {
    const CompanyUserAccessibilityPayload = [
      {
        CompanyUserAccessibilityIndex: 1,
        CompanyUserAccessibilityRoleName: 'Owner',
        CompanyUserAccessibilityRolePermissionCode: '11111111111111'
      },
      {
        CompanyUserAccessibilityIndex: 5,
        CompanyUserAccessibilityRoleName: 'Basic',
        CompanyUserAccessibilityRolePermissionCode: '11000110100000'
      },
      {
        CompanyUserAccessibilityIndex: 2,
        CompanyUserAccessibilityRoleName: 'Executive',
        CompanyUserAccessibilityRolePermissionCode: '11111111111110'
      },
      {
        CompanyUserAccessibilityIndex: 4,
        CompanyUserAccessibilityRoleName: 'Staff',
        CompanyUserAccessibilityRolePermissionCode: '11101110110000'
      },
      {
        CompanyUserAccessibilityIndex: 3,
        CompanyUserAccessibilityRoleName: 'Senior',
        CompanyUserAccessibilityRolePermissionCode: '11111111111110'
      }
    ];

    const CompanyUserAccessibilityActionList = [];

    await CompanyUserAccessibilityPayload.forEach(Item => {
      const Action = admin
        .firestore()
        .collection('Company')
        .doc(context.params.CompanyKey)
        .collection('CompanyUserAccessibility')
        .add(Item);
      CompanyUserAccessibilityActionList.push(Action);
    });

    return Promise.all(CompanyUserAccessibilityActionList);
  });

exports.ShipmentAllCount = functions.firestore
  .document('UserPersonalize/{ProfileKey}/ShipmentNotificationCount/{ShipmentKey}')
  .onWrite(async (change, context) => {
    const oldValue = change.before.data();
    const newValue = change.after.data();

    if (newValue) {
      let SumShipmentAllCount = 0;
      let SunChatCount = 0;
      let ShipmentMasterDataCount = 0;
      let ShipmentFileCount = 0;

      if (newValue.ChatRoomCount) {
        for (var ChatRoomKey in newValue.ChatRoomCount) {
          SunChatCount += newValue.ChatRoomCount[ChatRoomKey];
        }
      }

      if (newValue.ShipmentMasterDataCount) {
        ShipmentMasterDataCount = newValue.ShipmentMasterDataCount;
      }

      if (newValue.ShipmentFileCount) {
        ShipmentFileCount = newValue.ShipmentFileCount;
      }

      SumShipmentAllCount = SunChatCount + ShipmentMasterDataCount + ShipmentFileCount;

      const Payload = {};

      Payload[context.params.ShipmentKey] = SumShipmentAllCount;

      return admin
        .firestore()
        .collection('UserPersonalize')
        .doc(context.params.ProfileKey)
        .set({ ShipmentTotalCount: Payload }, { merge: true });
    }
  });

exports.CopyMasterDataETAETD = functions.firestore
  .document('Shipment/{ShipmentKey}/ShipmentShareData/{ShipmentShareDataKey}')
  .onWrite(async (change, context) => {
    const oldValue = change.before.data();
    const newValue = change.after.data();

    if (newValue) {
      if (change.after.id === 'DefaultTemplate') {
        return admin
          .firestore()
          .collection('Shipment')
          .doc(context.params.ShipmentKey)
          .set(
            {
              ShipperETDDate: newValue.ShipperETDDate,
              ConsigneeETAPortDate: newValue.ConsigneeETAPortDate
            },
            { merge: true }
          );
      }
    }
  });
