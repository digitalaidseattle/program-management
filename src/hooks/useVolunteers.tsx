/**
 *  useVolunteers.tsx
 *
 *  @copyright 202r Digital Aid Seattle
 *
 */
import { useEffect, useState } from "react";
import { volunteerService } from "../services/dasVolunteerService";


const useVolunteers = () => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setStatus('fetching');
            const response = await volunteerService.getActive()
            setData(response);
            setStatus('fetched');
        };
        fetchData();
    }, []);

    return { status, data };
};

export default useVolunteers;