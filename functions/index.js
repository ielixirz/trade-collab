const _ = require('lodash');

const firebase = require('firebase');

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const sgMail = require('@sendgrid/mail');

const AES = require('crypto-js/aes');

var serviceAccount = require('./weeklyorder0-firebase-adminsdk-aruhg-0fd4837a53.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://weeklyorder0.firebaseio.com'
});

const CloudFunctionsRegionsAsia = functions.region('asia-east2');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.ApproveCompanyInvitation = CloudFunctionsRegionsAsia.firestore
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
          CompanyUserAccessibilityRolePermissionCode: newValue.CompanyInvitationRole,
          UserMemberCompanyStandingStatus: 'Active',
          UserMemberJoinedTimestamp: new Date()
        });

      return Promise.all([UserCompany, CompanyMember]);
    }
  });

exports.ApproveUserRequest = CloudFunctionsRegionsAsia.firestore
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
          CompanyUserAccessibilityRolePermissionCode: newValue.UserRequestRolePermissionCode,
          UserMemberCompanyStandingStatus: 'Active',
          UserMemberJoinedTimestamp: new Date()
        });

      return Promise.all([UserCompany, CompanyMember]);
    }
  });

exports.ReaderLastestMessage = CloudFunctionsRegionsAsia.firestore
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

exports.CreateChatRoomMessageKeyList = CloudFunctionsRegionsAsia.firestore
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

exports.OnCreateShipment = CloudFunctionsRegionsAsia.firestore
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

      const ShipmentPartnerEmail = snapshot.data().ShipmentPartnerEmail;
      const ShipmentCreatorProfileFirstName = snapshot.data().ShipmentCreatorProfileFirstName;
      const ShipmentCreatorProfileSurName = snapshot.data().ShipmentCreatorProfileSurName;
      const ShipmentCreatorProfileKey = snapshot.data().ShipmentCreatorProfileKey;

      const FindPartnerUserKey = await admin
        .firestore()
        .collection('UserInfo')
        .where('UserInfoEmail', '==', ShipmentPartnerEmail)
        .get();

      let PartnerUID;

      let AddChatRoomPartnerMember = Promise.resolve(null);

      if (FindPartnerUserKey.size > 0) {
        PartnerUID = FindPartnerUserKey.docs[0].id;

        let ShipmetPartnerRole;

        let CreatorType = snapshot.data().ShipmentCreatorType;

        if (CreatorType === 'Importer') ShipmetPartnerRole = 'Exporter';
        else if (CreatorType === 'Exporter') ShipmetPartnerRole = 'Importer';
        else if (CreatorType === 'Inbound Freight Forwarder')
          ShipmetPartnerRole = 'Outbound Freight Forwarder';
        else if (CreatorType === 'Outbound Freight Forwarder')
          ShipmetPartnerRole = 'Inbound Freight Forwarder';
        else if (CreatorType === 'Inbound Custom Broker')
          ShipmetPartnerRole = 'Outbound Custom Broker';
        else if (CreatorType === 'Outbound Custom Broker')
          ShipmetPartnerRole = 'Inbound Custom Broker';

        AddChatRoomPartnerMember = await admin
          .firestore()
          .collection('Shipment')
          .doc(context.params.ShipmentKey)
          .collection('ChatRoom')
          .doc(ChatRoomID)
          .collection('ChatRoomMember')
          .add({
            ChatRoomMemberUserKey: PartnerUID,
            ChatRoomMemberEmail: ShipmentPartnerEmail,
            ChatRoomMemberRole: [ShipmetPartnerRole],
            ChatRoomMemberRecruiterProfileFirstName: ShipmentCreatorProfileFirstName,
            ChatRoomMemberRecruiterProfileSurName: ShipmentCreatorProfileSurName,
            ChatRoomMemberRecruiterProfileKey: ShipmentCreatorProfileKey,
            ChatRoomMemberRecruiterUserKey: ShipmentMemberUserKey
          });
      }
      return Promise.all([
        CreateShipmentShareData,
        AddShipmentShareList,
        AddShipmentMember,
        AddShipmentMemberList,
        AddChatRoom,
        AddChatRoomMember,
        AddChatRoomPartnerMember
      ]);
    } catch (error) {
      return error;
    }
  });

exports.AddChatRoomShareDataList = CloudFunctionsRegionsAsia.firestore
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

exports.AddChatRoomMemberList = CloudFunctionsRegionsAsia.firestore
  .document('Shipment/{ShipmentKey}/ChatRoom/{ChatRoomKey}/ChatRoomMember/{ChatRoomMemberKey}')
  .onCreate(async (snapshot, context) => {
    const UserKey = snapshot.data().ChatRoomMemberUserKey;

    const AddChatRoomMemberListAction = await admin
      .firestore()
      .collection('Shipment')
      .doc(context.params.ShipmentKey)
      .collection('ChatRoom')
      .doc(context.params.ChatRoomKey)
      .set({ ChatRoomMemberList: admin.firestore.FieldValue.arrayUnion(UserKey) }, { merge: true });

    return AddChatRoomMemberListAction;
  });

exports.DeleteChatRoomMemberList = CloudFunctionsRegionsAsia.firestore
  .document('Shipment/{ShipmentKey}/ChatRoom/{ChatRoomKey}/ChatRoomMember/{ChatRoomMemberKey}')
  .onDelete(async (snapshot, context) => {
    const oldValue = snapshot.data();

    const UserKey = oldValue.ChatRoomMemberUserKey;

    const DeleteChatRoomMemberListAction = await admin
      .firestore()
      .collection('Shipment')
      .doc(context.params.ShipmentKey)
      .collection('ChatRoom')
      .doc(context.params.ChatRoomKey)
      .set(
        { ChatRoomMemberList: admin.firestore.FieldValue.arrayRemove(UserKey) },
        { merge: true }
      );

    return DeleteChatRoomMemberListAction;
  });

