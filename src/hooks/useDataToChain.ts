import { useCallback, useState } from 'react';
import { useConnect } from './useConnect';
import { hexlify, parseEther, toUtf8Bytes, toUtf8String } from 'ethers';

const toBytes = (data: string): `0x${string}` => {
    return hexlify(toUtf8Bytes(data)) as `0x${string}`;
};
const fromBytes = (hexData: `0x${string}`): string => {
    return toUtf8String(hexData);
};

export const useDataToChain = () => {
    const { isWalletConnected, signer } = useConnect();
    const [isLoading, setIsLoading] = useState(false);
    // 向零地址转0eth,并发送数据
    const sendToZeroAddress = useCallback(
        async (data: string) => {
            if (!isWalletConnected || !signer) {
                alert('Wallet not connected');
                return;
            }

            setIsLoading(true);
            try {
                const tx = await signer.sendTransaction({
                    to: '0x0000000000000000000000000000000000000000',
                    value: parseEther('0'),
                    data: toBytes(data),
                });

                const receipt = await tx.wait();
                console.log('receipt', receipt);
                // const txData = await sendTx({
                //     type: TxType.ZERO,
                //     txhash: receipt!.hash,
                //     fromaddress: receipt!.from!,
                //     toaddress: receipt!.to!,
                // });

                // console.log('txData', txData);
            } catch (error) {
                console.error('sendToZeroAddress error', error);
                alert('Send to zero address failed');
            } finally {
                setIsLoading(false);
            }
        },
        [isWalletConnected, signer],
    );
    return {
        isLoading,
        sendToZeroAddress,
        fromBytes,
        toBytes,
    };
}