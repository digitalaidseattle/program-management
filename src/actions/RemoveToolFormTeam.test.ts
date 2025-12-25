/**
 *  removeToolFromTeam.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { describe, expect, it, vi } from "vitest";
import { team2ToolService } from "../services/dasTeam2ToolService";
import { Team } from "../services/dasTeamService";
import { Tool } from "../services/dasToolsService";
import { removeToolFromTeam } from "./RemoveToolFromTeam";

describe("removeToolFromTeam", () => {

    it("basic", () => {
        const tool = {} as Tool;
        const team = {} as Team;

        const removeSpy = vi.spyOn(team2ToolService, 'removeToolFromTeam')
            .mockResolvedValue(true);

        removeToolFromTeam(tool, team)
            .then((actual) => {
                expect(removeSpy).toBeCalledWith(tool, team);
                expect(actual).toBe(true)
            });
    });

});