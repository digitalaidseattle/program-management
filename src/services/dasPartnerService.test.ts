/**
 *  dasProfileService.test.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { describe, expect, it } from "vitest";
import { partnerService } from "./dasPartnerService";

describe("partnerService", () => {
   
    it("mapJson", () => {
        const partner = partnerService.mapper({
            id: "1234",
            profile2partner: [
                {
                    profile: {
                        id: "p1",
                        first_name: "John",
                        last_name: "Doe",
                        email: "email"
                    },
                    title: "Manager"
                }]
        });
        expect(partner.id).toBe("1234");
        expect(partner.contact![0].title).toBe("Manager");
    })


})