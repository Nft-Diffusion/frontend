
import { useEffect, useReducer, useCallback } from 'react'
import { ethers } from 'ethers'
import { web3Reducer } from './reducers'
import { Web3ProviderState, Web3Action } from './types'
import { getWeb3Modal } from './getWeb3Modal'
import Context from './Context'

// Web3Modal code goes here
const web3Modal = getWeb3Modal();

const Web3Provider = ({ children }: any) => {
    const web3InitialState: Web3ProviderState = {
        provider: null,
        web3Provider: null,
        address: null,
        network: null,
    }
    const [state, dispatch] = useReducer(web3Reducer, web3InitialState)
    const { provider } = state

    const connect = useCallback(async () => {
        if (web3Modal) {
            try {
                const provider = await web3Modal.connect()
                const web3Provider = new ethers.providers.Web3Provider(provider)
                const signer = web3Provider.getSigner()
                const address = await signer.getAddress()
                const network = await web3Provider.getNetwork()

                dispatch({
                    type: 'SET_WEB3_PROVIDER',
                    provider,
                    web3Provider,
                    address,
                    network,
                } as Web3Action)
            } catch (e) {
                console.log('connect error', e)
            }
        } else {
            console.error('No Web3Modal')
        }
    }, [])

    const disconnect = useCallback(async () => {
        if (web3Modal) {
            web3Modal.clearCachedProvider()
            if (provider?.disconnect && typeof provider.disconnect === 'function') {
                await provider.disconnect()
            }
            dispatch({
                type: 'RESET_WEB3_PROVIDER',
            } as Web3Action)
        } else {
            console.error('No Web3Modal')
        }
    }, [provider])
    // Auto connect to the cached provider
    useEffect(() => {
        if (web3Modal && web3Modal.cachedProvider) {
            connect()
        }
    }, [connect])

    // EIP-1193 events
    useEffect(() => {
        if (provider?.on) {
            const handleAccountsChanged = (accounts: string[]) => {
                dispatch({
                    type: 'SET_ADDRESS',
                    address: accounts[0],
                } as Web3Action)
            }

            // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
            const handleChainChanged = (_hexChainId: string) => {
                if (typeof window !== 'undefined') {
                    console.log('switched to chain...', _hexChainId)
                    window.location.reload()
                } else {
                    console.log('window is undefined')
                }
            }

            const handleDisconnect = (error: { code: number; message: string }) => {
                // eslint-disable-next-line no-console
                console.log('disconnect', error)
                disconnect()
            }

            provider.on('accountsChanged', handleAccountsChanged)
            provider.on('chainChanged', handleChainChanged)
            provider.on('disconnect', handleDisconnect)

            // Subscription Cleanup
            return () => {
                if (provider.removeListener) {
                    provider.removeListener('accountsChanged', handleAccountsChanged)
                    provider.removeListener('chainChanged', handleChainChanged)
                    provider.removeListener('disconnect', handleDisconnect)
                }
            }
        }
    }, [provider, disconnect])

    return (<Context.Provider value={{ ...state, connect, disconnect }}>{children}</Context.Provider>)
}

export default Web3Provider;