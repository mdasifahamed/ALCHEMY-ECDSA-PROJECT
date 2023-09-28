const express = require("express");
const {secp256k1} =require("ethereum-cryptography/secp256k1")
const{sha256} = require("ethereum-cryptography/sha256")
const{toHex,utf8ToBytes} = require("ethereum-cryptography/utils")
const app = express();
const cors = require("cors");
const port = 3042;


app.use(cors());
app.use(express.json());
// Empty Object To Store Public Key And Amount of The Corroesponding Public key as key valu pair
const balances = {
 
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount,signature } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  /*
    The Signature that come client side need to convert it to its original format
    which was bigint for r,s and number for recovery
   */
  signature.r = BigInt(signature.r)
  signature.s = BigInt(signature.s)
  // Hashing the message that come from the client to match with the signature
  let msghash = sha256(utf8ToBytes(amount.toString()))
  /*
    Valindating The Signature according to the sender 
    if The Signature is valid Then The Fund Will Be realsed  and 
    The Accounts Of Sender And Reciever Will be updated Else 
    It will server Alert "Malicious Activity" 
  */
  if(secp256k1.verify(signature,msghash,sender)){
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }

  }else{
    res.status(400).send({ message: "Malicious Activity" })
  }
 
});
// An extra Fuctionalyt To Create Accounts I.E Private and Public Key With Fund
// And Storing Public Key On The Server With Their Funds To The Balances To Run Further Operations.

app.post("/add",(req,res)=>{

  const{public_key,fund }=req.body
  addnewuser(public_key,fund)


})


app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
  
}
// Function To Ad New Accounts
function addnewuser(address,fund) {
  balances[address] = fund
  
  
}
