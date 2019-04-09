import { FirebaseApp } from './firebase';

const ShipmentMockData = () => {
  const Now = new Date();
  return (
    {
      ShipmentReference: { RefOwner: 'Seller', RefID: 'Ref1234', RefTimestampUpdate: '1234567673242' },
      ShipmentSellerCompanyName: 'Holywisdom Co.',
      ShipmentSourceLocation: 'Chiangmai , Thailand',
      ShipmentBuyerCompanyName: 'CP Co.',
      ShipmentDestinationLocation: 'Bangkok , Thailand',
      ShipmentProductName: 'Beef A5',
      ShipmentETD: Now,
      ShipmentETA: Now,
      ShipmentETAPort: 'Aow Thai',
      ShipmentETAWarehouse: 'Chonburi Warehouse1',
      ShipmentStatus: 'Shipping',
      ShipmentPriceDescription: ' N/A',
      ShipmentCreatorType: 'Importer',
      ShipmentCreatorUserKey: 'User1',
      ShipmentCreateTimestamp: Now,
      ShipmentLastestUpdateTimestamp: Now,
      ShipmentMember: [{ UserKey: 'User1', Premission: 'ShipmentOwner' }, { UserKey: 'User2', Premission: 'ShipmentOwner' }, { UserKey: 'User3', Premission: 'See Only' }],
    }
  );
};

const ShipmentRefPath = () => FirebaseApp.firestore().collection('Shipment');

export const CreateShipment = () => ShipmentRefPath().add(ShipmentMockData());

const ChatRoomMockData = () => (
  {
    ChatRoomName: 'Exporter',
    ChatRoomFileLink:
                [{
                  FileName: 'FileA.jpg', FileUrl: "'https://firebasestorage.googleapis.com'", FileCreateTimestamp: '123123124124124', FilePath: '/Shipment/{ShipmentKey}/ShipmentFile/{FileKey}',
                }],
    ChatRoomMember: {},
    ChatRoomParticipleNotificationToken: [],
    ChatRoomhareDataList:
                ['Shipper', 'ShipmentDetail'],
    ChatRoomPrivateShareDataList:
                ['Trucking'],
  }
);

const ChatRoomRefPath = ShipmentKey => FirebaseApp.firestore().collection('Shipment').doc(ShipmentKey).collection('ChatRoom');

export const CreateChatRoom = (ShipmentKey, Data) => ChatRoomRefPath(ShipmentKey).add(ChatRoomMockData());

const ChatRoomPrivateShareDataMockData = () => ({});

const ChatRoomPrivateShareDataRefPath = (ShipmentKey, ChatRoomKey, GroupName) => FirebaseApp.firestore().collection('Shipment').doc(ShipmentKey).collection('ChatRoom')
  .doc(ChatRoomKey)
  .collection('ChatRoomPrivateShareData')
  .doc(GroupName);

export const CreateChatRoomPrivateShareData = (ShipmentKey, ChatRoomKey, GroupName) => ChatRoomPrivateShareDataRefPath(ShipmentKey, ChatRoomKey, GroupName).set(ChatRoomPrivateShareDataMockData(), { merge: true });

const ChatRoomMessageMockData = ProfileKey => ({
  ChatRoomMessageSender: ProfileKey,
  ChatRoomMessageContext: 'หวัดดีครับ',
  ChatRoomMessageType: 'Text',
  ChatRoomMessageTimestamp: new Date(),
});

const ChatRoomMessageRefPath = (ShipmentKey, ChatRoomKey) => FirebaseApp.firestore().collection('Shipment').doc(ShipmentKey).collection('ChatRoom')
  .doc(ChatRoomKey)
  .collection('ChatRoomMessage');

export const CreateChatRoomMessage = (ShipmentKey, ChatRoomKey, ProfileKey) => ChatRoomMessageRefPath(ShipmentKey, ChatRoomKey).add(ChatRoomMessageMockData(ProfileKey));

const UserInfoMockData = () => {
  const Now = new Date();
  return (
    {
      UserInfoUsername: 'Holywisdom',
      UserInfoEmail: 'holy-wisdom@hotmail.com',
      UserInfoBio: `I'll be sippin sippin, mixing mixing, smoking smoking
                            I'll be rollin rollin that's how my life go`,
      UserInfoProfileImageLink: 'https://firebasestorage.googleapis.com/v0/b/yterminal-b0906.appspot.com/o/%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B8%88%E0%B8%AD%202562-01-01%20%E0%B9%80%E0%B8%A7%E0%B8%A5%E0%B8%B2%2023.44.49.png?alt=media&token=6e105bbe-3cac-42dc-a166-590d5f23aff5',
      UserInfoCreateTimestamp: Now,
      UserInfoAccountType: 'Exporter',
      UserInfoCompanyName: 'Holywisdom Co.',
      UserInfoCompanyRelate: 'Export beef',
      UserInfoNotificationToken: [],
    }
  );
};

