import { createContext } from "react";
import { MeetingAttendee } from "../../services/dasMeetingService";

export interface SelectedAttendeeContextType {
    selectedAttendee: MeetingAttendee | undefined,
    setSelectedAttendee: (att: MeetingAttendee) => void
}

export const SelectedAttendeeContext = createContext<SelectedAttendeeContextType>({
    selectedAttendee: undefined,
    setSelectedAttendee: (_att: MeetingAttendee) => { }
});