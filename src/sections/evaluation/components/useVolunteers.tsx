/**
 *  useVolunteers.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { useEffect, useState } from "react";
import { dasVolunteerService } from "../api/dasVolunteerService";


const useVolunteers = () => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState<any[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            setStatus('fetching');
            const response = await dasVolunteerService.getAll()
            setData(response);
            setStatus('fetched');
        };
        fetchData();
    }, []);


    return { status, data };
};

export default useVolunteers;