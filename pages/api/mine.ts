// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { BigNumber, ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next'
import abi from '../../artifacts/abi/AiUp.json'; 
type Data = {
    error: null | string
    image?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        const devNetwork = {
            name: "hardhat", 
            chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID as string)
        }
        let provider; 
        if(process.env.DEV) {
            provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/", devNetwork)
        } else {
            provider = new ethers.providers.InfuraProvider('mainnet', process.env.INFURA_API_KEY)
        }
     
        // grab message and signature from body
        const {msg, sig} = req.body; 
        const publicAddr = ethers.utils.verifyMessage(msg, sig);
        const nftContract = new ethers.Contract('0x5fbdb2315678afecb367f032d93f642f64180aa3', abi.abi, provider);
        const rawTokenId = await nftContract.totalSupply();
        const tokenId = rawTokenId.toString(); 
        const parseTokenId = parseInt(tokenId); 
        const ownerAddr = await nftContract.ownerOf(parseTokenId - 1); // Minted Tokens start from 0
        console.log(ownerAddr, publicAddr); 
        if(ownerAddr === publicAddr) { //check if user owns the minted nft 
            
            // Sending Request to another API is not ideal 
            // Defeats the purpose of edge function 
            // TODO 
            // Set up API close to private API 
            const param = 'subway on the moon'; 
            const resp = await fetch('http://localhost:8000/generateImage', {
                method:"POST", 
                headers: {
                    'Content-Type' : 'application/json' 
                },
                body: JSON.stringify({tokenId, param})
            }).then(r => r.json()) 
            
            // const {image} = req; 
            res.status(200).json({image: resp.image, error: null})
        } else {
            res.status(200).json({error: "signature didn't match"})
        }
    } catch(e: any) {
        res.status(200).json({error:e.toString()})
    }
}
