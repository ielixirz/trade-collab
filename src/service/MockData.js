import { FirebaseApp } from './firebase'

const ShipmentMockData = () => {
    const Now = new Date()
    return (
        {
            ShipmentReference : { "RefOwner" : "Seller" , "RefID" : "Ref1234" , "RefTimestampUpdate" : "1234567673242"  } , 
            ShipmentSellerCompanyName : "Holywisdom Co." ,
            ShipmentSourceLocation : "Chiangmai , Thailand" ,
            ShipmentBuyerCompanyName : "CP Co." ,
            ShipmentDestinationLocation : "Bangkok , Thailand" ,
            ShipmentProductName : "Beef A5" ,
            ShipmentETD : Now  ,
            ShipmentETA : Now ,
            ShipmentETAPort : "Aow Thai" ,
            ShipmentETAWarehouse : "Chonburi Warehouse1" ,
            ShipmentStatus : "Shipping" ,
            ShipmentPriceDescription : " N/A" ,
            ShipmentCreatorType : "Importer",
            ShipmentCreatorUserKey : "User1" ,
            ShipmentCreateTimestamp : Now ,
            ShipmentLastestUpdateTimestamp : Now ,
            ShipmentMember : [{ UserKey : "User1" , Premission : "ShipmentOwner"  }, { UserKey : "User2" , Premission : "ShipmentOwner"  } , { UserKey : "User3" , Premission : "See Only"  } ]
        }
    )
}

const ShipmentRefPath = () => {
    return FirebaseApp.firestore().collection(`Shipment`)
}

export const CreateShipment = () => {
    return ShipmentRefPath().add(ShipmentMockData())
}

const ChatRoomMockData = () => {
    return (
        {
            ChatRoomName : "Exporter",
            ChatRoomFileLink :
                [ {FileName : "FileA.jpg" , FileUrl : "'https://firebasestorage.googleapis.com'" , FileCreateTimestamp : "123123124124124" , FilePath : "/Shipment/{ShipmentKey}/ShipmentFile/{FileKey}" }] ,
            ChatRoomMember : {},
            ChatRoomParticipleNotificationToken : [],
            ChatRoomhareDataList :
                ['Shipper','ShipmentDetail'],
            ChatRoomPrivateShareDataList :
                ['Trucking']
        }
    )
}

const ChatRoomRefPath = (ShipmentKey) => {
    return FirebaseApp.firestore().collection(`Shipment`).doc(ShipmentKey).collection(`ChatRoom`)
}

export const CreateChatRoom = (ShipmentKey,Data) => {
    return ChatRoomRefPath(ShipmentKey).add(ChatRoomMockData())
}

const ChatRoomPrivateShareDataMockData = () => {
    return ({})
}

const ChatRoomPrivateShareDataRefPath = (ShipmentKey,ChatRoomKey,GroupName) => {
    return FirebaseApp.firestore().collection(`Shipment`).doc(ShipmentKey).collection(`ChatRoom`).doc(ChatRoomKey).collection(`ChatRoomPrivateShareData`).doc(GroupName)
}

export const CreateChatRoomPrivateShareData = (ShipmentKey,ChatRoomKey,GroupName) => {
    return ChatRoomPrivateShareDataRefPath(ShipmentKey,ChatRoomKey,GroupName).set(ChatRoomPrivateShareDataMockData(),{merge:true})
}

const ChatRoomMessageMockData = (ProfileKey) => {
    return ({
            ChatRoomMessageSender : ProfileKey,
            ChatRoomMessageContext : "หวัดดีครับ",
            ChatRoomMessageType : "Text", 
            ChatRoomMessageTimestamp : new Date()
        })
}

const ChatRoomMessageRefPath = (ShipmentKey,ChatRoomKey) => {
    return FirebaseApp.firestore().collection(`Shipment`).doc(ShipmentKey).collection(`ChatRoom`).doc(ChatRoomKey).collection(`ChatRoomMessage`)
}

