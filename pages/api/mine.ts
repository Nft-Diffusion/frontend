// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from 'ethers';
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
    const provider = new ethers.providers.InfuraProvider('mainnet', process.env.INFURA_API_KEY)
    // grab message and signature from body
    const {msg, sig} = req.body; 
    const publicAddr = ethers.utils.verifyMessage(msg, sig);
    const nftContract = new ethers.Contract('', abi.abi, provider);
    const tokenId = await nftContract.totalSupply();
    const ownerAddr = await nftContract.ownerOf(tokenId);
    
    if(ownerAddr === publicAddr) { //check if user owns the minted nft 
        // TODO 
        // Sending Request to another API is not ideal 
        // Defeats the purpose of edge function 
        // Set up API close to private API 
        const req = await fetch('ip/generateImage', {
            method:"POST", 
            headers: {
                'Content-Type' : 'application/json' 
            },
            body: JSON.stringify({tokenId})
        }).then(r => r.json()); 
        const {image} = req; 
        res.status(200).json({image, error: null})
    } else {
        res.status(200).json({error: "signature didn't match"})
    }
    
}