exports.AddFirstNameSurNameFirstProfileToChatRoomMember = CloudFunctionsRegionsAsia.firestore
  .document('Shipment/{ShipmentKey}/ChatRoom/{ChatRoomKey}/ChatRoomMember/{ChatRoomMemberKey}')
  .onCreate(async (snapshot, context) => {
    const UserKey = snapshot.data().ChatRoomMemberUserKey;

    const GetUserProfileList = await admin
      .firestore()
      .collection('UserInfo')
      .doc(UserKey)
      .collection('Profile')
      .get();

    const FirstProfile = GetUserProfileList.docs[0].data();

    const FirstnameFirstProfile = FirstProfile.ProfileFirstname;
    const SurnameFirstProfile = FirstProfile.ProfileSurname;

    const AddFirstNameSurNameFirstProfileToChatRoomMemberAction = await admin
      .firestore()
      .collection('Shipment')
      .doc(context.params.ShipmentKey)
      .collection('ChatRoom')
      .doc(context.params.ChatRoomKey)
      .collection('ChatRoomMember')
      .doc(context.params.ChatRoomMemberKey)
      .set(
        {
          ChatRoomMemberFirstnameFirstProfile: FirstnameFirstProfile,
          ChatRoomMemberSurnameFirstProfile: SurnameFirstProfile
        },
        { merge: true }
      );

    return AddFirstNameSurNameFirstProfileToChatRoomMemberAction;
  });

exports.AddShipmentMember = CloudFunctionsRegionsAsia.firestore
  .document('Shipment/{ShipmentKey}/ChatRoom/{ChatRoomKey}/ChatRoomMember/{ChatRoomMemberKey}')
  .onWrite(async (change, context) => {
    const oldValue = change.before.data();
    const newValue = change.after.data();

    let PayloadObject = {};

    if (newValue) {
      const SnapshotDataObject = newValue;
      const ShipmentMemberUserKey = SnapshotDataObject['ChatRoomMemberUserKey'];

      PayloadObject[ShipmentMemberUserKey] = {};

      if (SnapshotDataObject['ChatRoomMemberEmail'])
        PayloadObject[ShipmentMemberUserKey]['ShipmentMemberEmail'] =
          SnapshotDataObject['ChatRoomMemberEmail'];

      if (SnapshotDataObject['ChatRoomMemberRole'])
        PayloadObject[ShipmentMemberUserKey][
          'ShipmentMemberRole'
        ] = admin.firestore.FieldValue.arrayUnion(...SnapshotDataObject['ChatRoomMemberRole']);

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

      return Promise.all([AddShipmentMember, AddShipmentMemberList]);
    }
  });

exports.DeleteShipmentMember = CloudFunctionsRegionsAsia.firestore
  .document('Shipment/{ShipmentKey}/ChatRoom/{ChatRoomKey}/ChatRoomMember/{ChatRoomMemberKey}')
  .onDelete(async (snapshot, context) => {
    const oldValue = snapshot.data();

    const UserKey = oldValue.ChatRoomMemberUserKey;

    const GetOtherChatRoomMember = await admin
      .firestore()
      .collection('Shipment')
      .doc(context.params.ShipmentKey)
      .collection('ChatRoom')
      .get();

    let isExistOtherChatRoomMember;

    await GetOtherChatRoomMember.docs.forEach(async Item => {
      const isMember = await admin
        .firestore()
        .doc(Item.ref.path)
        .collection('ChatRoomMember')
        .where('ChatRoomMemberUserKey', '==', UserKey)
        .get();

      if (isMember.size > 0) {
        isExistOtherChatRoomMember = true;
      }
    });

    const CheckOtherChatRoomMember = async () => {
      if (isExistOtherChatRoomMember !== true) {
        const DeletePayloadObject = { ShipmentMember: {} };

        DeletePayloadObject['ShipmentMember'][UserKey] = admin.firestore.FieldValue.delete();

        const DeleteShipmentMember = await admin
          .firestore()
          .collection('Shipment')
          .doc(context.params.ShipmentKey)
          .update(DeletePayloadObject);

        const DeleteShipmentMemberList = await admin
          .firestore()
          .collection('Shipment')
          .doc(context.params.ShipmentKey)
          .update({ ShipmentMemberList: admin.firestore.FieldValue.arrayRemove(UserKey) });

        return Promise.all([DeleteShipmentMember, DeleteShipmentMemberList]);
      } else {
        return Promise.resolve(null);
      }
    };

    return CheckOtherChatRoomMember;
  });

exports.AddNotiCountFirstJoin = CloudFunctionsRegionsAsia.firestore
  .document('Shipment/{ShipmentKey}/ChatRoom/{ChatRoomKey}/ChatRoomMember/{ChatRoomMemberKey}')
  .onCreate(async (snapshot, context) => {
    const UserKey = snapshot.data().ChatRoomMemberUserKey;

    const UserPersonalizeProfileActionList = [];

    const GetUserProfileList = await admin
      .firestore()
      .collection('UserInfo')
      .doc(UserKey)
      .collection('Profile')
      .get();

    const ProfileKeyList = GetUserProfileList.docs.map(ProfileItem => ProfileItem.id);

    ProfileKeyList.forEach(async Item => {
      const TriggerFirstJoin = admin
        .firestore()
        .collection('UserPersonalize')
        .doc(Item);

      const GetFirstJoin = await TriggerFirstJoin.get();
      let FirstJoinStatus = GetFirstJoin[context.params.ShipmentKey];

      const FirstJoinPayloadObject = { ShipmentFristJoin: {} };

      FirstJoinPayloadObject['ShipmentFristJoin'][context.params.ShipmentKey] = true;

      if (!GetFirstJoin || FirstJoinStatus === undefined) {
        const SetFirstJoinAction = await TriggerFirstJoin.set(FirstJoinPayloadObject, {
          merge: true
        });
        UserPersonalizeProfileActionList.push(SetFirstJoinAction);
      }
    }); // End forEach

    return Promise.all(UserPersonalizeProfileActionList);
  });

