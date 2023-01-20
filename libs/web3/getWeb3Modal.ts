
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'


export function getWeb3Modal() {
    const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
          },
        },
      }
      
      let web3Modal: Web3Modal | null = null; 
      if (typeof window !== 'undefined') {
        web3Modal = new Web3Modal({
          network: 'mainnet', // optional
          cacheProvider: true,
          providerOptions, // required
        })
      }
      return web3Modal;
}
