import React, { useState, useEffect } from 'react'
import { GetChatMessage, CreateChatMessage } from '../../service/chat/chat'


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


      }, []);
    
      return (
        <div>
          <h1>Test Service Component</h1>


        </div>
      )
  }

  export default TestService;