exports.DeleteNotiCount = CloudFunctionsRegionsAsia.firestore
  .document('Shipment/{ShipmentKey}/ChatRoom/{ChatRoomKey}/ChatRoomMember/{ChatRoomMemberKey}')
  .onDelete(async (snapshot, context) => {
    const oldValue = snapshot.data();

    const UserKey = oldValue.ChatRoomMemberUserKey;

    const GetUserProfileList = await admin
      .firestore()
      .collection('UserInfo')
      .doc(UserKey)
      .collection('Profile')
      .get();

    const ProfileKeyList = GetUserProfileList.docs.map(ProfileItem => ProfileItem.id);

    const GetOtherChatRoomMember = await admin
      .firestore()
      .collection('Shipment')
      .doc(context.params.ShipmentKey)
      .collection('ChatRoom')
      .get();

    let isExistOtherChatRoomMember;

    const DeleteNotiCountServiceList = [];

    await GetOtherChatRoomMember.docs.forEach(async Item => {
      const isMember = await admin
        .firestore()
        .doc(Item.ref.path)
        .collection('ChatRoomMember')
        .where('ChatRoomMemberUserKey', '==', UserKey)
        .get();

      if (isMember.size > 0) {
        isExistOtherChatRoomMember = true;
      }
    });

    const CheckOtherChatRoomMember = async () => {
      if (isExistOtherChatRoomMember !== true) {
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

        return Promise.resolve(DeleteNotiCountServiceList);
      } else {
        return Promise.resolve(null);
      }
    };

    return CheckOtherChatRoomMember;
  });

exports.SendEmailInviteIntoShipment = CloudFunctionsRegionsAsia.firestore
  .document('Shipment/{ShipmentKey}/ChatRoom/{ChatRoomKey}/ChatRoomMember/{ChatRoomMemberKey}')
  .onCreate(async (snapshot, context) => {
    const UserEmail = snapshot.data().ChatRoomMemberEmail;

    let RecruiterUserKey;
    if (snapshot.data().ChatRoomMemberRecruiterUserKey)
      RecruiterUserKey = snapshot.data().ChatRoomMemberRecruiterUserKey;

    let RecruiterProfileFirstName;
    if (snapshot.data().ChatRoomMemberRecruiterProfileFirstName)
      RecruiterProfileFirstName = snapshot.data().ChatRoomMemberRecruiterProfileFirstName;
    let RecruiterProfileSurName;
    if (snapshot.data().ChatRoomMemberRecruiterProfileSurName)
      RecruiterProfileSurName = snapshot.data().ChatRoomMemberRecruiterProfileSurName;

    let ShipmentReference;

    const GetShipmentData = await admin
      .firestore()
      .collection('Shipment')
      .doc(context.params.ShipmentKey)
      .get();

    const ProductName = GetShipmentData.data().ShipmentProductName;

    let RecruiterShipmentMemberCompanyKey;
    let RecruiterShipmentMemberCompanyName;

    if (RecruiterUserKey) {
      if (GetShipmentData.data().ShipmentMember[RecruiterUserKey].ShipmentMemberCompanyKey) {
        RecruiterShipmentMemberCompanyKey = GetShipmentData.data().ShipmentMember[RecruiterUserKey]
          .ShipmentMemberCompanyKey;
      }

      if (GetShipmentData.data().ShipmentMember[RecruiterUserKey].ShipmentMemberCompanyName) {
        RecruiterShipmentMemberCompanyName = GetShipmentData.data().ShipmentMember[RecruiterUserKey]
          .ShipmentMemberCompanyName;
      }
    }

    if (RecruiterShipmentMemberCompanyKey && RecruiterShipmentMemberCompanyName) {
      const GetShipmentReference = await admin
        .firestore()
        .collection('Shipment')
        .doc(context.params.ShipmentKey)
        .collection('ShipmentReference')
        .where('ShipmentReferenceCompanyKey', '==', RecruiterShipmentMemberCompanyKey)
        .get();

      if (GetShipmentReference.size > 0) {
        ShipmentReference = GetShipmentReference.docs[0].data().ShipmentReferenceID;
      }
    }

    let HeaderText;
    let HeaderHtml;

    let Content;

    if (ShipmentReference && ProductName) {
      HeaderText = `Join ${RecruiterProfileFirstName} ${RecruiterProfileSurName} on a shipment ${ShipmentReference} ${ProductName}`;
      HeaderHtml = `<h2> Join <span style="color: rgba(54, 127, 238, 1);">${RecruiterProfileFirstName} ${RecruiterProfileSurName}</span> on a shipment ${ShipmentReference} ${ProductName}</h2>`;
    } else if (ShipmentReference) {
      HeaderText = `Join ${RecruiterProfileFirstName} ${RecruiterProfileSurName} on a shipment ${ShipmentReference}`;
      HeaderHtml = `<h2> Join <span style="color: rgba(54, 127, 238, 1);">${RecruiterProfileFirstName} ${RecruiterProfileSurName}</span> on a shipment ${ShipmentReference} </h2>`;
    } else {
      HeaderText = `Join ${RecruiterProfileFirstName} ${RecruiterProfileSurName} on a shipment in yterminal`;
      HeaderHtml = `<h2> Join <span style="color: rgba(54, 127, 238, 1);">${RecruiterProfileFirstName} ${RecruiterProfileSurName}</span> on a shipment in yterminal </h2>`;
    }

    if (RecruiterShipmentMemberCompanyName && ShipmentReference && ProductName) {
      Content = `<p> <span style="color: rgba(234, 70, 70, 1);"> ${RecruiterShipmentMemberCompanyName} </span> has invited you to join Yterminal to work on <span style="color: rgba(234, 70, 70, 1);"> ${ShipmentReference} ${ProductName} </span> </p>`;
    } else if (ShipmentReference && ProductName) {
      Content = `<p> <span style="color: rgba(234, 70, 70, 1);"> ${RecruiterProfileFirstName} ${RecruiterProfileSurName} </span> has invited you to join Yterminal to work on <span style="color: rgba(234, 70, 70, 1);"> ${ShipmentReference} ${ProductName} </span> </p>`;
    } else if (RecruiterShipmentMemberCompanyName && ShipmentReference) {
      Content = `<p> <span style="color: rgba(234, 70, 70, 1);"> ${RecruiterShipmentMemberCompanyName} </span> has invited you to join Yterminal to work on <span style="color: rgba(234, 70, 70, 1);"> ${ShipmentReference} </span> </p>`;
    } else {
      Content = `<p> <span style="color: rgba(234, 70, 70, 1);"> ${RecruiterProfileFirstName} ${RecruiterProfileSurName} </span> has invited you to join Yterminal to work on <span style="color: rgba(234, 70, 70, 1);"> a shipment </span> </p>`;
    }

    const ContentDescription = `<br><p> In Yterminal you can see a snapshot of all yourshipments and easily inform your company or your supply chain <span style="color: rgba(234, 70, 70, 1);">(Exporter, Importer, Forwarder Custom Broker)</span> about the shipment. So everyone is on the same page. Here all your files, communications are organized by shipment. <a><u>Learn more...</u></a> </p>`;

    Content = Content + ContentDescription;

    const ButtonRedirect = `<a style="width: 400px;
      font-size:14px;
      font-weight:500;
      letter-spacing:0.25px;
      text-decoration:none;
      text-transform:none;
      display:inline-block;
      border-radius:8px;
      padding:18px 0;
      background-color:rgba(255, 90 , 95, 1);
      color:#ffffff;" class="redirectbutton" href='https://weeklyorder.web.app/#/chat/${
        context.params.ShipmentKey
      }'>Join Now</a>`;

    if (RecruiterProfileFirstName && RecruiterProfileSurName) {
      const SendInviteIntoShipment = await SendEmail(
        InviteIntoShipmentTemplate(UserEmail, HeaderText, HeaderHtml, Content, ButtonRedirect)
      );

      return SendInviteIntoShipment;
    } else {
      return null;
    }
  });

