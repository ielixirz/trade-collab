const _ = require('lodash');

const firebase = require('firebase');

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const sgMail = require('@sendgrid/mail');

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

      delete MasterDataDefaultTemplateData.ShipmentDetailProduct;

      console.log(MasterDataDefaultTemplateData);

      const CreateShipmentShareData = await admin
        .firestore()
        .collection('Shipment')
        .doc(context.params.ShipmentKey)
        .collection('ShipmentShareData')
        .doc('DefaultTemplate')
        .set(MasterDataDefaultTemplateData, {
          merge: true
        });

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

      // ChatRoomMemberUserKey (string)
      //                   ChatRoomMemberFirstName (string)
      //                   ChatRoomMemberSurName (string)
      //                   ChatRoomMemberEmail (string)
      //                   ChatRoomMemberImageUrl (string)
      //                   ChatRoomMemberRole (array <string>)
      //                   ChatRoomMemberCompanyName (string)
      //                   ChatRoomMemberCompanyKey (string)

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

      // AutoCreateChatRoom

      const AddChatRoom = await admin
        .firestore()
        .collection('Shipment')
        .doc(context.params.ShipmentKey)
        .collection('ChatRoom')
        .add({
          ChatRoomName: ShipmetMemberRole,
          ChatRoomType: ShipmetMemberRole,
          ChatRoomShareDataList: ['DefaultTemplate']
        });

      const ChatRoomID = AddChatRoom.id;

      const AddChatRoomMember = await admin
        .firestore()
        .collection('Shipment')
        .doc(context.params.ShipmentKey)
        .collection('ChatRoom')
        .doc(ChatRoomID)
        .collection('ChatRoomMember')
        .add({
          ChatRoomMemberUserKey: ShipmentMemberUserKey,
          ChatRoomMemberEmail: UserEmail,
          ChatRoomMemberRole: [ShipmetMemberRole]
        });

      return Promise.all([
        CreateShipmentShareData,
        AddShipmentShareList,
        AddShipmentMember,
        AddShipmentMemberList,
        AddChatRoom,
        AddChatRoomMember
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
          .doc(Item);

        const GetFirstJoin = await TriggerFirstJoin.get();
        let FirstJoinStatus = GetFirstJoin[context.params.ShipmentKey];

        const ProfileEmail = GetFirstJoin.data().ProfileEmail;

        // if (GetFirstJoin.data() !== undefined) {
        //   FirstJoinStatus = GetFirstJoin.data().ShipmentFristJoin;
        // }

        // console.log(FirstJoinStatus);

        const FirstJoinPayloadObject = { ShipmentFristJoin: {} };

        FirstJoinPayloadObject['ShipmentFristJoin'][context.params.ShipmentKey] = true;

        if (!GetFirstJoin || FirstJoinStatus === undefined) {
          const SetFirstJoinAction = await TriggerFirstJoin.set(FirstJoinPayloadObject, {
            merge: true
          });
          UserPersonalizeProfileActionList.push(SetFirstJoinAction);

          // Send Email InviteIntoShipment

          if (ProfileEmail) {
            await SendEmail(
              InviteIntoShipmentTemplate(
                ProfileEmail,
                `You have new invitation into shipment `,
                `<strong>You have new invitation into shipment</strong>`
              )
            );
          }

          // End Send Email InviteIntoShipment

          // Noti-SystemGen InviteIntoShipment

          // await admin
          //   .firestore()
          //   .collection('Shipment')
          //   .doc(context.params.ShipmentKey)
          //   .collection('ChatRoom')
          //   .doc(context.params.ChatRoomKey)
          //   .collection('ChatRoomMessage')
          //   .add({
          //     ChatRoomMessageContext: `${newValue.ChatRoomMemberFirstName} ${
          //       newValue.ChatRoomMemberSurName
          //     } (${ChatRoomMemberEmail}) joined`,
          //     ChatRoomMessageType: 'System',
          //     ChatRoomMessageTimestamp: admin.firestore.FieldValue.serverTimestamp
          //   });

          // End Noti-SystemGen InviteIntoShipment
        }
      }); // End forEach
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

      // Set Buyer Seller

      let SetCompanyName = [];

      if (newValue.ChatRoomMemberRole === 'Exporter' && newValue.ChatRoomMemberCompanyName) {
        const SetCompanyNameAtShipment = await admin
          .firestore()
          .collection('Shipment')
          .doc(context.params.ShipmentKey)
          .set(
            {
              ShipmentSellerCompanyName: newValue.ChatRoomMemberCompanyName
            },
            { merge: true }
          );
        const SetCompanyNameAtShipmentShareData = await admin
          .firestore()
          .collection('Shipment')
          .doc(context.params.ShipmentKey)
          .collection('ShipmentShareData')
          .doc('DefaultTemplate')
          .set(
            {
              ShipperCompanyName: newValue.ChatRoomMemberCompanyName
            },
            { merge: true }
          );

        SetCompanyName = [SetCompanyNameAtShipment, SetCompanyNameAtShipmentShareData];
      } else if (newValue.ChatRoomMemberRole === 'Importer' && newValue.ChatRoomMemberCompanyName) {
        const SetCompanyNameAtShipment = await admin
          .firestore()
          .collection('Shipment')
          .doc(context.params.ShipmentKey)
          .set(
            {
              ShipmentBuyerCompanyName: newValue.ChatRoomMemberCompanyName
            },
            { merge: true }
          );
        const SetCompanyNameAtShipmentShareData = await admin
          .firestore()
          .collection('Shipment')
          .doc(context.params.ShipmentKey)
          .collection('ShipmentShareData')
          .doc('DefaultTemplate')
          .set(
            {
              ConsigneeCompanyName: newValue.ChatRoomMemberCompanyName
            },
            { merge: true }
          );

        SetCompanyName = [SetCompanyNameAtShipment, SetCompanyNameAtShipmentShareData];
      }

      // End Set Buyer Seller

      return Promise.all([
        UserPersonalizeProfileActionList,
        AddShipmentMember,
        AddShipmentMemberList,
        SetCompanyName
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
        .set({ ShipmentTotalCount: Payload, ShipmentChatCount: SunChatCount }, { merge: true });
    }
  });

