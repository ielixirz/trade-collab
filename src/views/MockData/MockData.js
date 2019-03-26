import React, { useState, useEffect } from 'react'
import { CreateShipment } from '../../service/MockData'

const MockData = () => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        CreateShipment().then( res => {
            console.log(res.id)
        })
      }, []);
    
      return (
        <div>
          <p>You clicked {count} times</p>
          <button onClick={() => setCount(count + 1)}>
            Click me
          </button>
        </div>
      )
  }

  export default MockData;