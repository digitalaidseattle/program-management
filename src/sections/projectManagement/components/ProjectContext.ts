/**
 *  UserContext.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { createContext } from "react";
import { Project } from "../api/pmProjectService";

interface ProjectContextType {
    project: Project | undefined;
    setProject: (project: Project) => void;
}

export const ProjectContext = createContext<ProjectContextType>({
    project: undefined,
    setProject: () => { }
});