exports.CopyInsideMasterDataToShipment = functions.firestore
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
              ShipperPort: newValue.ShipperPort,
              ConsigneePort: newValue.ConsigneePort,
              ShipperETDDate: newValue.ShipperETDDate,
              ConsigneeETAPortDate: newValue.ConsigneeETAPortDate,
              ShipmentProductName: newValue.ShipmentDetailProduct
            },
            { merge: true }
          );
      }
    }

    // if (oldValue.ShipmentDetailProduct !== newValue.ShipmentDetailProduct) {
    //   if (change.after.id === 'DefaultTemplate') {
    //     return admin
    //       .firestore()
    //       .collection('Shipment')
    //       .doc(context.params.ShipmentKey)
    //       .set(
    //         {
    //           ShipmentDetailProduct: newValue.ShipmentDetailProduct
    //         },
    //         { merge: true }
    //       );
    //   }
    // }
  });

exports.NotiBellAndEmailInviteToJoinCompany = functions.firestore
  .document('UserInfo/{UserKey}/UserInvitation/{UserInvitationKey}')
  .onCreate(async (snapshot, context) => {
    const SendNotiBell = await admin
      .firestore()
      .collection('UserInfo')
      .doc(context.params.UserKey)
      .collection('UserNotification')
      .add({
        UserNotificationReadStatus: false,
        UserNotificationType: 'InviteToJoinCompany',
        UserNotificationTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        UserNotificationUserInfoKey: context.params.UserKey,
        UserNotificationCompanyName: snapshot.data().CompanyInvitationName,
        UserNotificationCompanyKey: snapshot.data().CompanyInvitationCompanyKey
      });

    const GetUserInfoEmail = await admin
      .firestore()
      .collection('UserInfo')
      .doc(context.params.UserKey)
      .get();

    const UserInfoEmail = GetUserInfoEmail.data().UserInfoEmail;

    const SendNotiEmail = await SendEmail(
      InviteToJoinCompanyTemplate(
        UserInfoEmail,
        `You have invitation from ${snapshot.data().CompanyInvitationName} company`,
        `<strong>You have invitation from ${snapshot.data().CompanyInvitationName} company</strong>`
      )
    );

    return Promise.all([SendNotiBell, SendNotiEmail]);
  });

