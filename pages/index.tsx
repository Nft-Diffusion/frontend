import Image from 'next/image'
import { Inter } from '@next/font/google'
import useWeb3Provider from '@/libs/web3'
import { ethers } from 'ethers'
import abi from '../artifacts/abi/AiUp.json';
import { useEffect, useState } from 'react';
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { connect, web3Provider, address } = useWeb3Provider();
  const [totalSupply, setTotalSupply] = useState(''); 

  useEffect(() => {
    if(web3Provider && !totalSupply) {
      const nftContract = new ethers.Contract('0x5fbdb2315678afecb367f032d93f642f64180aa3', abi.abi, web3Provider);
      nftContract.totalSupply().then((raw: any) => {
        const supply = raw.toString(); 
        setTotalSupply(supply); 
      })
    }
  }, [totalSupply, web3Provider])
  
  const ConnectWallet = () => {
    connect();
  }

  const Mint = async () => {
    if (!web3Provider)
      return;
    const properChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID as string);
    console.log(web3Provider.network.chainId)
    if (web3Provider.network.chainId !== properChainId) {
      (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: ethers.utils.hexlify(properChainId),
          rpcUrls: ["http://127.0.0.1:8545"],
          chainName: "Hardhat",
          nativeCurrency: {
            name: "Hardhat",
            symbol: "GO",
            decimals: 18
          }
        }]
      });
      return;
    }

    const signer = web3Provider.getSigner();
    // user signs message so api can verify the owner of Token is sending Request 
    // and to protect my API  
    // the API cost money :) 
    try {
      const sig = await signer.signMessage('mining nft');
      const nftContract = new ethers.Contract('0x5fbdb2315678afecb367f032d93f642f64180aa3', abi.abi, web3Provider.getSigner());
      const minting = await nftContract.mintToken({ value: ethers.utils.parseEther('0.1') })
      const data = await minting.wait();
      const supply = await nftContract.totalSupply();
      setTotalSupply(supply.toString())
      const uri = await nftContract.tokenURI(parseInt(supply.toString()));
      console.log(uri);
      // const resp = await fetch('api/mine', {
      //   method: "POST",
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ msg: "mining nft", sig })
      // }).then(r => r.json())
    } catch (e) {
      console.log(e);
    }

  }

  return (
    <>
      <div className='h-screen w-screen flex flex-col items-center py-24 bg-slate-800 text-white  font-poppins'>
        <h1 className='mb-4 font-poppins text-4xl'>MINT A UNIQUE NFT WITH JUST A PROMPT. </h1>
        <h1 className='text-2xl'>{totalSupply ? totalSupply : '?'}/100</h1>
        <div>
          <div>
            <div className='mt-24 w-72 h-80 flex justify-center items-center border-4 border-slate-500 my-4 rounded-lg'>
              <h1 className='font-poppins text-8xl'>?</h1>
            </div>
            <div className='border w-full py-2 px-2 rounded-lg'>
              <input type="text" placeholder='Enter a prompt' className='border-none bg-slate-800 text-white focus:outline-0 w-full' />
            </div>
            <div className='flex justify-center'>
              <div className='w-full py-2 flex justify-center border text-xl font-poppins rounded-lg my-2 cursor-pointer' onClick={address ? Mint : ConnectWallet}>
                <h1>{address ? "MINT" : "CONNECT"}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

