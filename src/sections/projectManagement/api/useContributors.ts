import { useEffect, useState } from "react";
import { Contributor, pmContributorService } from "./pmContributorService";

/**
 *  useContributors.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
const useContributors = () => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState<Contributor[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setStatus('fetching');
            const response = await pmContributorService.findAll()
            setData(response);
            setStatus('fetched');
        };
        fetchData();
    }, []);


    return { status, data };
};

export { useContributors };