exports.NotiBellRequestToJoinCompany = functions.firestore
  .document('Company/{CompanyKey}/CompanyRequest/{CompanyRequestKey}')
  .onCreate(async (snapshot, context) => {
    const GetCompanyMember = await admin
      .firestore()
      .collection('Company')
      .doc(context.params.CompanyKey)
      .collection('CompanyMember')
      .get();
    const CompanyMemberKeyList = GetCompanyMember.docs.map(
      CompanyMemberItem => CompanyMemberItem.id
    );

    const RequestToJoinServiceList = [];

    CompanyMemberKeyList.forEach(async Item => {
      const RequestToJoinAction = await admin
        .firestore()
        .collection('UserInfo')
        .doc(Item)
        .collection('UserNotification')
        .add({
          UserNotificationReadStatus: false,
          UserNotificationType: 'RequestToJoinCompany',
          UserNotificationTimestamp: admin.firestore.FieldValue.serverTimestamp(),
          UserNotificationUserInfoKey: snapshot.data().UserRequestUserKey,
          UserNotificationFirstname: snapshot.data().UserRequestFristname,
          UserNotificationSurname: snapshot.data().UserRequestSurname,
          UserNotificationCompanyKey: context.params.CompanyKey,
          UserNotificationCompanyName: snapshot.data().UserRequestCompanyName
        });

      RequestToJoinServiceList.push(RequestToJoinAction);
    });

    return Promise.all(RequestToJoinServiceList);
  });

exports.NotiBellAcceptedIntoCompany = functions.firestore
  .document('UserInfo/{UserKey}/UserInvitation/{UserInvitationKey}')
  .onUpdate(async (change, context) => {
    const oldValue = change.before.data();
    const newValue = change.after.data();

    if (
      newValue.CompanyInvitationStatus === 'Approve' &&
      oldValue.CompanyInvitationStatus !== 'Approve'
    ) {
      const CompanyKey = newValue.CompanyInvitationCompanyKey;

      const GetCompanyMember = await admin
        .firestore()
        .collection('Company')
        .doc(CompanyKey)
        .collection('CompanyMember')
        .get();

      const CompanyMemberKeyList = GetCompanyMember.docs.map(
        CompanyMemberItem => CompanyMemberItem.id
      );

      const GetUserInfo = await admin
        .firestore()
        .collection('UserInfo')
        .doc(context.params.UserKey)
        .get();

      // +UserNotification
      //   >UserNotificationKey
      //       UserNotificationReadStatus (bool)
      //       UserNotificationType (string)
      //       UserNotificationTimestamp (timestamp)
      //       UserNotificationImageURL (string)
      //       UserNotificationFirstname (string)
      //       UserNotificationSurname (string)
      //       UserNotificationUserInfoKey (string)
      //       UserNotificationCompanyName (string)
      //       UserNotificationCompanyKey (string)
      //       UserNotificationRedirectPage (string)
      //       UserNotificationShipmentKey (string)
      //       UserNotificationChatroonKey (string)

      //           CompanyInvitationReference (reference)
      //           CompanyInvitationCompanyKey (string)
      //           CompanyInvitationName (string)
      //           CompanyInvitationEmail (string)
      //           CompanyInvitationPosition (string)
      //           CompanyInvitationRole (string)
      //           CompanyInvitationTimestamp (timestamp)
      //           CompanyInvitationStatus (string) ('Reject','Approve','Pending')

      const AcceptedIntoCompanyServiceList = [];

      CompanyMemberKeyList.forEach(async Item => {
        const RequestToJoinAction = await admin
          .firestore()
          .collection('UserInfo')
          .doc(Item)
          .collection('UserNotification')
          .add({
            UserNotificationReadStatus: false,
            UserNotificationType: 'AcceptedIntoCompany',
            UserNotificationTimestamp: admin.firestore.FieldValue.serverTimestamp(),
            UserNotificationUserInfoKey: context.params.UserKey,
            UserNotificationUserEmail: GetUserInfo.data().UserInfoEmail,
            UserNotificationCompanyKey: context.params.CompanyKey,
            UserNotificationCompanyName: newValue.CompanyInvitationCompanyKey
          });

        AcceptedIntoCompanyServiceList.push(RequestToJoinAction);
      });

      return Promise.all(AcceptedIntoCompanyServiceList);
    }
  });

