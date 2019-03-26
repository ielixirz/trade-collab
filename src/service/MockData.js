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