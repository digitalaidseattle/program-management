/**
 *  useRoles.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { useEffect, useState } from "react";
import { Role, roleService } from "../services/dasRoleService";

const useRoles = () => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState<Role[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setStatus('fetching');
        const response = await roleService.getAll()
            .then(roles => roles.sort((r1, r2) => r1.name.localeCompare(r2.name)));
        setData(response);
        setStatus('fetched');
    };

    return { status, data };
};

export default useRoles;