exports.NotiSystemGenInviteIntoShipment = CloudFunctionsRegionsAsia.firestore
  .document('Shipment/{ShipmentKey}/ChatRoom/{ChatRoomKey}/ChatRoomMember/{ChatRoomMemberKey}')
  .onCreate(async (snapshot, context) => {
    const UserKey = snapshot.data().ChatRoomMemberUserKey;

    const GetUserProfileList = await admin
      .firestore()
      .collection('UserInfo')
      .doc(UserKey)
      .collection('Profile')
      .get();

    const FirstProfile = GetUserProfileList.docs[0].data();

    const FirstnameFirstProfile = FirstProfile.ProfileFirstname;
    const SurnameFirstProfile = FirstProfile.ProfileSurname;

    const CreateSystemGenInviteIntoShipment = await admin
      .firestore()
      .collection('Shipment')
      .doc(context.params.ShipmentKey)
      .collection('ChatRoom')
      .doc(context.params.ChatRoomKey)
      .collection('ChatRoomMessage')
      .add({
        ChatRoomMessageContext: `${FirstnameFirstProfile} ${SurnameFirstProfile} (${
          snapshot.data().ChatRoomMemberEmail
        }) joined`,
        ChatRoomMessageSender: 'InviteIntoShipment',
        ChatRoomMessageType: 'System',
        ChatRoomMessageTimestamp: admin.firestore.FieldValue.serverTimestamp()
      });

    return CreateSystemGenInviteIntoShipment;
  });

