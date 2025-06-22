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
        const userTimelogs = this.timelogsService.getTimelogs();
        const users = new Map(this.usersService.getUsers().map(u => [u.id, u]));

        let totalAccuracy = 0;
        let totalTimeTaken = 0;
        let totalQuestionsAnswered = 0;
        const userSummaries: UserSummary[] = [];

        for (const [userId, timelogs] of userTimelogs) {
            const user = users.get(userId);
            const totalGroupQuestions = user ? config.getTotalQuestions(user.group) : null;

            if (!user || totalGroupQuestions === null || timelogs.length === 0) {
                continue;
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

            const accuracy = (userSummary.correctQuestions / totalGroupQuestions) * 100;

            userSummary.accuracy = accuracy;

            totalAccuracy += accuracy;
            totalTimeTaken += userSummary.timeTaken;
            totalQuestionsAnswered += userSummary.questionsAnswered;

            userSummaries.push(userSummary);
        }

        return {
            averageAccuracy: totalAccuracy / userSummaries.length,
            averageTimeTaken: totalTimeTaken / userSummaries.length,
            totalQuestionsAnswered,
            users: userSummaries,
        };
    }
}

type QuestionStatus = {
    timestamp: number;
    correct: boolean;
};
