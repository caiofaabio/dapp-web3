import  { useState } from 'react'
import  {ethers}  from 'ethers'
import ABI from './abi.json'

import './App.css'

function App() {
  const [customerId, setCustomerId] = useState("0")
  const [message, setMessage] = useState("")
  const [name, setName] = useState('')
  const [age, setAge] = useState('')

  const CONTRACT_ADDRESS = "0xE9956c971B72aD74F249E616828df613F03E858b"

  async function getProvider(){
    if(!window.ethereum) return setMessage("Voçê não tem uma carteira/wallet")

    const provider =  new ethers.BrowserProvider(window.ethereum)

    const accounts = await provider.send("eth_requestAccounts", [])
    if(!accounts || !accounts.length) return setMessage("Carteira não autorizada")

    return provider
  }

  async function doSearch(){

    try {
      const provider = await getProvider()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
      const customer = await contract.getCustomer(customerId)

      const customerString = {
        name: customer.name,
        age: customer.age.toString(),
      };
      
      setMessage(JSON.stringify(customerString))
    } catch (error) {
      setMessage(error.message)
    } 
  }

  const onSearchClick = () => {
    setMessage("");
    doSearch();
  }



  async function doSave(){
    try{
      const provider = await getProvider()
      const signer = await provider.getSigner()
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
      const contractSigner = contract.connect(signer)
      
      // toda operação de escrita na blockchain me retorna uma transação
      const tx = await contractSigner.addCustomer({name, age})
      setMessage(JSON.stringify(tx))
    } catch(error){
      setMessage(error.message)
    }
  }

  const onSaveClick = () =>{
    setMessage('')
    doSave()
  }

  return (
    <header>
      <p>
        <label>
          Customer ID:
          <input type='number' value={customerId} onChange={(e) => setCustomerId(e.target.value)}/>
        </label>
        <input type="button" value="search" onClick={onSearchClick} />
      </p>
      <p>
        <label>
          Name: <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Age: <input type='number' value={age} onChange={(e) => setAge(e.target.value)} />
        </label>
        <input type="button" value="Save" onClick={onSaveClick} />
      </p>
      
      <p>{message}</p>
    </header>
  )
}

export default App