exports.SetBuyerSellerShipment = CloudFunctionsRegionsAsia.firestore
  .document('Shipment/{ShipmentKey}/ChatRoom/{ChatRoomKey}/ChatRoomMember/{ChatRoomMemberKey}')
  .onUpdate(async (change, context) => {
    const oldValue = change.before.data();
    const newValue = change.after.data();

    let SetCompanyName = [];

    if (newValue.ChatRoomMemberRole.includes('Exporter') && newValue.ChatRoomMemberCompanyName) {
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
    } else if (
      newValue.ChatRoomMemberRole.includes('Importer') &&
      newValue.ChatRoomMemberCompanyName
    ) {
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

    return Promise.all(SetCompanyName);
  });

exports.CreateDefaultTemplateCompanyUserAccessibility = CloudFunctionsRegionsAsia.firestore
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

exports.ShipmentAllCount = CloudFunctionsRegionsAsia.firestore
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

exports.CopyInsideMasterDataToShipment = CloudFunctionsRegionsAsia.firestore
  .document('Shipment/{ShipmentKey}/ShipmentShareData/{ShipmentShareDataKey}')
  .onWrite(async (change, context) => {
    const oldValue = change.before.data();
    const newValue = change.after.data();

    let PayloadObject = {};

    if (newValue.ShipperPort) PayloadObject['ShipperPort'] = newValue.ShipperPort;
    if (newValue.ConsigneePort) PayloadObject['ConsigneePort'] = newValue.ConsigneePort;
    if (newValue.ShipperETDDate) PayloadObject['ShipperETDDate'] = newValue.ShipperETDDate;
    if (newValue.ConsigneeETAPortDate)
      PayloadObject['ConsigneeETAPortDate'] = newValue.ConsigneeETAPortDate;
    if (newValue.ShipmentDetailProduct)
      PayloadObject['ShipmentProductName'] = newValue.ShipmentDetailProduct;
    if (newValue.ShipperCompanyName)
      PayloadObject['ShipmentSellerCompanyName'] = newValue.ShipperCompanyName;
    if (newValue.ConsigneeCompanyName)
      PayloadObject['ShipmentBuyerCompanyName'] = newValue.ConsigneeCompanyName;
    if (newValue.ShipmentDetailPriceDescriptionOfGoods)
      PayloadObject['ShipmentDetailPriceDescriptionOfGoods'] =
        newValue.ShipmentDetailPriceDescriptionOfGoods;

    if (PayloadObject !== {} && change.after.id === 'DefaultTemplate') {
      return admin
        .firestore()
        .collection('Shipment')
        .doc(context.params.ShipmentKey)
        .set(PayloadObject, { merge: true });
    }
  });

exports.NotiBellAndEmailInviteToJoinCompany = CloudFunctionsRegionsAsia.firestore
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

    const HeaderText = `Invited to join ${snapshot.data().CompanyInvitationName}`;
    const HeaderHtml = `<h2>Invited to join ${snapshot.data().CompanyInvitationName}</h2>`;

    let Content = `<p> ${snapshot.data().CompanyInvitationRecruiterProfileFirstName} ${
      snapshot.data().CompanyInvitationRecruiterProfileSurName
    } has invited you to join ${snapshot.data().CompanyInvitationName} on
    Yterminal. </p>`;

    const ContentDescription = `<br><p> In Yterminal you can see a snapshot of all yourshipments and easily inform your company or your supply chain <span style="color: rgba(234, 70, 70, 1);">(Exporter, Importer, Forwarder Custom Broker)</span> about the shipment. So everyone is on the same page. Here all your files, communications are organized by shipment. <a><u>Learn more...</u></a> </p>`;

    Content = Content + ContentDescription;

    const ButtonRedirect = `<a style="width: 400px;
      font-size:14px;
      font-weight:500;
      letter-spacing:0.25px;
      text-decoration:none;
      text-transform:none;
      display:inline-block;
      border-radius:8px;
      padding:18px 0;
      background-color:rgba(255, 90 , 95, 1);
      color:#ffffff;" class="redirectbutton" href='https://weeklyorder.web.app/#/network/company/${
        snapshot.data().CompanyInvitationCompanyKey
      }'>Join Now</a>`;

    const SendNotiEmail = await SendEmail(
      InviteToJoinCompanyTemplate(UserInfoEmail, HeaderText, HeaderHtml, Content, ButtonRedirect)
    );

    return Promise.all([SendNotiBell, SendNotiEmail]);
  });

exports.NotiBellRequestToJoinCompany = CloudFunctionsRegionsAsia.firestore
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

exports.NotiBellAcceptedIntoCompany = CloudFunctionsRegionsAsia.firestore
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
            UserNotificationCompanyKey: newValue.CompanyInvitationCompanyKey,
            UserNotificationCompanyName: newValue.CompanyInvitationName
          });

        AcceptedIntoCompanyServiceList.push(RequestToJoinAction);
      });

      return Promise.all(AcceptedIntoCompanyServiceList);
    }
  });

exports.NotiBellChangeOfRoleWithInCompany = CloudFunctionsRegionsAsia.firestore
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

exports.LeaveCompany = CloudFunctionsRegionsAsia.firestore
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

      console.log(DeleteShipmentMemberPayload);

      const ShipmentMember = await admin
        .firestore()
        .doc(Item.ref.path)
        .set(DeleteShipmentMemberPayload, { merge: true });

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

exports.AddProfileDataInUserPersonalizeWhenCreateProfile = CloudFunctionsRegionsAsia.firestore
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

const BodyEmailTemplate = (HeaderText, Content, Button) => `<!DOCTYPE html>
<head>
    <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
</head>
<body style="background-color:white;
  font-family: 'Roboto', sans-serif;
  justify-content: center; ">
    <table style="width: 800px;
    height: auto;
    background-color: rgba(214, 214, 214, 0.3);
    padding: 0px 0px 0px 16px;
    justify-content: center; 
    margin: auto;"> 
      <tbody>
        <tr class="tr" id='logo' style="height: 50px;">
          <td>
              <svg xmlns="http://www.w3.org/2000/svg" width="172" height="29" viewBox="0 0 172 29">
                <g id="Rectangle_4102" data-name="Rectangle 4102" fill="#fff" stroke="#707070" stroke-width="1">
                  <rect width="172" height="29" stroke="none"/>
                  <rect x="0.5" y="0.5" width="171" height="28" fill="none"/>
                </g>
              </svg>
          </td>
        </tr>
        <tr class="tr" id='header-text' style="height: 100px;">
          <td>
            ${HeaderText}
          </td>
        </tr>
        <tr class="tr" id='content'>
            <td>
              ${Content}
            </td>
        </tr>
        <tr>
            <td class="tr" id='button' align="center" style="height: 80px;">
              ${Button}
            </td>
        </tr>
    </tbody>
  </table>
</body>
</html>`;

