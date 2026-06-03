/**
 *  dasProfileService.test.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { describe, expect, it } from "vitest";
import { PartnerService } from "./dasPartnerService";

describe("partnerService", () => {

    it("mapJson", () => {
        const partner = PartnerService.getInstance()
            .mapJson({
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
            }) as any;
        expect(partner.id).toBe("1234");
        expect(partner.contact![0].title).toBe("Manager");
    })


})