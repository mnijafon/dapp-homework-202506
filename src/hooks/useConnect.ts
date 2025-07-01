import { useState, useCallback, useEffect, useRef } from 'react';
import { ethers } from 'ethers';

declare global {
    interface Window {
        ethereum?: any;
    }
}

const validateEthereum = () => {
    if (typeof window.ethereum === 'undefined') {
        throw new Error('Ethereum provider not found. Please install MetaMask.');
    }
};

export const useConnect = () => {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [account, setAccount] = useState<string | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // 防抖锁（多次点击防止并发）
    const isConnectingRef = useRef(false);

    const checkWalletConnection = useCallback(async () => {
        if (!window.ethereum) return;

        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                setIsWalletConnected(true);

                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                setSigner(signer);
            }
        } catch (err) {
            console.error('Error checking wallet connection:', err);
        }
    }, []);

    const connectWallet = useCallback(async () => {
        validateEthereum();

        if (isLoading) {
            console.warn('连接操作正在进行，请稍候...');
            return;
        }
        let shouldResetLoading = true;
        setIsLoading(true);

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            if (accounts.length > 0) {
                setAccount(accounts[0]);
                setIsWalletConnected(true);

                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                setSigner(signer);
            }
        } catch (err: any) {
            if (err.code === -32002) {
                alert('MetaMask 正在处理中，请在弹窗中完成操作。不要重复点击连接按钮。');
                shouldResetLoading = false; // ❌ 不重置 loading
            } else if (err.code === 4001) {
                alert('用户拒绝了连接请求');
            } else {
                console.error('连接钱包失败:', err);
            }
        } finally {
            if (shouldResetLoading) {
                setIsLoading(false); // ✅ 只有在不是 -32002 的情况下才执行
            }
        }
    }, [isLoading]);


    const disconnectWallet = useCallback(() => {
        setAccount(null);
        setIsWalletConnected(false);
        setSigner(null);
    }, []);

    useEffect(() => {
        checkWalletConnection();
    }, [checkWalletConnection]);

    useEffect(() => {
        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                setAccount(accounts[0]);
                setIsWalletConnected(true);
            }
        };

        window.ethereum?.on?.('accountsChanged', handleAccountsChanged);
        return () => {
            window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged);
        };
    }, [disconnectWallet]);

    return {
        isWalletConnected,
        account,
        connectWallet,
        disconnectWallet,
        signer,
        isLoading
    };
};
