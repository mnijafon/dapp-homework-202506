import { useState, useCallback, useEffect } from 'react';
import { useDataToChain } from '@/hooks/useDataToChain';
import { useDataFetch } from '@/hooks/useDataFatch';

const formatAddress = (address: string) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
};

const formatTimestamp = (timestamp: string) => {
    // 将时间戳转换为日期时间 格式为 yyyy-MM-dd HH:mm:ss
    const date = new Date(timestamp);
    return date
        .toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
        .replace(/\//g, '-');
};

const tableClassName = 'table border-collapse table-auto w-full text-sm';
const tableHeaderCellClassName =
    'table-cell border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left';
const tableRowCellClassName =
    'table-cell border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400';

export default function Homework0614() {
    const { sendToZeroAddress, isLoading, fromBytes } = useDataToChain();

    const { getZeroData } = useDataFetch();

    const [data, setData] = useState('');
    const [txList, setTxList] = useState<any[]>([]);

    const refreshData = useCallback(async () => {
        const data = await getZeroData();
        console.log('data', data);
        console.log('data.data.result', data.data.result);
        setTxList(
            [{
                hash: data.data.result.hash,
                from: formatAddress(data.data.result.from),
                to: formatAddress(data.data.result.to),
                value: data.data.result.value,
                input: data.data.result.data ? fromBytes(data.data.result.data) : ''
            }],
        );
    }, [getZeroData]);

    useEffect(() => {
        refreshData();
    }, []);

    const handleSave = async () => {
        sendToZeroAddress(data);
    };
    return (
        <div className="h-full flex flex-col px-16 py-8 ">
            <div className="h-12 flex items-center gap-2">
                <input
                    type="text"
                    className="w-full border-2 text-gray-500 border-gray-300 rounded-md p-2"
                    value={data}
                    onChange={e => setData(e.target.value)}
                />
                <button
                    className="bg-blue-500 w-90 text-white px-4 py-2 rounded-md cursor-pointer"
                    onClick={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save To Zero'}
                </button>
            </div>
            <div className="flex-1 pt-5 relative overflow-y-auto">
                <div className="absolute top-2 right-0">
                    <button
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center gap-1"
                        onClick={refreshData}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                    </button>
                </div>
                <div className={tableClassName}>
                    <div className="table-header-group">
                        <div className="table-row">
                            <div className={tableHeaderCellClassName}>From Address</div>
                            <div className={tableHeaderCellClassName}>To Address</div>
                            <div className={tableHeaderCellClassName}>Value</div>
                            <div className={tableHeaderCellClassName}>Input</div>
                            <div className={tableHeaderCellClassName}>Timestamp</div>
                        </div>
                    </div>
                    <div className="table-row-group">
                        {txList.map(item => (
                            <div className="table-row" key={item.hash}>
                                <div className={tableRowCellClassName}>{item.from}</div>
                                <div className={tableRowCellClassName}>{item.to}</div>
                                <div className={tableRowCellClassName}>{item.value}</div>
                                <div className={tableRowCellClassName}>{item.input}</div>
                                <div className={tableRowCellClassName}>{item.timestamp}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}