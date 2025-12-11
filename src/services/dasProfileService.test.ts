import { describe, expect, it, vi } from "vitest";
import { storageService } from "../App";
import { Profile, ProfileService } from "./dasProfileService";

describe("ProfileService", () => {

    it("empty", () => {
        const service = new ProfileService();

        const profile = service.empty();
        expect(profile.id).toBeTruthy();
        expect(profile.name).toBe('');
    });

    it("getNextPicUrl", () => {
        const service = new ProfileService();
        const profile = { id: 'test' } as Profile;

        const url = service.getNextPicUrl(profile);
        expect(url).toBe('/profiles/test:1');
    });

    it("getPicUrl", () => {
        const service = new ProfileService();

        const profile = { id: 'idid', pic: '/profiles/test' } as Profile;
        const spyStorage = vi.spyOn(storageService, 'getUrl').mockReturnValue('/cdn/profiles/test:1');

        const url = service.getPicUrl(profile);
        expect(spyStorage).toBeCalledWith('/profiles/test');
        expect(url).toBe('/cdn/profiles/test:1');
    });
});