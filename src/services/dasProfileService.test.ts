import { describe, expect, it } from "vitest";
import { Profile, profileService } from "./dasProfileService";

describe("ProfileService", () => {

    it("getNextPicUrl", () => {
        const profile = { } as Profile;

        const url = profileService.getNextPicUrl(profile);
        expect(url).toBeUndefined();

    });


});