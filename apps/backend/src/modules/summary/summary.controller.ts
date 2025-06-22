import { ApiResponses } from "@decorators";
import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { Summary, UserSummary } from "./entities";
import { SummaryService } from "./summary.service";

@Controller("summary")
export class SummaryController {
    public constructor(private readonly summaryService: SummaryService) {
    }

    /**
     * Get user data and timelogs summary for the admin dashboard.
     */
    @Get()
    @ApiResponses({
        ok: {
            description: "Successfully obtained user data and timelogs summary.",
            type: Summary,
        },
    })
    public getSummary(): Summary {
        return this.summaryService.getSummary();
    }

    /**
     * Get user data and timelogs summary for a single user.
     */
    @Get(":userId")
    @ApiResponses({
        ok: {
            description: "Successfully obtained user data and timelogs summary.",
            type: UserSummary,
        },
    })
    public getUserSummary(@Param("userId") userId: string): UserSummary {
        const userSummary = this.summaryService.getUserSummary(userId);
        if (!userSummary) {
            throw new NotFoundException("User not found");
        }

        return userSummary;
    }
}