exports.NotiBellChangeOfRoleWithInCompany = functions.firestore
  .document('Company/{CompanyKey}/CompanyMember/{CompanyMemberKey}')
  .onUpdate(async (change, context) => {
    const oldValue = change.before.data();
    const newValue = change.after.data();

    if (newValue.UserMemberRoleName !== oldValue.UserMemberRoleName) {
      const GetCompanyMember = await admin
        .firestore()
        .collection('Company')
        .doc(context.params.CompanyKey)
        .collection('CompanyMember')
        .get();

      const GetCompanyName = await admin
        .firestore()
        .collection('Company')
        .doc(context.params.CompanyKey)
        .get();

      const CompanyName = GetCompanyName.data().CompanyName;

      const CompanyMemberKeyList = GetCompanyMember.docs.map(
        CompanyMemberItem => CompanyMemberItem.id
      );

      const ChangeOfRoleWithInCompanyServiceList = [];

      CompanyMemberKeyList.forEach(async Item => {
        const RequestToJoinAction = await admin
          .firestore()
          .collection('UserInfo')
          .doc(Item)
          .collection('UserNotification')
          .add({
            UserNotificationReadStatus: false,
            UserNotificationType: 'ChangeOfRoleWithInCompany',
            UserNotificationTimestamp: admin.firestore.FieldValue.serverTimestamp(),
            UserNotificationUserInfoKey: change.after.id,
            UserNotificationUserInfoEmail: newValue.UserMemberEmail,
            UserNotificationNewRole: newValue.UserMemberRoleName,
            UserNotificationOldRole: oldValue.UserMemberRoleName,
            UserNotificationCompanyKey: context.params.CompanyKey,
            UserNotificationCompanyName: CompanyName
          });

        ChangeOfRoleWithInCompanyServiceList.push(RequestToJoinAction);
      });

      return Promise.all(ChangeOfRoleWithInCompanyServiceList);
    }
  });

