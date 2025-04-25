// apps/frontend/src/pages/AnalyticsDashboard.tsx
import { useState, useEffect } from "react";
import { TestResults } from "@/utils/RavenAnalytics";
import { useTheme } from "@/hooks/useTheme";

// Types for processed data
interface ParticipantSummary {
  participantId: string;
  groupName: string;
  protocolName: string;
  totalTime: number;
  totalCorrect: number;
  correctPercentage: number;
  averageResponseTime: number;
  totalOptionChanges: number;
  averageConfidenceScore: number;
  totalHesitations: number;
  totalAttentionLapses: number;
}

interface GroupStats {
  groupName: string;
  participantCount: number;
  avgCorrectPercentage: number;
  avgResponseTime: number;
  avgOptionChanges: number;
  avgConfidenceScore: number;
  avgHesitations: number;
  avgAttentionLapses: number;
}

interface ErrorAnalysis {
  errorType: string;
  count: number;
  percentage: number;
}

// Component to display the dashboard
const AnalyticsDashboard = () => {
  const [testResults, setTestResults] = useState<TestResults[]>([]);
  const [participantSummaries, setParticipantSummaries] = useState<
    ParticipantSummary[]
  >([]);
  const [groupStats, setGroupStats] = useState<GroupStats[]>([]);
  const [errorAnalysis, setErrorAnalysis] = useState<ErrorAnalysis[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(
    null
  );
  const [selectedTab, setSelectedTab] = useState<
    "participants" | "groups" | "details" | "errors"
  >("participants");
  const { theme } = useTheme(); // Use theme context

  // Load data from localStorage on init
  useEffect(() => {
    const loadTestResults = () => {
      try {
        console.log("Loading test results from localStorage");
        setLoading(true);
        const results: TestResults[] = [];

        // Debug: list all localStorage keys
        console.log(
          "All localStorage keys:",
          Object.keys(localStorage).join(", ")
        );

        // Find all keys in localStorage that start with "raven_test_"
        let testKeysFound = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("raven_test_")) {
            testKeysFound++;
            const data = localStorage.getItem(key);
            if (data) {
              try {
                console.log(
                  `Found test data with key: ${key}, length: ${data.length}`
                );
                const parsedData = JSON.parse(data) as TestResults;
                console.log(
                  `Successfully parsed data for ${key}, participant: ${parsedData.participantId}`
                );
                results.push(parsedData);
              } catch (e) {
                console.error(`Error parsing data for ${key}:`, e);
              }
            } else {
              console.warn(`Key ${key} exists but has no data`);
            }
          }
        }

        console.log(
          `Found ${testKeysFound} test keys, successfully loaded ${results.length} results`
        );

        // If no test results found, create a dummy one for development testing
        if (results.length === 0) {
          console.log("No results found, creating a dummy result for testing");
          const dummyResult = createDummyTestResult();
          results.push(dummyResult);

          // Save the dummy result
          const key = `raven_test_${dummyResult.participantId}`;
          localStorage.setItem(key, JSON.stringify(dummyResult));
        }

        setTestResults(results);
        processTestResults(results);
        setLoading(false);
      } catch (error) {
        console.error("Error loading test results:", error);
        setLoading(false);
      }
    };

    loadTestResults();
  }, []);

  // Create a dummy test result for development and testing
  const createDummyTestResult = (): TestResults => {
    const now = Date.now();
    return {
      participantId: `dummy_${now}`,
      groupName: "control",
      protocolName: "control",
      startTime: now - 300000, // 5 minutes ago
      endTime: now,
      totalTime: 300000,
      questions: [
        {
          phaseIndex: 0,
          questionIndex: 0,
          startTime: now - 300000,
          endTime: now - 280000,
          timeTaken: 20000,
          selectedOption: "option1",
          isCorrect: true,
          interactions: [],
          optionChanges: 1,
          attentionLapses: [],
          hesitations: [],
          hoverPattern: {},
          confidenceScore: 80,
        },
        {
          phaseIndex: 0,
          questionIndex: 1,
          startTime: now - 280000,
          endTime: now - 250000,
          timeTaken: 30000,
          selectedOption: "option2",
          isCorrect: false,
          interactions: [],
          optionChanges: 2,
          attentionLapses: [
            { start: now - 270000, end: now - 265000, duration: 5000 },
          ],
          hesitations: [
            { timestamp: now - 265000, duration: 4000, beforeAction: "select" },
          ],
          hoverPattern: {},
          confidenceScore: 60,
        },
      ],
      totalCorrect: 1,
      errorPattern: {
        consecutiveErrors: 1,
        errorsByPhase: { 0: 1 },
        errorsByType: { "confusion-error": 1 },
      },
      learningCurve: {
        timeProgressionByPhase: [25000],
        accuracyProgressionByPhase: [50],
      },
      metadata: {
        userAgent: navigator.userAgent,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        language: navigator.language,
        timestamp: now - 300000,
      },
    };
  };

  // Process results to get summaries and statistics
  const processTestResults = (results: TestResults[]) => {
    console.log(`Processing ${results.length} test results`);

    // Generate participant summaries
    const summaries: ParticipantSummary[] = results.map((result) => {
      const completedQuestions = result.questions.filter(
        (q) => q.endTime !== undefined
      );
      const totalQuestions = completedQuestions.length || 1; // Avoid division by zero

      const totalResponseTime = completedQuestions.reduce(
        (sum, q) => sum + (q.timeTaken || 0),
        0
      );

      const totalOptionChanges = completedQuestions.reduce(
        (sum, q) => sum + q.optionChanges,
        0
      );

      const totalConfidenceScore = completedQuestions.reduce(
        (sum, q) => sum + (q.confidenceScore || 0),
        0
      );

      const totalHesitations = completedQuestions.reduce(
        (sum, q) => sum + (q.hesitations?.length || 0),
        0
      );

      const totalAttentionLapses = completedQuestions.reduce(
        (sum, q) => sum + (q.attentionLapses?.length || 0),
        0
      );

      return {
        participantId: result.participantId,
        groupName: result.groupName,
        protocolName: result.protocolName,
        totalTime: (result.totalTime || 0) / 1000, // Convert to seconds
        totalCorrect: result.totalCorrect,
        correctPercentage: (result.totalCorrect / totalQuestions) * 100,
        averageResponseTime: totalResponseTime / totalQuestions / 1000, // Convert to seconds
        totalOptionChanges: totalOptionChanges,
        averageConfidenceScore: totalConfidenceScore / totalQuestions,
        totalHesitations: totalHesitations,
        totalAttentionLapses: totalAttentionLapses,
      };
    });

    console.log(`Generated ${summaries.length} participant summaries`);
    setParticipantSummaries(summaries);

    // Generate group statistics
    const groupData: { [groupName: string]: GroupStats } = {};

    summaries.forEach((summary) => {
      if (!groupData[summary.groupName]) {
        groupData[summary.groupName] = {
          groupName: summary.groupName,
          participantCount: 0,
          avgCorrectPercentage: 0,
          avgResponseTime: 0,
          avgOptionChanges: 0,
          avgConfidenceScore: 0,
          avgHesitations: 0,
          avgAttentionLapses: 0,
        };
      }

      const group = groupData[summary.groupName];
      group.participantCount++;
      group.avgCorrectPercentage += summary.correctPercentage;
      group.avgResponseTime += summary.averageResponseTime;
      group.avgOptionChanges += summary.totalOptionChanges;
      group.avgConfidenceScore += summary.averageConfidenceScore;
      group.avgHesitations += summary.totalHesitations;
      group.avgAttentionLapses += summary.totalAttentionLapses;
    });

    // Calculate averages
    const groupStatsArray = Object.values(groupData).map((group) => ({
      ...group,
      avgCorrectPercentage: group.avgCorrectPercentage / group.participantCount,
      avgResponseTime: group.avgResponseTime / group.participantCount,
      avgOptionChanges: group.avgOptionChanges / group.participantCount,
      avgConfidenceScore: group.avgConfidenceScore / group.participantCount,
      avgHesitations: group.avgHesitations / group.participantCount,
      avgAttentionLapses: group.avgAttentionLapses / group.participantCount,
    }));

    console.log(`Generated statistics for ${groupStatsArray.length} groups`);
    setGroupStats(groupStatsArray);

    // Analyze error patterns
    analyzeErrorPatterns(results);
  };

  // Analyze error patterns across all participants
  const analyzeErrorPatterns = (results: TestResults[]) => {
    // Collect all error types
    const allErrors: { [errorType: string]: number } = {};
    let totalErrors = 0;

    results.forEach((result) => {
      if (result.errorPattern && result.errorPattern.errorsByType) {
        Object.entries(result.errorPattern.errorsByType).forEach(
          ([type, count]) => {
            if (!allErrors[type]) {
              allErrors[type] = 0;
            }
            allErrors[type] += count;
            totalErrors += count;
          }
        );
      }
    });

    // Convert to array and calculate percentages
    const errorAnalysisArray = Object.entries(allErrors).map(
      ([errorType, count]) => ({
        errorType,
        count,
        percentage: totalErrors > 0 ? (count / totalErrors) * 100 : 0,
      })
    );

    // Sort by count (descending)
    errorAnalysisArray.sort((a, b) => b.count - a.count);

    console.log(
      `Analyzed error patterns: ${errorAnalysisArray.length} types found`
    );
    setErrorAnalysis(errorAnalysisArray);
  };

  // Find detailed data for a participant
  const getParticipantDetails = (
    participantId: string
  ): TestResults | undefined => {
    return testResults.find((result) => result.participantId === participantId);
  };

  // Export all data as CSV
  const exportToCSV = () => {
    // Create data for participant CSV
    let csv =
      "Participant ID,Group,Protocol,Total Time (s),Correct Answers,Accuracy %,Avg Response Time (s),Option Changes,Confidence Score,Hesitations,Attention Lapses\n";

    participantSummaries.forEach((p) => {
      csv += `${p.participantId},${p.groupName},${
        p.protocolName
      },${p.totalTime.toFixed(2)},`;
      csv += `${p.totalCorrect},${p.correctPercentage.toFixed(
        1
      )},${p.averageResponseTime.toFixed(2)},`;
      csv += `${p.totalOptionChanges},${p.averageConfidenceScore.toFixed(1)},${
        p.totalHesitations
      },${p.totalAttentionLapses}\n`;
    });

    // Create the file and download it
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "raven_test_analytics.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Export detailed data for a participant
  const exportParticipantData = (participantId: string) => {
    const participant = getParticipantDetails(participantId);
    if (!participant) return;

    const json = JSON.stringify(participant, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `raven_participant_${participantId}.json`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Styles based on theme
  const getTableStyle = () => {
    return {
      width: "100%",
      borderCollapse: "collapse" as const,
      marginTop: "15px",
      color: theme === "dark" ? "#e0e0e0" : "#333",
    };
  };

  const getHeaderStyle = () => {
    return {
      backgroundColor: theme === "dark" ? "#444" : "#f2f2f2",
      borderBottom: `1px solid ${theme === "dark" ? "#555" : "#ddd"}`,
    };
  };

  const getCellStyle = () => {
    return {
      padding: "8px",
      textAlign: "center" as const,
      borderBottom: `1px solid ${theme === "dark" ? "#555" : "#ddd"}`,
    };
  };

  // Render participants tab
  const renderParticipantsTab = () => (
    <div>
      <h3>Participant Summary</h3>
      <button onClick={exportToCSV}>Export to CSV</button>

      <table style={getTableStyle()}>
        <thead>
          <tr style={getHeaderStyle()}>
            <th style={getCellStyle()}>ID</th>
            <th style={getCellStyle()}>Group</th>
            <th style={getCellStyle()}>Protocol</th>
            <th style={getCellStyle()}>Time (s)</th>
            <th style={getCellStyle()}>Correct</th>
            <th style={getCellStyle()}>Accuracy %</th>
            <th style={getCellStyle()}>Avg Time (s)</th>
            <th style={getCellStyle()}>Changes</th>
            <th style={getCellStyle()}>Confidence</th>
            <th style={getCellStyle()}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {participantSummaries.map((participant) => (
            <tr key={participant.participantId}>
              <td style={getCellStyle()}>
                {participant.participantId.slice(-6)}
              </td>
              <td style={getCellStyle()}>{participant.groupName}</td>
              <td style={getCellStyle()}>{participant.protocolName}</td>
              <td style={getCellStyle()}>{participant.totalTime.toFixed(2)}</td>
              <td style={getCellStyle()}>{participant.totalCorrect}</td>
              <td style={getCellStyle()}>
                {participant.correctPercentage.toFixed(1)}%
              </td>
              <td style={getCellStyle()}>
                {participant.averageResponseTime.toFixed(2)}
              </td>
              <td style={getCellStyle()}>{participant.totalOptionChanges}</td>
              <td style={getCellStyle()}>
                {participant.averageConfidenceScore.toFixed(1)}%
              </td>
              <td style={getCellStyle()}>
                <button
                  onClick={() => {
                    setSelectedParticipant(participant.participantId);
                    setSelectedTab("details");
                  }}
                  style={{ marginRight: "5px" }}
                >
                  Details
                </button>
                <button
                  onClick={() =>
                    exportParticipantData(participant.participantId)
                  }
                >
                  Export
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render groups statistics tab
  const renderGroupsTab = () => (
    <div>
      <h3>Group Statistics</h3>

      <table style={getTableStyle()}>
        <thead>
          <tr style={getHeaderStyle()}>
            <th style={getCellStyle()}>Group</th>
            <th style={getCellStyle()}>Participants</th>
            <th style={getCellStyle()}>Accuracy %</th>
            <th style={getCellStyle()}>Avg Response (s)</th>
            <th style={getCellStyle()}>Avg Changes</th>
            <th style={getCellStyle()}>Avg Confidence</th>
            <th style={getCellStyle()}>Avg Hesitations</th>
            <th style={getCellStyle()}>Avg Att. Lapses</th>
          </tr>
        </thead>
        <tbody>
          {groupStats.map((group) => (
            <tr key={group.groupName}>
              <td style={getCellStyle()}>{group.groupName}</td>
              <td style={getCellStyle()}>{group.participantCount}</td>
              <td style={getCellStyle()}>
                {group.avgCorrectPercentage.toFixed(1)}%
              </td>
              <td style={getCellStyle()}>
                {group.avgResponseTime.toFixed(2)}s
              </td>
              <td style={getCellStyle()}>
                {group.avgOptionChanges.toFixed(1)}
              </td>
              <td style={getCellStyle()}>
                {group.avgConfidenceScore.toFixed(1)}%
              </td>
              <td style={getCellStyle()}>{group.avgHesitations.toFixed(1)}</td>
              <td style={getCellStyle()}>
                {group.avgAttentionLapses.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render error analysis tab
  const renderErrorsTab = () => (
    <div>
      <h3>Error Pattern Analysis</h3>

      <table style={getTableStyle()}>
        <thead>
          <tr style={getHeaderStyle()}>
            <th style={getCellStyle()}>Error Type</th>
            <th style={getCellStyle()}>Occurrence</th>
            <th style={getCellStyle()}>Percentage</th>
            <th style={getCellStyle()}>Description</th>
          </tr>
        </thead>
        <tbody>
          {errorAnalysis.map((error) => (
            <tr key={error.errorType}>
              <td style={getCellStyle()}>{error.errorType}</td>
              <td style={getCellStyle()}>{error.count}</td>
              <td style={getCellStyle()}>{error.percentage.toFixed(1)}%</td>
              <td style={{ ...getCellStyle(), textAlign: "left" }}>
                {getErrorDescription(error.errorType)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Get error description
  const getErrorDescription = (errorType: string): string => {
    switch (errorType) {
      case "hasty-error":
        return "User responded too quickly, possibly without fully analyzing the pattern";
      case "confusion-error":
        return "User spent excessive time, suggesting difficulty understanding the pattern";
      case "indecision-error":
        return "User changed their mind multiple times, indicating uncertainty";
      case "attention-error":
        return "User had attention lapses during this question";
      default:
        return "Unclassified error";
    }
  };

  // Render participant details
  const renderParticipantDetails = () => {
    if (!selectedParticipant) return <div>No participant selected</div>;

    const participant = getParticipantDetails(selectedParticipant);
    if (!participant) return <div>Data not found</div>;

    return (
      <div>
        <button
          onClick={() => setSelectedTab("participants")}
          style={{ marginBottom: "15px" }}
        >
          ← Back to list
        </button>

        <h3>Participant Details: {selectedParticipant}</h3>

        <div style={{ marginBottom: "20px" }}>
          <h4>General Information</h4>
          <p>
            <strong>Group:</strong> {participant.groupName}
          </p>
          <p>
            <strong>Protocol:</strong> {participant.protocolName}
          </p>
          <p>
            <strong>Total time:</strong>{" "}
            {((participant.totalTime || 0) / 1000).toFixed(2)} seconds
          </p>
          <p>
            <strong>Correct answers:</strong> {participant.totalCorrect}
          </p>
          <p>
            <strong>Consecutive errors:</strong>{" "}
            {participant.errorPattern?.consecutiveErrors || 0}
          </p>
        </div>

        <h4>Learning Curve</h4>
        <table style={getTableStyle()}>
          <thead>
            <tr style={getHeaderStyle()}>
              <th style={getCellStyle()}>Phase</th>
              <th style={getCellStyle()}>Avg Time (s)</th>
              <th style={getCellStyle()}>Accuracy %</th>
            </tr>
          </thead>
          <tbody>
            {participant.learningCurve?.timeProgressionByPhase?.map(
              (time, index) => (
                <tr key={index}>
                  <td style={getCellStyle()}>{index + 1}</td>
                  <td style={getCellStyle()}>{(time / 1000).toFixed(2)}</td>
                  <td style={getCellStyle()}>
                    {participant.learningCurve?.accuracyProgressionByPhase?.[
                      index
                    ]?.toFixed(1) || 0}
                    %
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        <h4>Question Details</h4>
        <table style={getTableStyle()}>
          <thead>
            <tr style={getHeaderStyle()}>
              <th style={getCellStyle()}>Phase</th>
              <th style={getCellStyle()}>Question</th>
              <th style={getCellStyle()}>Time (s)</th>
              <th style={getCellStyle()}>Correct</th>
              <th style={getCellStyle()}>Changes</th>
              <th style={getCellStyle()}>Confidence</th>
              <th style={getCellStyle()}>Hesitations</th>
              <th style={getCellStyle()}>Att. Lapses</th>
            </tr>
          </thead>
          <tbody>
            {participant.questions.map((q, index) => (
              <tr key={index}>
                <td style={getCellStyle()}>{q.phaseIndex + 1}</td>
                <td style={getCellStyle()}>{q.questionIndex + 1}</td>
                <td style={getCellStyle()}>
                  {q.timeTaken ? (q.timeTaken / 1000).toFixed(2) : "-"}
                </td>
                <td style={getCellStyle()}>{q.isCorrect ? "✓" : "✗"}</td>
                <td style={getCellStyle()}>{q.optionChanges}</td>
                <td style={getCellStyle()}>
                  {q.confidenceScore?.toFixed(1) || "-"}%
                </td>
                <td style={getCellStyle()}>{q.hesitations?.length || 0}</td>
                <td style={getCellStyle()}>{q.attentionLapses?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={() => exportParticipantData(selectedParticipant)}
          style={{ marginTop: "15px" }}
        >
          Export complete data
        </button>
      </div>
    );
  };

  // Loading screen
  if (loading) {
    return <div>Loading analysis data...</div>;
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: theme === "dark" ? "#333" : "#fff",
        color: theme === "dark" ? "#e0e0e0" : "#333",
        minHeight: "100vh",
      }}
    >
      <h2>Analytics Dashboard - Raven's Progressive Matrices Test</h2>

      {/* Navigation tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: `1px solid ${theme === "dark" ? "#555" : "#ddd"}`,
          marginBottom: "20px",
        }}
      >
        <div
          onClick={() => setSelectedTab("participants")}
          style={{
            padding: "10px 15px",
            cursor: "pointer",
            backgroundColor:
              selectedTab === "participants"
                ? theme === "dark"
                  ? "#444"
                  : "#f0f0f0"
                : "transparent",
            fontWeight: selectedTab === "participants" ? "bold" : "normal",
          }}
        >
          Participants
        </div>
        <div
          onClick={() => setSelectedTab("groups")}
          style={{
            padding: "10px 15px",
            cursor: "pointer",
            backgroundColor:
              selectedTab === "groups"
                ? theme === "dark"
                  ? "#444"
                  : "#f0f0f0"
                : "transparent",
            fontWeight: selectedTab === "groups" ? "bold" : "normal",
          }}
        >
          Groups
        </div>
        <div
          onClick={() => setSelectedTab("errors")}
          style={{
            padding: "10px 15px",
            cursor: "pointer",
            backgroundColor:
              selectedTab === "errors"
                ? theme === "dark"
                  ? "#444"
                  : "#f0f0f0"
                : "transparent",
            fontWeight: selectedTab === "errors" ? "bold" : "normal",
          }}
        >
          Error Analysis
        </div>
      </div>

      {/* Content based on selected tab */}
      {selectedTab === "participants" && renderParticipantsTab()}
      {selectedTab === "groups" && renderGroupsTab()}
      {selectedTab === "errors" && renderErrorsTab()}
      {selectedTab === "details" && renderParticipantDetails()}
    </div>
  );
};

export default AnalyticsDashboard;
