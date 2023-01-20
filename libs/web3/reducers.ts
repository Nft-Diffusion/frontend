import { Web3ProviderState, Web3Action } from "./types"

export function web3Reducer(
    state: Web3ProviderState,
    action: Web3Action
  ): Web3ProviderState {
    switch (action.type) {
      case 'SET_WEB3_PROVIDER':
        return {
          ...state,
          provider: action.provider,
          web3Provider: action.web3Provider,
          address: action.address,
          network: action.network,
        }
      case 'SET_ADDRESS':
        return {
          ...state,
          address: action.address,
        }
      case 'SET_NETWORK':
        return {
          ...state,
          network: action.network,
        }
      case 'RESET_WEB3_PROVIDER':
        return {provider: null, web3Provider: null, address: null, network: null}
      default:
        throw new Error()
    }
  }