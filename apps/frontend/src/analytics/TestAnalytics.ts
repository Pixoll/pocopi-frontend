import api, { type Timelog } from "@/api";

let timelogId = 1;

export class TestAnalytics {
  private readonly timelog: Timelog;
  private lastSelectedOptionId: number | null;

  constructor(userId: string, phaseId: number, questionId: number) {
    this.lastSelectedOptionId = null;
    this.timelog = {
      userId,
      phaseId,
      questionId,
      startTimestamp: Date.now(),
      endTimestamp: 0,
      correct: false,
      skipped: false,
      totalOptionChanges: 0,
      totalOptionHovers: 0,
      events: [],
    };
  }

  public async completeQuestion(selectedOption: boolean, correct: boolean): Promise<void> {
    this.timelog.skipped = !selectedOption;
    this.timelog.correct = correct;
    this.timelog.endTimestamp = Date.now();

    await this.sendTimelogToBackend();
  }

  public recordOptionSelect(optionId: number): void {
    if (this.lastSelectedOptionId !== null) {
      this.timelog.totalOptionChanges++;
    }

    this.lastSelectedOptionId = optionId;

    this.timelog.events.push({
      optionId,
      type: "select",
      timestamp: Date.now(),
    });

    console.log(`Saved select event for option ${optionId}`);
  }

  public recordOptionDeselect(optionId: number): void {
    this.timelog.events.push({
      optionId,
      type: "deselect",
      timestamp: Date.now(),
    });

    console.log(`Saved deselect event for option ${optionId}`);
  }

  public recordOptionHover(optionId: number): void {
    this.timelog.totalOptionHovers++;

    this.timelog.events.push({
      optionId,
      type: "hover",
      timestamp: Date.now(),
    });

    console.log(`Saved hover event for option ${optionId}`);
  }

  private async sendTimelogToBackend(): Promise<void> {
    console.log(`Sending timelog #${timelogId++} to backend`);

    try {
      const response = await api.saveTimelog({
        body: this.timelog,
      });

      if (response.error) {
        console.error("Error while sending timelog to backend:", response.error);
      }
    } catch (error) {
      console.error("Error while sending timelog to backend:", error);
    }
  }
}