const UnreadMessageTemplate = (To, Text, HeaderText, Content, Button) => {
  return {
    to: To,
    from: 'noreply@yterminal.com',
    subject: 'Yterminal - Unread your message',
    text: Text,
    html: BodyEmailTemplate(HeaderText, Content, Button)
  };
};

const InviteIntoShipmentTemplate = (To, HeaderText, HeaderHtml, Content, Button) => {
  return {
    to: To,
    from: 'noreply@yterminal.com',
    subject: 'Yterminal - Invite Into Shipment',
    text: HeaderText,
    html: BodyEmailTemplate(HeaderHtml, Content, Button)
  };
};

const InviteToJoinCompanyTemplate = (To, HeaderText, HeaderHtml, Content, Button) => {
  return {
    to: To,
    from: 'noreply@yterminal.com',
    subject: 'Yterminal - Invite To Join Company',
    text: HeaderText,
    html: BodyEmailTemplate(HeaderHtml, Content, Button)
  };
};

const SendEmail = async TemplateMessage => {
  sgMail.setApiKey('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');
  return await sgMail.send(TemplateMessage);
};

exports.TestSendEmail = CloudFunctionsRegionsAsia.https.onRequest(async (req, res) => {
  return SendEmail(TestMessage()).then(r => {
    return res.status(200).send('Email Sended');
  });
});

exports.SendUnreadMessage = CloudFunctionsRegionsAsia.https.onRequest(async (req, res) => {
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

      let HeaderEmailText = `${UserAllUnreadCount} Unread messages`;
      let HeaderEmailHtml = `<h2>${UserAllUnreadCount} Unread messages</h2>`;

      const MapTextWithProfileUnread = element.map(
        Item =>
          `${Item.ProfileFirstname} ${Item.ProfileSurname} has ${
            Item.ShipmentChatCount
          } unread messages`
      );

      const MapHtmlWithProfileUnread = element.map(
        Item =>
          `<p class="profile-unread"> <span class="highlighttext" style="color: rgba(22, 160, 133, 1);" >${
            Item.ProfileFirstname
          } ${Item.ProfileSurname}</span> has ${Item.ShipmentChatCount} Unread Message </p>`
      );

      const ButtonRedirect = `<a style="width: 400px;
        font-size:14px;
        font-weight:500;
        letter-spacing:0.25px;
        text-decoration:none;
        text-transform:none;
        display:inline-block;
        border-radius:8px;
        padding:18px 0;
        background-color:rgba(255, 90 , 95, 1);
        color:#ffffff;" class="redirectbutton" href='https://weeklyorder.web.app/#/shipment'>View Messages</a>`;

      const ProfileUnreadMergeText = MapTextWithProfileUnread.join();
      const ProfileUnreadMergeHtml = MapHtmlWithProfileUnread.join('');

      const FinalText = HeaderEmailText + ProfileUnreadMergeText;
      const FinalHtml = HeaderEmailHtml + ProfileUnreadMergeHtml + ButtonRedirect;

      const SendEmailAction = SendEmail(
        UnreadMessageTemplate(
          key,
          FinalText,
          HeaderEmailHtml,
          ProfileUnreadMergeHtml,
          ButtonRedirect
        )
      );

      UnreadSendEmailList.push(SendEmailAction);
    }
  }

  return Promise.all(UnreadSendEmailList).then(_ => {
    return res.status(200).send(JSON.stringify(GroupProfileByUserEmail));
  });
});

exports.CheckMultipleProfile = CloudFunctionsRegionsAsia.firestore
  .document('UserInfo/{UserKey}/Profile/{ProfileKey}')
  .onWrite(async (change, context) => {
    const GetAllProfile = await admin
      .firestore()
      .collection('UserInfo')
      .doc(context.params.UserKey)
      .collection('Profile')
      .get();

    if (GetAllProfile.size > 0) {
      return admin
        .firestore()
        .collection('UserInfo')
        .doc(context.params.UserKey)
        .set({ UserInfoIsMultipleProfile: true }, { merge: true });
    }
  });

