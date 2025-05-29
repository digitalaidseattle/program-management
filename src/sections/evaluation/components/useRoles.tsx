/**
 *  useRoles.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { useEffect, useState } from "react";
import { dasRoleService, Role } from "../api/dasRoleService";

const useRoles = () => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState<Role[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            setStatus('fetching');
            const response = await dasRoleService.getAll()
                .then(roles => roles.sort((r1, r2) => r1.name.localeCompare(r2.name)));
            setData(response);
            setStatus('fetched');
        };
        fetchData();
    }, []);


    return { status, data };
};

export default useRoles;
