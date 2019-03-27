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