exports.LeaveCompany = functions.firestore
  .document('Company/{CompanyKey}/CompanyMember/{CompanyMemberKey}')
  .onDelete(async (snapshot, context) => {
    const UserKey = snapshot.id;

    // UserCompany

    const GetUserCompany = await admin
      .firestore()
      .collection('UserInfo')
      .doc(UserKey)
      .collection('UserCompany')
      .where(
        'UserCompanyReference',
        '==',
        admin
          .firestore()
          .collection('Company')
          .doc(context.params.CompanyKey)
      )
      .get();

    const UserCompanyDeleteServiceList = [];

    GetUserCompany.docs.forEach(async Item => {
      const DeleteUserCompany = await admin
        .firestore()
        .doc(Item.ref.path)
        .delete();
      UserCompanyDeleteServiceList.push(DeleteUserCompany);
    });

    // ShipmentMember

    const GetShipmentOfShipmentMemberOnThisCompany = await admin
      .firestore()
      .collection('Shipment')
      .where(`ShipmentMember.${UserKey}.ShipmentMemberCompanyKey`, '==', context.params.CompanyKey)
      .get();

    const ShipmentMemberDeleteList = [];

    GetShipmentOfShipmentMemberOnThisCompany.forEach(async Item => {
      const DeleteShipmentMemberPayload = { ShipmentMember: {} };

      DeleteShipmentMemberPayload['ShipmentMember'][UserKey] = {
        ShipmentMemberCompanyName: admin.firestore.FieldValue.delete(),
        ShipmentMemberCompanyKey: admin.firestore.FieldValue.delete()
      };

      const ShipmentMember = await admin
        .firestore()
        .doc(Item.ref.path)
        .update(DeleteShipmentMemberPayload);

      ShipmentMemberDeleteList.push(ShipmentMember);
    });

    // ChatRoomMember

    const GetChatRoomMemberCollectionGroup = await admin
      .firestore()
      .collectionGroup('ChatRoomMember')
      .where('ChatRoomMemberUserKey', '==', UserKey)
      .where('ChatRoomMemberCompanyKey', '==', context.params.CompanyKey)
      .get();

    const DeleteCompanyInChatRoomMemberServiceList = [];

    GetChatRoomMemberCollectionGroup.docs.forEach(async Item => {
      const DeleteCompanyInChatRoomMember = await admin
        .firestore()
        .doc(Item.ref.path)
        .update({
          ChatRoomMemberCompanyName: admin.firestore.FieldValue.delete(),
          ChatRoomMemberCompanyKey: admin.firestore.FieldValue.delete()
        });
      DeleteCompanyInChatRoomMemberServiceList.push(DeleteCompanyInChatRoomMember);
    });

    // ShipmentReference ?

    return Promise.all([
      UserCompanyDeleteServiceList,
      ShipmentMemberDeleteList,
      DeleteCompanyInChatRoomMemberServiceList
    ]);
  });

// +UserNotification
//   >UserNotificationKey
//       UserNotificationReadStatus (bool)
//       UserNotificationType (string)
//       UserNotificationTimestamp (timestamp)
//       UserNotificationImageURL (string)
//       UserNotificationFirstname (string)
//       UserNotificationSurname (string)
//       UserNotificationUserInfoKey (string)
//       UserNotificationCompanyName (string)
//       UserNotificationCompanyKey (string)
//       UserNotificationRedirectPage (string)
//       UserNotificationShipmentKey (string)
//       UserNotificationChatroonKey (string)

// +CompanyMember (Array<object>)
//   >UserKey
//     UserMemberEmail (string)
//     UserMemberPosition (string)
//     UserMemberRoleName (string)
//     UserMatrixRolePermissionCode (string) (Binary number)
//     UserMemberCompanyStandingStatus (string)
//     UserMemberJoinedTimestamp (timestamp)

exports.AddProfileDataInUserPersonalizeWhenCreateProfile = functions.firestore
  .document('UserInfo/{UserKey}/Profile/{ProfileKey}')
  .onCreate(async (snapshot, context) => {
    const GetUserEmail = await admin
      .firestore()
      .collection('UserInfo')
      .doc(context.params.UserKey)
      .get();
    const UserEmail = GetUserEmail.data().UserInfoEmail;
    const ProfileFirstname = snapshot.data().ProfileFirstname;
    const ProfileSurname = snapshot.data().ProfileSurname;

    const AddUserEmailAction = await admin
      .firestore()
      .collection('UserPersonalize')
      .doc(context.params.ProfileKey)
      .set(
        {
          UserEmail: UserEmail,
          ProfileFirstname: ProfileFirstname,
          ProfileSurname: ProfileSurname
        },
        { merge: true }
      );

    // if (!oldValue && newValue.ProfileEmail) {
    //   return AddProfileEmailAction;
    // }

    // if (oldValue.ProfileEmail !== newValue.ProfileEmail) {
    //   return AddProfileEmailAction;
    // }

    return AddUserEmailAction;
  });