const UserInfoRefPath = () => FirebaseApp.firestore().collection('UserInfo');

export const CreateUserInfo = Data => UserInfoRefPath().add(UserInfoMockData());

const CompanyMockData = () => (
  {
    CompanyName: 'Holywisdom Co.',
    CompanyID: 'holywisdom-co',
    CompanyImageLink: '',
    CompanyTelNumber: '+66910679631',
    CompanyAddress: 'cnx , thailand 50130',
    CompanyWebsiteUrl: 'https://www.facebook.com/thanongkiat.tamtai',
    CompanyEmail: 'holy-wisdom@hotmail.com',
    CompanyAboutUs: `และจะเก็บเอาไว้ให้เธอแบบนี้
                                ไม่ว่านานแค่ไหนจะดูอย่างดี
                                เผื่อว่าตอนเช้าๆเธอจะได้ไม่เหงาเวลาไม่มีใครเป็นเพื่อนเธออย่างฉันอีก บางเวลาที่เธอกังวล
                                ถึงเขา ไม่ต้องคิดให้วุ่นวายไม่ต้องเหงาในอากาศดีๆ`,
  }
);

const CompanyRefPath = () => FirebaseApp.firestore().collection('Company');

export const CreateCompany = Data => CompanyRefPath().add(CompanyMockData());

const ProfileMockData = () => (
  {
    ProfileFirstname: 'Thanongkiat',
    ProfileSurname: 'Tamtai',
    ProfileName: 'Top1',
    ProfileEmail: 'holy-wisdom@hotmail.com',
    ProfileProfileImageLink: 'https://firebasestorage.googleapis.com/v0/b/yterminal-b0906.appspot.com/o/%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B8%88%E0%B8%AD%202562-01-01%20%E0%B9%80%E0%B8%A7%E0%B8%A5%E0%B8%B2%2023.44.49.png?alt=media&token=6e105bbe-3cac-42dc-a166-590d5f23aff5',
    ProfileNotificationToken: [],
  }
);

const ProfileRefPath = UserInfoKey => FirebaseApp.firestore().collection('UserInfo').doc(UserInfoKey).collection('Profile');

export const CreateProfile = (UserInfoKey, Data) => ProfileRefPath(UserInfoKey).add(ProfileMockData());

const MasterDataMockData = (GroupName) => {
  switch (GroupName) {
    case 'Shipper':
      return ({
        ShipperCompanyName: '',
        ShipperPier: '',
        ShipperDate: new Date(),
      });

    case 'ShipmentDetail':
      return ({
        ShipmentDetailProduct: '',
        ShipmentDetailContainerNumber: '',
        ShipmentDetailBillofLandingNumber: '',
        ShipmentDetailOriginalDocumentTrackingNumber: '',
        ShipmentDetailNote: '',
      });

    case 'Consignee':
      return ({
        ConsigneeCompanyName: '',
        ConsigneePier: '',
        ConsigneeDate: new Date(),
      });

    default:
      return {};
  }
};

const MasterDataRefPath = GroupName => FirebaseApp.firestore().collection('MasterData').doc(GroupName);

export const CreateMasterData = GroupName => MasterDataRefPath(GroupName).set(MasterDataMockData(GroupName));

const ShipmentShareListMockData = () => ({ ShipmentShareList: ['Shipper', 'ShipmentDetail', 'Consignee'] });

const ShipmentShareListRefPath = ShipmentKey => FirebaseApp.firestore().collection('Shipment').doc(ShipmentKey);

export const CreateShipmentShareList = ShipmentKey => ShipmentShareListRefPath(ShipmentKey).set(ShipmentShareListMockData(), { merge: true });

const ShipmentShareDataMockData = (GroupName) => {
  switch (GroupName) {
    case 'Shipper':
      return ({
        ShipperCompanyName: 'Holywisdom Co.',
        ShipperPier: 'Ping River',
        ShipperDate: new Date(),
      });

    case 'ShipmentDetail':
      return ({
        ShipmentDetailProduct: 'Beef A5 from japan ',
        ShipmentDetailContainerNumber: 'Con001xJp',
        ShipmentDetailBillofLandingNumber: 'B11254820',
        ShipmentDetailOriginalDocumentTrackingNumber: 'TH16394u5jd9',
        ShipmentDetailNote: '',
      });

    case 'Consignee':
      return ({
        ConsigneeCompanyName: 'CP Co.',
        ConsigneePier: 'Chonburi Pier',
        ConsigneeDate: new Date(),
      });

    default:
      return {};
  }
};

