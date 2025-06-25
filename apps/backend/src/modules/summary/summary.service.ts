import { TimelogsService } from "@modules/timelogs";
import { UsersService } from "@modules/users";
import { Injectable } from "@nestjs/common";
import { config } from "@pocopi/config";
import { Summary, UserSummary } from "./entities";

@Injectable()
export class SummaryService {
    public constructor(
        private readonly timelogsService: TimelogsService,
        private readonly usersService: UsersService
    ) {
    }

    public getSummary(): Summary {
        const userIds = this.timelogsService.getTimelogs().keys();

        let totalAccuracy = 0;
        let totalTimeTaken = 0;
        let totalQuestionsAnswered = 0;
        const userSummaries: UserSummary[] = [];

        for (const userId of userIds) {
            const userSummary = this.getUserSummary(userId);
            if (userSummary) {
                totalAccuracy += userSummary.accuracy;
                totalTimeTaken += userSummary.timeTaken;
                totalQuestionsAnswered += userSummary.questionsAnswered;

                userSummaries.push(userSummary);
            }
        }

        return {
            averageAccuracy: totalAccuracy / userSummaries.length,
            averageTimeTaken: totalTimeTaken / userSummaries.length,
            totalQuestionsAnswered,
            users: userSummaries,
        };
    }

    public getUserSummary(userId: string): UserSummary | null {
        const user = this.usersService.getUsers().get(userId);
        const timelogs = this.timelogsService.getTimelogs().get(userId) ?? [];
        const totalGroupQuestions = user ? config.getTotalQuestions(user.group) : null;

        if (!user || totalGroupQuestions === null || timelogs.length === 0) {
            return null;
        }

        const questionsAnswered = new Map<string, QuestionStatus>();

        const userSummary = {
            id: userId,
            name: user.anonymous ? config.t("backend.anonymousUser") : user.name!,
            email: user.email,
            age: user.age,
            group: user.group,
            timestamp: Date.now(),
            timeTaken: 0,
            correctQuestions: 0,
            questionsAnswered: 0,
            accuracy: 0,
        } satisfies UserSummary;

        for (const timelog of timelogs) {
            userSummary.timestamp = Math.min(userSummary.timestamp, timelog.startTimestamp);
            userSummary.timeTaken = Math.max(userSummary.timeTaken, timelog.endTimestamp - userSummary.timestamp);

            if (timelog.skipped) {
                continue;
            }

            const questionId = `${timelog.phaseId}:${timelog.questionId}`;
            const questionStatus = questionsAnswered.get(questionId) ?? {
                timestamp: 0,
                correct: false,
            } satisfies QuestionStatus;

            if (timelog.endTimestamp > questionStatus.timestamp) {
                questionStatus.timestamp = timelog.endTimestamp;
                questionStatus.correct = timelog.correct;
            }

            questionsAnswered.set(questionId, questionStatus);
            userSummary.questionsAnswered = questionsAnswered.size;
        }

        for (const { correct } of questionsAnswered.values()) {
            if (correct) {
                userSummary.correctQuestions++;
            }
        }

        userSummary.accuracy = (userSummary.correctQuestions / totalGroupQuestions) * 100;

        return userSummary;
    }
}

type QuestionStatus = {
    timestamp: number;
    correct: boolean;
};
