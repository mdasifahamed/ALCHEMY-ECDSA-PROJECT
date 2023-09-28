import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1.js";
import *as ut from "ethereum-cryptography/utils"
import{sha256} from "ethereum-cryptography/sha256"


BigInt.prototype.toJSON = function () {
  return this.toString();
};


function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  // This State Is Added To let The User Provide The Private key To Sign The Transaction
  const [private_key,setprivatekey] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);


  async function transfer(evt) {
    evt.preventDefault();
    const msghash = sha256(ut.utf8ToBytes(sendAmount))// Hashing The Messagage In this The Amount
    const signature = secp.secp256k1.sign(msghash,private_key)// Signing The Message Using The Private Key

    try {
      // Sending The Signature, Sender Public , Receiver Public , To The Server
      // That's How The Trasactio is made secure with help of Private Key  & Signature
      const {data: { balance },} = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,

      });
     
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0a64asd1566"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <label>
      Provide Your Private Key To Sign The Trasaction In A Secure Way
      <input
        placeholder="Type an address, for example0 35sda54sda..."
        value={private_key}
        onChange={setValue(setprivatekey)}
      ></input>
    </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