export const CreateChatRoomMessage = (ShipmentKey,ChatRoomKey,ProfileKey) => {
    return ChatRoomMessageRefPath(ShipmentKey,ChatRoomKey).add(ChatRoomMessageMockData(ProfileKey))
}

const UserInfoMockData = () => {
    const Now = new Date()
    return (
        {
            UserInfoUsername : "Holywisdom",
            UserInfoEmail : "holy-wisdom@hotmail.com" ,
            UserInfoBio : `I'll be sippin sippin, mixing mixing, smoking smoking
                            I'll be rollin rollin that's how my life go` ,
            UserInfoProfileImageLink : "https://firebasestorage.googleapis.com/v0/b/yterminal-b0906.appspot.com/o/%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B8%88%E0%B8%AD%202562-01-01%20%E0%B9%80%E0%B8%A7%E0%B8%A5%E0%B8%B2%2023.44.49.png?alt=media&token=6e105bbe-3cac-42dc-a166-590d5f23aff5" ,
            UserInfoCreateTimestamp : Now , 
            UserInfoAccountType : "Exporter" ,
            UserInfoCompanyName : "Holywisdom Co." ,
            UserInfoCompanyRelate : "Export beef" ,
            UserInfoNotificationToken : []
        }
    )
} 

const UserInfoRefPath = () => {
    return FirebaseApp.firestore().collection(`UserInfo`)
}

export const CreateUserInfo = (Data) => {
    return UserInfoRefPath().add(UserInfoMockData())
}

const CompanyMockData = () => {
    return (
        {
            CompanyName : "Holywisdom Co." ,
            CompanyID : "holywisdom-co" ,
            CompanyImageLink : "" ,
            CompanyTelNumber : "+66910679631" ,
            CompanyAddress : "cnx , thailand 50130" ,
            CompanyWebsiteUrl : "https://www.facebook.com/thanongkiat.tamtai" ,
            CompanyEmail : "holy-wisdom@hotmail.com" ,
            CompanyAboutUs : `และจะเก็บเอาไว้ให้เธอแบบนี้
                                ไม่ว่านานแค่ไหนจะดูอย่างดี
                                เผื่อว่าตอนเช้าๆเธอจะได้ไม่เหงาเวลาไม่มีใครเป็นเพื่อนเธออย่างฉันอีก บางเวลาที่เธอกังวล
                                ถึงเขา ไม่ต้องคิดให้วุ่นวายไม่ต้องเหงาในอากาศดีๆ`
        }
    )
}

const CompanyRefPath = () => {
    return FirebaseApp.firestore().collection(`Company`)
}

export const CreateCompany = (Data) => {
    return CompanyRefPath().add(CompanyMockData())
}

const ProfileMockData = () => {
    return (
        {
            ProfileFirstname : "Thanongkiat" ,
            ProfileSurname : "Tamtai" ,
            ProfileName : "Top1" , 
            ProfileEmail : "holy-wisdom@hotmail.com" ,
            ProfileProfileImageLink : "https://firebasestorage.googleapis.com/v0/b/yterminal-b0906.appspot.com/o/%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B8%88%E0%B8%AD%202562-01-01%20%E0%B9%80%E0%B8%A7%E0%B8%A5%E0%B8%B2%2023.44.49.png?alt=media&token=6e105bbe-3cac-42dc-a166-590d5f23aff5" ,
            ProfileNotificationToken : []
        }
    )
}

const ProfileRefPath = (UserInfoKey) => {
    return FirebaseApp.firestore().collection(`UserInfo`).doc(UserInfoKey).collection(`Profile`)
}

export const CreateProfile = (UserInfoKey,Data) => {
    return ProfileRefPath(UserInfoKey).add(ProfileMockData())
}