exports.SendEmailInviteNonSystemUser = CloudFunctionsRegionsAsia.firestore
  .document('NonUserInvite/{NonUserInviteKey}')
  .onCreate(async (snapshot, context) => {
    const NonUserInviteEmail = snapshot.data().NonUserInviteEmail;
    const NonUserInviteRecruiterProfileFirstName = snapshot.data()
      .NonUserInviteRecruiterProfileFirstName;
    const NonUserInviteRecruiterProfileSurName = snapshot.data()
      .NonUserInviteRecruiterProfileSurName;
    const NonUserInviteRecruiterCompanyName = snapshot.data().NonUserInviteRecruiterCompanyName;
    const ShipmentProductName = snapshot.data().ShipmentProductName;
    const ShipmentReferenceID = snapshot.data().ShipmentReferenceID;
    const NonUserInviteType = snapshot.data().NonUserInviteType;
    const NonUserInviteExpiryDate = snapshot.data().NonUserInviteExpiryDate;
    const NonUserInviteRecruiterCompanyKey = snapshot.data().NonUserInviteRecruiterCompanyKey;
    const ShipmentKey = snapshot.data().ShipmentKey;
    const ChatRoomKey = snapshot.data().ChatRoomKey;

    const isUsed = snapshot.data().isUsed ? snapshot.data().isUsed : 'N';

    const Encoder = stringtext =>
      encodeURIComponent(AES.encrypt(stringtext, 'redroylkeew').toString());

    const DocumentKeyEncoder = Encoder(context.params.NonUserInviteKey);
    const ExpiryDateEncoder = Encoder(String(NonUserInviteExpiryDate.seconds));
    const EmailEncoder = Encoder(NonUserInviteEmail);
    const InviteTypeEncoder = Encoder(NonUserInviteType);
    const InviteRecruiterCompanyKeyEncoder = Encoder(NonUserInviteRecruiterCompanyKey);
    const ShipmentKeyEncoder = Encoder(ShipmentKey);
    const ChatRoomKeyEncoder = Encoder(ChatRoomKey);
    const isUsedEncoder = Encoder(isUsed);

    if (NonUserInviteType === 'Shipment') {
      const HeaderText = `Join ${NonUserInviteRecruiterProfileFirstName} ${NonUserInviteRecruiterProfileSurName} on a shipment`;
      const HeaderHtml = `<h2> Join <span style="color: rgba(54, 127, 238, 1);">${NonUserInviteRecruiterProfileFirstName} ${NonUserInviteRecruiterProfileSurName}</span> on a shipment</h2>`;

      let Content;

      if (NonUserInviteRecruiterCompanyName && ShipmentReferenceID && ShipmentProductName) {
        Content = `<p> <span style="color: rgba(234, 70, 70, 1);"> ${NonUserInviteRecruiterProfileFirstName} ${NonUserInviteRecruiterProfileSurName} </span> from <span style="color: rgba(234, 70, 70, 1);"> ${NonUserInviteRecruiterCompanyName} </span> has invited you to work on <span style="color: rgba(234, 70, 70, 1);"> ${ShipmentReferenceID} ${ShipmentProductName} </span> </p>`;
      } else if (ShipmentReferenceID && ShipmentProductName) {
        Content = `<p> <span style="color: rgba(234, 70, 70, 1);"> ${NonUserInviteRecruiterProfileFirstName} ${NonUserInviteRecruiterProfileSurName} </span> has invited you to work on <span style="color: rgba(234, 70, 70, 1);"> ${ShipmentReferenceID} ${ShipmentProductName} </span> </p>`;
      } else if (NonUserInviteRecruiterCompanyName && ShipmentReferenceID) {
        Content = `<p> <span style="color: rgba(234, 70, 70, 1);"> ${NonUserInviteRecruiterCompanyName} </span> has invited you to join Yterminal to work on <span style="color: rgba(234, 70, 70, 1);"> ${ShipmentReferenceID} </span> </p>`;
      } else {
        Content = `<p> <span style="color: rgba(234, 70, 70, 1);"> ${NonUserInviteRecruiterProfileFirstName} ${NonUserInviteRecruiterProfileSurName} </span> has invited you to join Yterminal to work on <span style="color: rgba(234, 70, 70, 1);"> a shipment </span> </p>`;
      }

      const ContentDescription = `<br><p> In weeklyorders you get a live snapshot of all your shipments. Shipments in planning, confirmed or completed. You can easily inform your company or your external supply chain <span style="color: rgba(234, 70, 70, 1);">(Exporter, Importer, Forwarder Custom Broker)</span> about the shipment. So everyone is on the same page. Here all your files, communications are organized by shipment. <a><u>Learn more...</u></a> </p>`;

      Content = Content + ContentDescription;

      const ButtonRedirect = `<a style="width: 400px;
        font-size:14px;
        font-weight:500;
        letter-spacing:0.25px;
        text-decoration:none;
        text-transform:none;
        display:inline-block;
        border-radius:8px;
        padding:18px 0;
        background-color:rgba(255, 90 , 95, 1);
        color:#ffffff;" class="redirectbutton" href='https://weeklyorder-staging.web.app/#/nu/?dke=${DocumentKeyEncoder}&ed=${ExpiryDateEncoder}&e=${EmailEncoder}&f=${InviteTypeEncoder}&sk=${ShipmentKeyEncoder}&crk=${ChatRoomKeyEncoder}&u=${isUsedEncoder}'>Join Now - Free</a>`;

      const SendInviteIntoShipment = await SendEmail(
        InviteIntoShipmentTemplate(
          NonUserInviteEmail,
          HeaderText,
          HeaderHtml,
          Content,
          ButtonRedirect
        )
      );

      return SendInviteIntoShipment;
    } else if (NonUserInviteType === 'Company') {
      const HeaderText = `Invited to join ${NonUserInviteRecruiterCompanyName}`;
      const HeaderHtml = `<h2>Invited to join ${NonUserInviteRecruiterCompanyName}</h2>`;

      let Content = `<p> ${NonUserInviteRecruiterProfileFirstName} ${NonUserInviteRecruiterProfileSurName} has invited you to join ${NonUserInviteRecruiterCompanyName} </p>`;

      const ContentDescription = `<br><p> In weeklyorders you get a live snapshot of all your shipments. Shipments in planning, confirmed or completed. You can easily inform your company or your external supply chain <span style="color: rgba(234, 70, 70, 1);">(Exporter, Importer, Forwarder Custom Broker)</span> about the shipment. So everyone is on the same page. Here all your files, communications are organized by shipment. <a><u>Learn more...</u></a> </p>`;

      Content = Content + ContentDescription;

      const ButtonRedirect = `<a style="width: 400px;
        font-size:14px;
        font-weight:500;
        letter-spacing:0.25px;
        text-decoration:none;
        text-transform:none;
        display:inline-block;
        border-radius:8px;
        padding:18px 0;
        background-color:rgba(255, 90 , 95, 1);
        color:#ffffff;" class="redirectbutton" href='https://weeklyorder-staging.web.app/#/nu/?dke=${DocumentKeyEncoder}&ed=${ExpiryDateEncoder}&e=${EmailEncoder}&f=${InviteTypeEncoder}&ck=${InviteRecruiterCompanyKeyEncoder}&u=${isUsedEncoder}'>Join Now - Free</a>`;

      const SendInviteIntoCompany = await SendEmail(
        InviteToJoinCompanyTemplate(
          NonUserInviteEmail,
          HeaderText,
          HeaderHtml,
          Content,
          ButtonRedirect
        )
      );

      return SendInviteIntoCompany;
    }
  });

