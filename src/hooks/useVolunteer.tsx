/**
 *  useVolunteer.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { useAuthService } from "@digitalaidseattle/core";
import { useEffect, useState } from "react";
import { VolunteerService } from "../services/dasVolunteerService";
import { Volunteer } from "../data/types";


export const useVolunteer = () => {
    const authService = useAuthService();
    const volunteerService = VolunteerService.getInstance();

    const [status, setStatus] = useState<string>('');
    const [volunteer, setVolunteer] = useState<Volunteer>();

    useEffect(() => {
        if (authService) {
            setStatus('fetching');
            authService
                .getUser()
                .then(user => {
                    if (user) {
                        volunteerService
                            .findByDasEmail(user.email)
                            .then(volunteer => setVolunteer(volunteer!))
                    }
                })
                .finally(() => setStatus('fetched'));
        }
    }, [authService]);

    return { status, volunteer };
};
