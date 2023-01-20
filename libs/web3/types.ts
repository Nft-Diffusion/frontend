import { ethers } from "ethers"

export type Web3ProviderState = {
    provider: any 
    web3Provider: ethers.providers.Web3Provider | null | undefined
    address: string | null | undefined
    network: ethers.providers.Network | null | undefined
}
export type Web3Client = Web3ProviderState & {
    connect: () => Promise<void>
    disconnect: () => Promise<void>
}

export type Web3Action =
| {
    type: 'SET_WEB3_PROVIDER'
    provider?: Web3ProviderState['provider']
    web3Provider?: Web3ProviderState['web3Provider']
    address?: Web3ProviderState['address']
    network?: Web3ProviderState['network']
  }
| {
    type: 'SET_ADDRESS'
    address?: Web3ProviderState['address']
  }
| {
    type: 'SET_NETWORK'
    network?: Web3ProviderState['network']
  }
| {
    type: 'RESET_WEB3_PROVIDER'
  }