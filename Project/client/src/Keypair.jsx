import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex,utf8ToBytes } from "ethereum-cryptography/utils";
import { useState } from "react";
import server from "./server";


function Keys() {
    const [private_key,setPrivateKey] = useState("")//To display New Created Private Key
    const [public_key, setPublicKey] =useState("")//To display New Created Public Key
    const [fund, setFund] = useState(0);//To display Fund That Has Associate With New Public and Private Key

    const createKeys = ()=>{

      let private_key =toHex(secp256k1.utils.randomPrivateKey())
      let public_key = toHex(secp256k1.getPublicKey(private_key))
      setPublicKey(public_key)
      setPrivateKey(private_key)
      let fund =100;
      setFund(fund)
      // Sending The Public And The Fund Associated
      // That Public To Store That On The Server
      // For Using In Ther Further Operation
      server.post('/add',{
        public_key:public_key,
        fund:fund,
      })


    }

    return(<div>
    <h1>Genarate  KeyPairs And Fund</h1>

        <div>
        <p>PrivateKey: 
        </p>
        <p>
        {private_key}
        </p>
        <p>Keep The Private At a Secure Place </p>
        <p>Don't Share It With AnyBody</p>    
        </div>
        <div>
        <p>Public_Key: 
        </p>
        <p>
        {public_key}
        </p>
        <p>Use The Public Key With Other To Get Funds </p>
        <p>Funds: {fund}</p>
        <p>Use This Fund For Sending others </p>     
        </div>
    <input type="submit" className="buttondd" value="Generate KeyPairs" onClick={createKeys}/>
 
  </div>)
    
}



export default Keys;