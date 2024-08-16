/**
 *  useAppConstants.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { useEffect, useState } from "react";
import { supabaseClient } from "./supabaseClient";

export type AppConstant = {
    value: string,
    label: string
}

const TASK_STATUSES: AppConstant[] = [
    { value: "inbox", label: "Inbox" },
    { value: "needs re-work", label: "Needs re-work" },
    { value: "Approved", label: "Approved" },
    { value: "Delivered", label: "Delivered" },
    { value: "In progress", label: "In progress" },
    { value: "Todo", label: "Todo" },
    { value: "Someday maybe", label: "Someday maybe" },
    { value: "Paused", label: "Paused" },
    { value: "Cancelled", label: "Cancelled" },
];

const cache: Record<string, AppConstant[]> = {}
cache['TASK-STATUS'] = TASK_STATUSES;

const useAppConstants = (type: string) => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState<AppConstant[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            setStatus('fetching');
            if (cache[type]) {
                const data = cache[type];
                setData(data);
                setStatus('fetched');
            } else {
                const response = await supabaseClient.from('app_constants')
                    .select()
                    .eq('type', type);
                const data = response.data as AppConstant[];
                cache[type] = data;
                setData(data);
                setStatus('fetched');
            }
        };

        fetchData();
    }, [type]);

    return { status, data };
};

export default useAppConstants;