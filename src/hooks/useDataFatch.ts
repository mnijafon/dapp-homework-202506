export type DataReceived = {
    id: string;
    sender: string;
    data: string;
    timestamp: string;
};

export const useDataFetch = () => {
    const getZeroData = async () => {
        const result = await fetch('/api/list');
        const data = await result.json();
        return data;
    };

    return {
        getZeroData,
    };
};