exports.CreateMemberFromNonSystemUser = CloudFunctionsRegionsAsia.firestore
  .document('UserInfo/{UserInfoKey}')
  .onCreate(async (snapshot, context) => {
    const UserKey = context.params.UserInfoKey;
    const UserInfoIsInviteFromEmail = snapshot.data().UserInfoIsInviteFromEmail;
    const UserInfoInviteDocumentKey = snapshot.data().UserInfoInviteDocumentKey;

    const SetUsedUrlLink = await admin
      .firestore()
      .collection('NonUserInvite')
      .doc(UserInfoInviteDocumentKey)
      .set({ isUsed: 'Y' }, { merge: true });

    if (UserInfoIsInviteFromEmail && UserInfoInviteDocumentKey) {
      const GetNonUserInvite = await admin
        .firestore()
        .collection('NonUserInvite')
        .doc(UserInfoInviteDocumentKey)
        .get();
      const NonUserInviteData = GetNonUserInvite.data();

      if (NonUserInviteData.NonUserInviteType === 'Shipment') {
        const ShipmentKey = NonUserInviteData.ShipmentKey;
        const ChatRoomKey = NonUserInviteData.ChatRoomKey;

        ChatRoomMemberPayloadObject = {
          ChatRoomMemberUserKey: UserKey,
          ChatRoomMemberEmail: NonUserInviteData.NonUserInviteEmail
        };

        await admin
          .firestore()
          .collection('Shipment')
          .doc(ShipmentKey)
          .collection('ChatRoom')
          .doc(ChatRoomKey)
          .collection('ChatRoomMember')
          .add(ChatRoomMemberPayloadObject);

        return SetUsedUrlLink;
      }

      if (NonUserInviteData.NonUserInviteType === 'Company') {
        const CompanyKey = NonUserInviteData.CompanyKey;

        CompanyMemberPayloadObject = {
          UserMemberEmail: NonUserInviteData.NonUserInviteEmail,
          UserMemberPosition: NonUserInviteData.CompanyMemberPosition,
          UserMemberRoleName: NonUserInviteData.CompanyMemberRoleName,
          CompanyUserAccessibilityRolePermissionCode:
            NonUserInviteData.CompanyUserAccessibilityRolePermissionCode,
          UserMemberCompanyStandingStatus: 'Active',
          UserMemberJoinedTimestamp: admin.firestore.FieldValue.serverTimestamp()
        };

        await admin
          .firestore()
          .collection('Company')
          .doc(CompanyKey)
          .collection('CompanyMember')
          .doc(UserKey)
          .set(CompanyMemberPayloadObject);

        await admin
          .firestore()
          .collection('UserInfo')
          .doc(UserKey)
          .collection('UserCompany')
          .add({
            UserCompanyReference: admin
              .firestore()
              .collection('Company')
              .doc(CompanyKey),
            UserCompanyTimestamp: admin.firestore.FieldValue.serverTimestamp()
          });

        return SetUsedUrlLink;
      }
    }
  });

exports.ManageShipmentRole = CloudFunctionsRegionsAsia.firestore
  .document('Shipment/{ShipmentKey}/ShipmentRole/{ShipmentRoleKey}')
  .onWrite(async (change, context) => {
    const oldValue = change.before.data();
    const newValue = change.after.data();

    const ShipmentKey = context.params.ShipmentKey;
    const Role = context.params.ShipmentRoleKey;

    const CompanyKey = newValue.ShipmentRoleCompanyKey;

    const GetShipmentData = await admin
      .firestore()
      .collection('Shipment')
      .doc(ShipmentKey)
      .get();

    const ShipmentMember = GetShipmentData.data().ShipmentMember;

    const CompanyMemberList = _.findKey(ShipmentMember, ['ShipmentMemberCompanyKey', CompanyKey]);

    const UpdateCompanyMemberBatch = admin.firestore().batch();

    if (newValue) {
      CompanyMemberList.map(CompanyMemberKey => {
        const ShipmentMemberRef = admin
          .firestore()
          .collection('Shipment')
          .doc(ShipmentKey);
        const MemberKey = `ShipmentMember.${CompanyMemberKey}.ShipmentMemberRole`;
        UpdateCompanyMemberBatch.set(ShipmentMemberRef, { [MemberKey]: Role }, { merge: true });
      });
      return UpdateCompanyMemberBatch.commit();
    } else if (!newValue && oldValue) {
      CompanyMemberList.map(CompanyMemberKey => {
        const ShipmentMemberRef = admin
          .firestore()
          .collection('Shipment')
          .doc(ShipmentKey);
        const MemberKey = `ShipmentMember.${CompanyMemberKey}.ShipmentMemberRole`;
        UpdateCompanyMemberBatch.set(
          ShipmentMemberRef,
          { [MemberKey]: 'No Role' },
          { merge: true }
        );
      });
      return UpdateCompanyMemberBatch.commit();
    }
  });
