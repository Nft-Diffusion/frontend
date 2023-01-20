import Web3Provider from '@/libs/web3/Web3Provider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Web3Provider><Component {...pageProps} /></Web3Provider>
    </>
  )
}