const ShipmentShareDataRefPath = (ShipmentKey, GroupName) => FirebaseApp.firestore().collection('Shipment').doc(ShipmentKey).collection('ShipmentShareData')
  .doc(GroupName);

export const CreateShipmentShareData = (ShipmentKey, GroupName) => ShipmentShareDataRefPath(ShipmentKey, GroupName).set(ShipmentShareDataMockData(GroupName), { merge: true });

const ShipmentFileMockData = () => ({
  FileName: 'ภาพหน้าจอ 2562-01-14 เวลา 17.35.00.png',
  FileUrl: 'https://firebasestorage.googleapis.com/v0/b/yterminal-b0906.appspot.com/o/Shipment%2FHDTPONlnceJeG5yAA1Zy%2F%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B8%88%E0%B8%AD%202562-01-14%20%E0%B9%80%E0%B8%A7%E0%B8%A5%E0%B8%B2%2017.35.00.png?alt=media&token=28d9a23e-174b-41fe-9c1c-bb5ad9d33364',
  FileCreateTimestamp: new Date(),
  FileOwnerKey: 'aE5lNgaD1bcf3OHeQR3P',
  FileStorgeReference: 'gs://yterminal-b0906.appspot.com/Shipment/HDTPONlnceJeG5yAA1Zy/ภาพหน้าจอ 2562-01-14 เวลา 17.35.00.png',
});

const ShipmentFileRefPath = ShipmentKey => FirebaseApp.firestore().collection('Shipment').doc(ShipmentKey).collection('ShipmentFile');

export const CreateShipmentFile = ShipmentKey => ShipmentFileRefPath(ShipmentKey).add(ShipmentFileMockData());

const UserInvitationMockData = () => ({
  CompanyInvitationReference: FirebaseApp.firestore().collection('Company').doc('CompanyKey'),
  CompanyInvitationCompanyKey: 'CompanyKey',
  CompanyInvitationName: 'Apple Co.',
  CompanyInvitationEmail: 'Apple@icloud.com',
  CompanyInvitationPosition: 'CEO',
  CompanyInvitationRole: 'Admin',
  CompanyInvitationTimestamp: new Date(),
  CompanyInvitationStatus: 'Pending',
});

const UserInvitationRefPath = UserInfoKey => FirebaseApp.firestore().collection('UserInfo').doc(UserInfoKey).collection('UserInvitation');

export const CreateUserInvitation = UserInfoKey => UserInvitationRefPath(UserInfoKey).add(UserInvitationMockData());

const UserRequestMockData = () => ({
  CompanyRequestReference: FirebaseApp.firestore().collection('Company').doc('CompanyKey'),
  CompanyRequestCompanyKey: 'CompanyKey',
  CompanyRequestCompanyName: 'Apple Co.',
  CompanyRequestNote: 'Plese let me in',
  CompanyRequestTimestamp: new Date(),
  CompanyRequestStatus: 'Pending',
});

const UserRequestRefPath = UserInfoKey => FirebaseApp.firestore().collection('UserInfo').doc(UserInfoKey).collection('UserRequest');

export const CreateUserRequest = UserInfoKey => UserRequestRefPath(UserInfoKey).add(UserRequestMockData());

const UserShipmentMockData = ShipmentKey => ({
  UserShipmentReference: FirebaseApp.firestore().collection('Shipment').doc(ShipmentKey),
  UserShipmentTimestamp: new Date(),
});

const UserShipmentRefPath = UserInfoKey => FirebaseApp.firestore().collection('UserInfo').doc(UserInfoKey).collection('UserShipment');

export const CreateUserShipment = (UserInfoKey, ShipmentKey) => UserShipmentRefPath(UserInfoKey).add(UserShipmentMockData(ShipmentKey));

const UserChatRoomMockData = (ShipmentKey, ChatRoomKey) => ({
  UserChatRoomReference: FirebaseApp.firestore().collection('Shipment').doc(ShipmentKey).collection('ChatRoom')
    .doc(ChatRoomKey),
  UserChatRoomTimestamp: new Date(),
  UserChatRoomLastestTimestamp: new Date(),
});

const UserChatRoomRefPath = UserInfoKey => FirebaseApp.firestore().collection('UserInfo').doc(UserInfoKey).collection('UserChatRoom');

export const CreateUserChatRoom = (UserInfoKey, ShipmentKey, ChatRoomKey) => UserChatRoomRefPath(UserInfoKey).add(UserChatRoomMockData(ShipmentKey, ChatRoomKey));

const CompanyMemberMockData = () => ({
  UserMemberEmail: 'holy-wisdom@ghotmail.com',
  UserMemberPosition: 'CEO',
  UserMemberRoleName: 'Admin',
  UserMatrixRolePermissionCode: '11111111',
  UserMemberCompanyStandingStatus: 'Joined',
  UserMemberJoinedTimestamp: new Date(),
});