const MasterDataMockData = (GroupName) => {

    switch (GroupName) {
        case 'Shipper' :
            return ({
                ShipperCompanyName: "",
                ShipperPier: "",
                ShipperDate: new Date()
            })

        case 'ShipmentDetail' :
            return ({
                ShipmentDetailProduct : "",
                ShipmentDetailContainerNumber : "",
                ShipmentDetailBillofLandingNumber : "",
                ShipmentDetailOriginalDocumentTrackingNumber : "",
                ShipmentDetailNote : ""
            })

        case 'Consignee' :
            return ({
                ConsigneeCompanyName : "",
                ConsigneePier : "",
                ConsigneeDate : new Date()
            })

        default: 
            return {}
    }
}

const MasterDataRefPath = (GroupName) => {
    return FirebaseApp.firestore().collection(`MasterData`).doc(GroupName)
}

export const CreateMasterData = (GroupName) => {
    return MasterDataRefPath(GroupName).set(MasterDataMockData(GroupName))
}

const ShipmentShareListMockData = () => {
    return ({ 'ShipmentShareList' : ['Shipper','ShipmentDetail','Consignee']})
}

const ShipmentShareListRefPath = (ShipmentKey) => {
    return FirebaseApp.firestore().collection(`Shipment`).doc(ShipmentKey)
}

export const CreateShipmentShareList = (ShipmentKey) => {
    return ShipmentShareListRefPath(ShipmentKey).set(ShipmentShareListMockData(),{merge:true})
}

const ShipmentShareDataMockData = (GroupName) => {
    switch (GroupName) {
        case 'Shipper' :
            return ({
                ShipperCompanyName: "Holywisdom Co.",
                ShipperPier: "Ping River",
                ShipperDate: new Date()
            })

        case 'ShipmentDetail' :
            return ({
                ShipmentDetailProduct : "Beef A5 from japan ",
                ShipmentDetailContainerNumber : "Con001xJp",
                ShipmentDetailBillofLandingNumber : "B11254820",
                ShipmentDetailOriginalDocumentTrackingNumber : "TH16394u5jd9",
                ShipmentDetailNote : ""
            })

        case 'Consignee' :
            return ({
                ConsigneeCompanyName : "CP Co.",
                ConsigneePier : "Chonburi Pier",
                ConsigneeDate : new Date()
            })

        default: 
            return {}
    }
}

const ShipmentShareDataRefPath = (ShipmentKey,GroupName) => {
    return FirebaseApp.firestore().collection(`Shipment`).doc(ShipmentKey).collection(`ShipmentShareData`).doc(GroupName)
}

export const CreateShipmentShareData = (ShipmentKey,GroupName) => {
    return ShipmentShareDataRefPath(ShipmentKey,GroupName).set(ShipmentShareDataMockData(GroupName),{merge:true})
}

const ShipmentFileMockData = () => {
    return ({
        FileName : "ภาพหน้าจอ 2562-01-14 เวลา 17.35.00.png",
        FileUrl : "https://firebasestorage.googleapis.com/v0/b/yterminal-b0906.appspot.com/o/Shipment%2FHDTPONlnceJeG5yAA1Zy%2F%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B8%88%E0%B8%AD%202562-01-14%20%E0%B9%80%E0%B8%A7%E0%B8%A5%E0%B8%B2%2017.35.00.png?alt=media&token=28d9a23e-174b-41fe-9c1c-bb5ad9d33364",
        FileCreateTimestamp : new Date(),
        FileOwnerKey : "aE5lNgaD1bcf3OHeQR3P",
        FileStorgeReference : "gs://yterminal-b0906.appspot.com/Shipment/HDTPONlnceJeG5yAA1Zy/ภาพหน้าจอ 2562-01-14 เวลา 17.35.00.png",
    })
}

const ShipmentFileRefPath = (ShipmentKey) => {
    return FirebaseApp.firestore().collection(`Shipment`).doc(ShipmentKey).collection(`ShipmentFile`)
}

export const CreateShipmentFile = (ShipmentKey) => {
    return ShipmentFileRefPath(ShipmentKey).add(ShipmentFileMockData())
}

