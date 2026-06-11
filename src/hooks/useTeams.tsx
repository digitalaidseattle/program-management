/**
 * usePartners.tsx
 * 
 * @2026 Digital Aid Seattle
 */
import { useCachedResource } from "./CacheFactory";
import { Team } from "../data/types";
import { TeamService } from "../services/dasTeamService";

export function useTeams() {
  const service = TeamService.getInstance();
  return useCachedResource<Team[]>({
    key: "teams",
    fetcher: async () => { return await service.getAll() }
  });
}
