// eslint-disable-next-line filenames/match-exported
import React, { useState, useEffect } from 'react';
import { GetChatMessage, CreateChatMessage, GetChatRoomList } from '../../service/chat/chat';
import { LoginWithEmail } from '../../service/auth/login';
import { VerificationEmail, AuthStage } from '../../service/auth/manageuser';
import { Register, RegisterWithEmail } from '../../service/auth/register';
import { UpdateUserInfo, GetUserCompany } from '../../service/user/user';
import { GetShipmentList } from '../../service/shipment/shipment';
import { GetMasterDataChatRoom } from '../../service/masterdata/masterdata';
import {
  CreateCompanyMultipleInvitation,
  CreateChatMultipleInvitation,
  IsExistInvitation,
} from '../../service/join/invite';
import { GetProfileListFromEmail } from '../../service/user/profile';

import { IsCompanyMember } from '../../service/company/company';

const TestService = () => {
  const [count, setCount] = useState(0);

  const ShipmentKey = 'HDTPONlnceJeG5yAA1Zy';
  const ChatRoomKey = 'lvCb608c7PusGqptBsq0';

  const UserInfoKey = 'aE5lNgaD1bcf3OHeQR3P';
  const ProfileKey = '3Ntt1SClkYCwOZXnLkKl';

  const CompanyKey = 'LuX49vebvTP7U3tSAq0d';

  const M1 = {
    ChatRoomMessageSender: ProfileKey,
    ChatRoomMessageContext: 'น่าร๊ากกกก',
    ChatRoomMessageType: 'Text',
    ChatRoomMessageTimestamp: new Date(),
  };

  useEffect(() => {
    // CreateChatMessage(ShipmentKey,ChatRoomKey,M1).then(res => {
    //   return res.id
    // }).catch(err => {
    //   console.log(`error message : ${err}`)
    //   return err
    // })
    // GetChatMessage(ShipmentKey,ChatRoomKey).subscribe(console.log)
    // LoginWithEmail('holy-wisdom@hotmail.com','123456').then(res =>{
    //   console.log(res)}).catch(err => {
    //       console.log(`error message : ${err}`)
    //       return err
    // })
    // LoginWithEmail('holy-wisdom@hotmail.com','123456').subscribe({
    //   next:(res) => {(console.log(res))},
    //   error:(err) => {(console.log(err))},
    //   complete:() => {}
    // })
    // VerificationEmail().subscribe({
    //   next:() => {(console.log('Email sended'))},
    //   error:(err) => {(console.log(err))},
    //   complete:() => {}
    // })
    // AuthStage().subscribe(res => {
    // })
    // GetChatRoomList(ShipmentKey).subscribe(console.log)
    //   const UserInfoData = {
    //     UserInfoEmail: "Email@email.com",
    //     UserInfoAccountType: "AccountType"
    // }
    // UpdateUserInfo("wozF6KKfDhfHBHU8vuSAxpQbEqP2",UserInfoData)
    // Register({Email:"test1@gmail.com",Password:"123456789",Firstname:"Top", Surname:"Top", AccountType:"Exporter"}).subscribe(console.log)
    // Only QueryFieldName Case
    // GetShipmentList('','ShipmentSellerCompanyName','asc').subscribe(console.log)
    // GetShipmentList('','ShipmentSellerCompanyName','desc').subscribe(console.log)
    // GetShipmentList('','ShipmentBuyerCompanyName','asc').subscribe(console.log)
    // GetShipmentList('','ShipmentBuyerCompanyName','desc').subscribe(console.log)
    // GetShipmentList('','ShipmentETD','asc').subscribe(console.log)
    // GetShipmentList('','ShipmentETD','desc').subscribe(console.log)
    // GetShipmentList('','ShipmentETAPort','asc').subscribe(console.log)
    // GetShipmentList('','ShipmentETAPort','desc').subscribe(console.log)
    // GetShipmentList('','ShipmentETAWarehouse','asc').subscribe(console.log)
    // GetShipmentList('','ShipmentETAWarehouse','desc').subscribe(console.log)
    // QueryStatus and QueryFieldName Case
    // GetShipmentList('Planning','ShipmentSellerCompanyName','asc').subscribe(console.log)
    // GetShipmentList('Planning','ShipmentSellerCompanyName','desc').subscribe(console.log)
    // GetShipmentList('Planning','ShipmentBuyerCompanyName','asc').subscribe(console.log)
    // GetShipmentList('Planning','ShipmentBuyerCompanyName','desc').subscribe(console.log)
    // GetShipmentList('Planning','ShipmentETD','asc').subscribe(console.log)
    // GetShipmentList('Planning','ShipmentETD','desc').subscribe(console.log)
    // GetShipmentList('Planning','ShipmentETAPort','asc').subscribe(console.log)
    // GetShipmentList('Planning','ShipmentETAPort','desc').subscribe(console.log)
    // GetShipmentList('Planning','ShipmentETAWarehouse','asc').subscribe(console.log)
    // GetShipmentList('Planning','ShipmentETAWarehouse','desc').subscribe(console.log)
    // QueryStatus Case
    // GetShipmentList('Planning','','').subscribe(res => {
    //   console.log(res.map( d => d.data()))
    // })
    // GetShipmentList(null,null,'').subscribe(console.log)
    // Test Master Data
    // /Shipment/0eoacRfk5QFTTBAg2SS3/ChatRoom/NDYDyonv15IlkpZsK9kt
    // GetMasterDataChatRoom('0eoacRfk5QFTTBAg2SS3', 'NDYDyonv15IlkpZsK9kt');
    // const ColleaguesDataList = [
    //   {
    //     Email: 'holy-wisdom@hotmail.com',
    //     Role: 'Admin',
    //     Position: 'CEO',
    //   },
    //   {
    //     Email: 'importerMock@mi.com',
    //     Role: 'Inputer',
    //     Position: 'Employee',
    //   },
    // ];
    // const ChatMemberDataList = [
    //   {
    //     Email: 'holy-wisdom@hotmail.com',
    //     Role: 'Importer',
    //   },
    //   {
    //     Email: 'importerMock@mi.com',
    //     Role: 'Exporter',
    //   },
    // ];
    // CreateMultipleInvitation(ColleaguesDataList, '92f7ICOn95jQyMp4oJTv').subscribe(console.log);
    // GetProfileListFromEmail('importerMock@mi.com').subscribe(console.log);
    // CreateChatMultipleInvitation(
    //   ChatMemberDataList,
    //   '0eoacRfk5QFTTBAg2SS3',
    //   't0RHSAlC2aMRcEHZ9oI5',
    // ).subscribe(console.log);
    // IsExistInvitation('A0qO6SZakZ1jqZor6ara', '92f7ICOn95jQyMp4oJTv').subscribe(console.log);
    // IsCompanyMember('92f7ICOn95jQyMp4oJTv', 'A0qO6SZakZ1jqZor6ara').subscribe(console.log);
    // GetUserCompany('nen3b2GCqSQIUyTHuFret0Yx9f02').subscribe(console.log);
  }, []);

  return (
    <div>
      <h1>Test Service Component</h1>
    </div>
  );
};

export default TestService;
