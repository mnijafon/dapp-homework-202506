import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

// 扩展全局 Window 类型，让 TypeScript 知道ethereum的存在
declare global {
    interface Window {
        ethereum?: any;
    }
}

/**
 * 检查用户是否安装了 MetaMask 或其他支持 EIP-1193 的钱包
 */
const validateEthereum = () => {
    if (typeof window.ethereum === 'undefined') {
        throw new Error('Ethereum provider not found. Please install MetaMask.');
    }
};

/**
 * useConnect 只负责钱包连接相关的功能，不涉及合约或 provider
 */
export const useConnect = () => {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [account, setAccount] = useState<string | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);

    // 检查当前是否已连接过钱包
    const checkWalletConnection = useCallback(async () => {
        if (!window.ethereum) return;

        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                setIsWalletConnected(true);

                // ✅ 新增 signer 设置
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                setSigner(signer);
            }
        } catch (err) {
            console.error('Error checking wallet connection:', err);
        }
    }, []);

    // 主动连接钱包（MetaMask 会弹窗）
    const connectWallet = useCallback(async () => {
        validateEthereum();
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                setIsWalletConnected(true);

                // ✅ 新增 signer 设置
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                setSigner(signer);
            }
        } catch (err) {
            console.error('Error connecting wallet:', err);
        }
    }, []);

    // 断开钱包（只是清除本地状态，不是真正让 MetaMask 断连）
    const disconnectWallet = useCallback(() => {
        setAccount(null);
        setIsWalletConnected(false);
        setSigner(null); // ✅ 清空 signer
    }, []);

    // 页面加载时自动检查连接状态
    useEffect(() => {
        checkWalletConnection();
    }, [checkWalletConnection]);

    // 监听用户主动切换账户
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
    };
};
