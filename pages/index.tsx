import Image from 'next/image'
import { Inter } from '@next/font/google'
import useWeb3Provider from '@/libs/web3'
import { ethers } from 'ethers'
import abi from '../artifacts/abi/AiUp.json';
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { connect, web3Provider } = useWeb3Provider();

  const ConnectWallet = () => {
    connect();
  }

  const Mint = async () => {
    if (!web3Provider)
      return;
    const signer = web3Provider.getSigner(); 
    // user signs message so api can verify the owner of Token is sending Request 
    // and to protect my API  
    // the API cost money :) 
    const sig = await signer.signMessage('mining nft');
    const nftContract = new ethers.Contract('', abi.abi, web3Provider);
    await nftContract.mintToken({ value: ethers.utils.formatEther('0.1') })

    const resp = await fetch('/api/mint', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({msg: "mining nft", sig})
    }).then(r => r.json())
    const image = resp.image; 
  }
  return (
    <>
      <div onClick={ConnectWallet}>
        <h1>Connect</h1>

      </div>
      <div onClick={Mint}>
        <h1>MINT</h1>
      </div>
    </>
  )
}

