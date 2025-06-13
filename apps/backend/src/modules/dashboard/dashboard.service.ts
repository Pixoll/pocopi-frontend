import { UserSummary } from "@modules/dashboard/entities/user-summary.entity";
import { TimelogsService } from "@modules/timelogs";
import { UsersService } from "@modules/users";
import { Injectable } from "@nestjs/common";
import { config } from "@pocopi/config";
import { Summary } from "./entities";

@Injectable()
export class DashboardService {
    public constructor(
        private readonly timelogsService: TimelogsService,
        private readonly usersService: UsersService
    ) {
    }

    public getSummary(): Summary {
        const timelogs = this.timelogsService.getTimelogs();
        const users = new Map(this.usersService.getUsers().map(u => [u.id, u]));

        let totalAccuracy = 0;
        let totalTimeTaken = 0;
        let totalQuestionsAnswered = 0;
        const summaryUsers = new Map<string, UserSummary>();
        const questionsAnsweredMap = new Map<string, Map<string, QuestionStatus>>();

        for (const timelog of timelogs) {
            const user = users.get(timelog.userId);
            if (!user || config.getTotalQuestions(user.group) === null) {
                continue;
            }

            const userSummary = summaryUsers.get(user.id) ?? {
                id: user.id,
                name: user.anonymous ? config.t("backend.anonymousUser") : user.name!,
                group: user.group,
                timestamp: timelog.startTimestamp,
                timeTaken: 0,
                correctQuestions: 0,
                questionsAnswered: 0,
                accuracy: 0,
            } satisfies UserSummary;

            const questionsAnswered = questionsAnsweredMap.get(user.id) ?? new Map<string, QuestionStatus>();
            const questionId = `${timelog.phaseId}:${timelog.questionId}`;
            const questionStatus = questionsAnswered.get(questionId) ?? {
                timestamp: 0,
                correct: false,
            } satisfies QuestionStatus;

            if (timelog.endTimestamp > questionStatus.timestamp) {
                questionStatus.timestamp = timelog.endTimestamp;
                questionStatus.correct = timelog.correct;
            }

            userSummary.timestamp = Math.min(userSummary.timestamp, timelog.startTimestamp);
            userSummary.timeTaken = Math.max(userSummary.timeTaken, timelog.endTimestamp - userSummary.timestamp);
            userSummary.questionsAnswered = questionsAnswered.size;

            summaryUsers.set(user.id, userSummary);
            questionsAnswered.set(questionId, questionStatus);
            questionsAnsweredMap.set(user.id, questionsAnswered);
        }

        for (const [userId, userSummary] of summaryUsers) {
            const questionsAnswered = questionsAnsweredMap.get(userId)!;

            for (const { correct } of questionsAnswered.values()) {
                if (correct) {
                    userSummary.correctQuestions++;
                }
            }

            const accuracy = (userSummary.correctQuestions / config.getTotalQuestions(userSummary.group)!) * 100;

            userSummary.accuracy = accuracy;

            totalAccuracy += accuracy;
            totalTimeTaken += userSummary.timeTaken;
            totalQuestionsAnswered += userSummary.questionsAnswered;
        }

        return {
            averageAccuracy: totalAccuracy / summaryUsers.size,
            averageTimeTaken: totalTimeTaken / summaryUsers.size,
            totalQuestionsAnswered,
            users: [...summaryUsers.values()],
        };
    }
}

type QuestionStatus = {
    timestamp: number;
    correct: boolean;
};
