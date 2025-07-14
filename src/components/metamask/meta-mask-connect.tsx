'use client'
import { useState, useEffect } from 'react'
import { MetaMaskSDK } from '@metamask/sdk'

interface MetaMaskConnectProps {
    onConnect?: (account: string) => void
}

export default function MetaMaskConnect({ onConnect }: MetaMaskConnectProps) {
    const [account, setAccount] = useState<string>('')
    const [isConnected, setIsConnected] = useState(false)
    const [sdk, setSdk] = useState<MetaMaskSDK | null>(null)

    useEffect(() => {
        const initSDK = async () => {
            const MMSDK = new MetaMaskSDK({
                dappMetadata: {
                    name: "Your DApp Name",
                    url: window.location.href,
                },
                preferDesktop: false,
            })

            setSdk(MMSDK)
        }

        initSDK()
    }, [])

    const connectWallet = async () => {
        if (!sdk) return

        try {
            const accounts = await sdk.connect()
            if (accounts && accounts.length > 0) {
                setAccount(accounts[0])
                setIsConnected(true)
                onConnect?.(accounts[0])
            }
        } catch (error) {
            console.error('Connection failed:', error)
        }
    }

    const disconnectWallet = () => {
        setAccount('')
        setIsConnected(false)
        if (sdk) {
            sdk.terminate()
        }
    }

    return (
        <div className="p-4">
            {!isConnected ? (
                <button
                    onClick={connectWallet}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Connect MetaMask
                </button>
            ) : (
                <div>
                    <p className="mb-2">Connected: {account}</p>
                    <button
                        onClick={disconnectWallet}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    )
}