/**
 *  useVolunteers.tsx
 *
 *  @copyright 202r Digital Aid Seattle
 *
 */
import { useEffect, useState } from "react";
import { VolunteerService } from "../services/dasVolunteerService";


const useVolunteers = () => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setStatus('fetching');
            const response = await VolunteerService.getInstance().getActive()
            setData(response);
            setStatus('fetched');
        };
        fetchData();
    }, []);

    return { status, data };
};

export default useVolunteers;