const CompanyMemberRefPath = CompanyKey => FirebaseApp.firestore().collection('Company').doc(CompanyKey).collection('CompanyMember');

export const CreateCompanyMember = CompanyKey => CompanyMemberRefPath(CompanyKey).add(CompanyMemberMockData());

const CompanyInvitationMockData = UserInfoKey => ({
  UserInvitationReference: FirebaseApp.firestore().collection('UserInfo').doc(UserInfoKey),
  UserInvitationUserKey: UserInfoKey,
  UserInvitationCompanyKey: 'CompanyKey',
  UserInvitationFristname: 'Thanongkiat',
  UserInvitationSurname: 'Tamtai',
  UserInvitationEmail: 'holy-wisdom@hotmail.com',
  UserInvitationPosition: 'CEO',
  UserInvitationRole: 'Admin',
  UserInvitationTimestamp: new Date(),
  UserInvitationStatus: 'Pending',
});

const CompanyInvitationRefPath = CompanyKey => FirebaseApp.firestore().collection('Company').doc(CompanyKey).collection('CompanyInvitation');

export const CreateCompanyInvitation = (CompanyKey, UserInfoKey) => CompanyInvitationRefPath(CompanyKey).add(CompanyInvitationMockData(UserInfoKey));

const CompanyRequestMockData = (CompanyKey, UserInfoKey) => ({
  UserRequestReference: FirebaseApp.firestore().collection('UserInfo').doc(UserInfoKey),
  UserRequestKey: 'UserRequestKey',
  UserRequestUserKey: UserInfoKey,
  UserRequestCompanyKey: CompanyKey,
  UserRequestFristname: 'Thanongkait',
  UserRequestSurname: 'Tamtai',
  UserRequestEmail: 'holy-wisdom@hotmail.com',
  UserRequestNote: 'Plese let me in',
  UserRequestTimestamp: new Date(),
  UserInvitationStatus: 'Approve',
});

const CompanyRequestRefPath = CompanyKey => FirebaseApp.firestore().collection('Company').doc(CompanyKey).collection('CompanyRequest');

export const CreateCompanyRequest = (CompanyKey, UserInfoKey) => CompanyRequestRefPath(CompanyKey).add(CompanyRequestMockData(CompanyKey, UserInfoKey));


const CompanyUserMatrixMockdata = () => ({
  CompanyUserMatrixRoleName: 'Admin',
  CompanyUserMatrixRolePermissionCode: '11111111',
});

const CompanyUserMatrixRefPath = CompanyKey => FirebaseApp.firestore().collection('Company').doc(CompanyKey).collection('CompanyUserMatrix');

export const CreateCompanyUserMatrix = CompanyKey => CompanyUserMatrixRefPath(CompanyKey).add(CompanyUserMatrixMockdata());

const UserPersonalizeShipmentOrderingMockData = () => ({
  ChatRoomOrdering: ['Internal', 'Exporter', 'Customer', 'Trucking'],
});

const UserPersonalizeShipmentOrderingRefPath = (ProfileKey, ShipmentKey) => FirebaseApp.firestore().collection('UserPersonalize').doc(ProfileKey).collection('ShipmentOrdering')
  .doc(ShipmentKey);

export const CreateUserPersonalizeShipmentOrdering = (ProfileKey, ShipmentKey) => UserPersonalizeShipmentOrderingRefPath(ProfileKey, ShipmentKey).set(UserPersonalizeShipmentOrderingMockData());

const UserPersonalizeShipmentPinMockData = ShipmentKey => ({
  ShipmentPin: [ShipmentKey],
});

const UserPersonalizeShipmentPinRefPath = (ProfileKey, ShipmentKey) => FirebaseApp.firestore().collection('UserPersonalize').doc(ProfileKey).collection('ShipmentPin')
  .doc(ShipmentKey);

export const CreateUserPersonalizeShipmentPin = (ProfileKey, ShipmentKey) => UserPersonalizeShipmentPinRefPath(ProfileKey, ShipmentKey).set(UserPersonalizeShipmentPinMockData(ShipmentKey));

const UserPersonalizeShipmentReferenceDisplayMockData = () => ({
  ShipmentReferenceSelect: 'Seller',
});

const UserPersonalizeShipmentReferenceDisplayRefPath = (ProfileKey, ShipmentKey) => FirebaseApp.firestore().collection('UserPersonalize').doc(ProfileKey).collection('ShipmentReferenceDisplay')
  .doc(ShipmentKey);

export const CreateUserPersonalizeShipmentReferenceDisplay = (ProfileKey, ShipmentKey) => UserPersonalizeShipmentReferenceDisplayRefPath(ProfileKey, ShipmentKey).set(UserPersonalizeShipmentReferenceDisplayMockData());
