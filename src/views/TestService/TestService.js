import React, { useState, useEffect } from 'react'
import { GetChatMessage, CreateChatMessage } from '../../service/Chat/Chat'
import { LoginWithEmail } from '../../service/Auth/Login'
import { VerificationEmail, AuthStage } from '../../service/Auth/ManageUser'


const TestService = () => {
    const [count, setCount] = useState(0)

    const ShipmentKey = 'HDTPONlnceJeG5yAA1Zy'
    const ChatRoomKey = 'lvCb608c7PusGqptBsq0'

    const UserInfoKey = 'aE5lNgaD1bcf3OHeQR3P'
    const ProfileKey = '3Ntt1SClkYCwOZXnLkKl'

    const CompanyKey = 'LuX49vebvTP7U3tSAq0d'

    const M1 = {
      ChatRoomMessageSender : ProfileKey,
      ChatRoomMessageContext : "น่าร๊ากกกก",
      ChatRoomMessageType : "Text", 
      ChatRoomMessageTimestamp : new Date()
    }


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

      }, []);
    
      return (
        <div>
          <h1>Test Service Component</h1>


        </div>
      )
  }

  export default TestService;