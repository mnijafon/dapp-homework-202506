// import { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import { DataReceiver, DataReceiver__factory } from '@/types/contracts';
//
// /**
//  * 合约地址常量（你也可以做成参数传入）
//  */
// const CONTRACT_ADDRESS = '0xd8639AF38c9d9e64BD2a40C926571Bf679C88809';
//
// /**
//  * useContract：基于 window.ethereum 创建 provider、signer 和合约实例
//  */
// export const useContract = () => {
//     const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
//     const [signer, setSigner] = useState<ethers.Signer | null>(null);
//     const [contract, setContract] = useState<DataReceiver | null>(null);
//
//     useEffect(() => {
//         const init = async () => {
//             if (typeof window.ethereum === 'undefined') return;
//
//             try {
//                 // Ethers v6 使用 BrowserProvider（替代 Web3Provider）
//                 const browserProvider = new ethers.BrowserProvider(window.ethereum);
//                 setProvider(browserProvider);
//
//                 // 获取当前连接的钱包账户的 signer（用于签名交易）
//                 const walletSigner = await browserProvider.getSigner();
//                 setSigner(walletSigner);
//
//                 // 使用合约工厂创建合约实例
//                 const contractInstance = DataReceiver__factory.connect(CONTRACT_ADDRESS, walletSigner);
//                 setContract(contractInstance);
//             } catch (err) {
//                 console.error('Failed to setup contract:', err);
//             }
//         };
//
//         init();
//     }, []);
//
//     return {
//         provider,
//         signer,
//         contract,
//         contractAddress: CONTRACT_ADDRESS,
//     };
// };