const TestMessage = () => {
  return {
    to: 'holy-wisdom@hotmail.com',
    from: 'test@example.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>'
  };
};

const UnreadMessageTemplate = (To, Text, Html) => {
  return {
    to: To,
    from: 'noreply@yterminal.com',
    subject: 'Yterminal - Unread your message',
    text: Text,
    html: Html
  };
};

const InviteIntoShipmentTemplate = (To, Text, Html) => {
  return {
    to: To,
    from: 'noreply@yterminal.com',
    subject: 'Yterminal - Invite Into Shipment',
    text: Text,
    html: Html
  };
};

const InviteToJoinCompanyTemplate = (To, Text, Html) => {
  return {
    to: To,
    from: 'noreply@yterminal.com',
    subject: 'Yterminal - Invite To Join Company',
    text: Text,
    html: Html
  };
};

const SendEmail = async TemplateMessage => {
  sgMail.setApiKey('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');
  return await sgMail.send(TemplateMessage);
};

exports.TestSendEmail = functions.https.onRequest(async (req, res) => {
  return SendEmail(TestMessage()).then(r => {
    return res.status(200).send('Email Sended');
  });
});

exports.SendUnreadMessage = functions.https.onRequest(async (req, res) => {
  const GetShipmentChatCount = await admin
    .firestore()
    .collection('UserPersonalize')
    .where('ShipmentChatCount', '>', 0)
    .get();

  const ShipmentChatCountProfileList = GetShipmentChatCount.docs.map(Item => ({
    ...Item.data(),
    ProfileKey: Item.id
  }));

  const GroupProfileByUserEmail = _.groupBy(ShipmentChatCountProfileList, 'UserEmail');

  const UnreadSendEmailList = [];

  for (const key in GroupProfileByUserEmail) {
    if (GroupProfileByUserEmail.hasOwnProperty(key)) {
      const element = GroupProfileByUserEmail[key];
      const UserShipmentChatCountList = element.map(Item => Item.ShipmentChatCount);
      const reducer = (accumulator, currentValue) => accumulator + currentValue;

      const UserAllUnreadCount = UserShipmentChatCountList.reduce(reducer);

      //console.log(UserAllUnreadCount);
      let CreateEmailText = `${UserAllUnreadCount} Unread messages`;
      let CreateEmailHtml = `<h2>${UserAllUnreadCount} Unread messages</h2><br>`;

      const MapTextWithProfileUnread = element.map(
        Item =>
          `${Item.ProfileFirstname} ${Item.ProfileSurname} has ${
            Item.ShipmentChatCount
          } unread messages`
      );

      const MapHtmlWithProfileUnread = element.map(
        Item =>
          `<p><strong>${Item.ProfileFirstname} ${Item.ProfileSurname}</strong> has ${
            Item.ShipmentChatCount
          } unread messages</p>`
      );

      const ProfileUnreadMergeText = MapTextWithProfileUnread.join();
      const ProfileUnreadMergeHtml = MapHtmlWithProfileUnread.join('<br>');

      const FinalText = CreateEmailText + ProfileUnreadMergeText;
      const FinalHtml = CreateEmailHtml + ProfileUnreadMergeHtml;

      const SendEmailAction = SendEmail(UnreadMessageTemplate(key, FinalText, FinalHtml));

      UnreadSendEmailList.push(SendEmailAction);
    }
  }

  return Promise.all(UnreadSendEmailList).then(_ => {
    return res.status(200).send(JSON.stringify(GroupProfileByUserEmail));
  });
});
