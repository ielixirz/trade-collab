import React, { useState, useEffect } from 'react'
import { CreateShipment, CreateChatRoom, CreateUserInfo, CreateCompany } from '../../service/MockData'

const MockData = () => {
    const [count, setCount] = useState(0)

    const ShipmentKey = 'HDTPONlnceJeG5yAA1Zy'
    const ChatRoomKey = 'lvCb608c7PusGqptBsq0'

    const UserInfoKey = 'aE5lNgaD1bcf3OHeQR3P'

    const CompanyKey = 'LuX49vebvTP7U3tSAq0d'

    useEffect(() => {
        // CreateShipment

        // CreateShipment().then( res => {
        //     console.log(res.id)
        // })

        // CreateChatRoom

        // CreateChatRoom(ShipmentKey).then( res => {
        //     console.log(res.id)
        // })

        // CreateUserInfo

        // CreateUserInfo().then( res => {
        //     console.log(res.id)
        // })

        // CreateCompany

        // CreateCompany().then( res => {
        //     console.log(res.id)
        // })

      }, []);
    
      return (
        <div>
          {/* <p>You clicked {count} times</p>
          <button onClick={() => setCount(count + 1)}>
            Click me
          </button> */}
          <h1>Mock Data Component</h1>

        </div>
      )
  }

  export default MockData;