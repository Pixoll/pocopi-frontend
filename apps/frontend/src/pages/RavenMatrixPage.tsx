// apps/frontend/src/pages/RavenMatrixPage.tsx
import { config } from "@pocopi/config";
import { useState, useEffect, useRef } from "react";
import styles from "./RavenMatrixPage.module.css";
import {
  RavenAnalytics,
  saveResultsToStorage,
  uploadResults,
} from "@/utils/RavenAnalytics";

type RavenMatrixPageProps = {
  protocol: string;
  goToNextPage: () => void;
};

export function RavenMatrixPage({
  protocol,
  goToNextPage,
}: RavenMatrixPageProps) {
  const [phase, setPhase] = useState<number>(0);
  const [question, setQuestion] = useState<number>(0);
  const [selected, setSelected] = useState<string>("");

  // States for analytics and measurements
  const analyticsRef = useRef<RavenAnalytics>(
    new RavenAnalytics("default", protocol)
  );
  const lastInteractionTime = useRef<number>(Date.now());
  const hoverStartTimeRef = useRef<{ [optionId: string]: number }>({});

  // States for results
  const [testComplete, setTestComplete] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [analysisStats, setAnalysisStats] = useState<any>(null);

  const { phases } = config.protocols[protocol];
  const { questions } = phases[phase];
  const { img, options: tempOptions } = questions[question];

  const options = tempOptions.map((option) => {
    // Ensure we get a unique ID for each option
    const base64 =
      option.src.split(";")[1]?.slice(7) || Math.random().toString(36);
    const half = Math.round(base64.length / 2);
    const id = base64.substring(half - 10, half + 10);

    return { id, ...option };
  });

  const optionsColumns = Math.ceil(options.length / 2);
  const isOptionsOdd = options.length % 2 === 1;

  // Initialize tracking for current question
  useEffect(() => {
    console.log(
      "Initializing tracking for phase:",
      phase,
      "question:",
      question
    );
    analyticsRef.current.startQuestion(phase, question);
  }, [phase, question]);

  // Debug logging
  useEffect(() => {
    console.log("RavenMatrixPage mounted with protocol:", protocol);

    // Return cleanup function
    return () => {
      console.log("RavenMatrixPage unmounting");
    };
  }, [protocol]);

  // Mouse movement tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    lastInteractionTime.current = Date.now();
    analyticsRef.current.recordMouseMove(e.clientX, e.clientY);
  };

  // Option hover tracking
  const handleOptionHover = (id: string, isEnter: boolean) => {
    const now = Date.now();

    if (isEnter) {
      // Start hover tracking
      hoverStartTimeRef.current[id] = now;
    } else if (hoverStartTimeRef.current[id]) {
      // End hover tracking and record duration
      const hoverDuration = now - hoverStartTimeRef.current[id];
      analyticsRef.current.recordHover(id, hoverDuration);
      delete hoverStartTimeRef.current[id];
    }
  };

  // Navigate to previous phase
  const handlePreviousPhaseClick = () => {
    if (phase > 0) {
      analyticsRef.current.recordInteraction("prevPhase");
      setQuestion(0);
      setPhase(phase - 1);
      setSelected("");
    }
  };

  // Navigate to next phase
  const handleNextPhaseClick = () => {
    analyticsRef.current.recordInteraction("nextPhase");

    // Update learning curve data for the completed phase
    analyticsRef.current.updateLearningCurve(phase);

    if (phase < phases.length - 1) {
      setQuestion(0);
      setPhase(phase + 1);
      setSelected("");
      return;
    }

    // Complete the test if we're at the last phase
    finishTest();
  };

  // Navigate to previous question
  const handlePreviousQuestionClick = () => {
    analyticsRef.current.recordInteraction("previous");

    if (question <= 0) {
      handlePreviousPhaseClick();
      return;
    }

    setQuestion(question - 1);
    setSelected("");
  };

  // Navigate to next question
  const handleNextQuestionClick = () => {
    // Check if an option is selected
    if (!selected) {
      return; // Don't proceed if nothing selected
    }

    // Check if the answer is correct
    const selectedOption = options.find((opt) => opt.id === selected);
    const isCorrect = selectedOption?.correct === true;

    console.log(
      "Completing question with selection:",
      selected,
      "correct:",
      isCorrect
    );

    // Complete the current question in analytics
    analyticsRef.current.completeQuestion(selected, isCorrect);

    if (question < questions.length - 1) {
      analyticsRef.current.recordInteraction("next");
      setQuestion(question + 1);
      setSelected("");
      return;
    }

    handleNextPhaseClick();
  };

  // Handle option selection
  const handleRavenOptionClick = (id: string) => {
    return () => {
      lastInteractionTime.current = Date.now();

      if (selected === "") {
        // First selection
        analyticsRef.current.recordInteraction("select", id);
      } else if (selected === id) {
        // Deselecting
        analyticsRef.current.recordInteraction("deselect", id);
      } else {
        // Changing selection
        analyticsRef.current.recordInteraction("change", id);
      }

      setSelected((v) => (v === id ? "" : id));
    };
  };

  // Complete the test
  const finishTest = () => {
    setTestComplete(true);

    // Complete analytics and save data
    const results = analyticsRef.current.completeTest();
    console.log("Test completed. Saving results:", results);
    saveResultsToStorage(results);

    // Get statistics to show
    const stats = analyticsRef.current.getSummaryStats();
    setAnalysisStats(stats);
    setShowResults(true);

    // Try to upload data to server
    uploadResults(results)
      .then(() => {
        console.log("Data uploaded successfully");
      })
      .catch((error) => {
        console.error("Error uploading data:", error);
      });

    // REMOVED automatic navigation to next page
    // The user must now explicitly click the Continue button
  };

  // Handle continue after results
  const handleContinue = () => {
    setShowResults(false);
    goToNextPage();
  };

  // Download data as JSON
  const handleDownloadData = () => {
    const jsonString = analyticsRef.current.exportToJSON();
    const dataBlob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `raven_test_results_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Show results modal if test is complete
  if (showResults && analysisStats) {
    return (
      <div className={styles.ravenMatrixPage}>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "80%",
              maxHeight: "80%",
              overflow: "auto",
            }}
          >
            <h2>Test Results</h2>
            <p>
              Total time: {(analysisStats.totalTime / 1000).toFixed(2)} seconds
            </p>
            <p>Correct answers: {analysisStats.totalCorrect}</p>
            <p>Accuracy: {analysisStats.correctPercentage.toFixed(1)}%</p>
            <p>Option changes: {analysisStats.totalOptionChanges}</p>
            <p>
              Confidence score:{" "}
              {analysisStats.averageConfidence?.toFixed(1) || "N/A"}%
            </p>

            <button
              onClick={handleDownloadData}
              style={{ marginRight: "10px" }}
            >
              Download complete data
            </button>
            <button onClick={handleContinue}>Continue</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.ravenMatrixPage} onMouseMove={handleMouseMove}>
      <div className={styles.phaseButtonsRow}>
        <span>Protocol: {protocol}</span>
        <span>
          Phase {phase + 1} of {phases.length}
        </span>
      </div>

      <div className={styles.ravenMatrixContainer} draggable={false}>
        <img
          className={styles.ravenMatrix}
          src={img.src}
          alt={img.alt}
          draggable={false}
        />

        <div
          className={styles.ravenOptionsContainer}
          draggable={false}
          style={{
            gridTemplateColumns: `repeat(${optionsColumns}, ${
              100 / optionsColumns
            }%)`,
          }}
        >
          {options.map((option, i) => (
            <img
              className={`
                ${styles.ravenOption}
                ${isOptionsOdd && i % 2 === 1 ? styles.oddRavenOption : ""}
                ${option.id === selected ? styles.selectedRavenOption : ""}
              `}
              key={option.id}
              src={option.src}
              alt={option.alt}
              onClick={handleRavenOptionClick(option.id)}
              onMouseEnter={() => handleOptionHover(option.id, true)}
              onMouseLeave={() => handleOptionHover(option.id, false)}
              draggable={false}
            />
          ))}
        </div>
      </div>

      <div className={styles.testButtonsRow}>
        <button
          onClick={handlePreviousQuestionClick}
          disabled={question === 0 && phase === 0}
        >
          Previous
        </button>
        <div>
          Question {question + 1} of {questions.length}
        </div>
        <button onClick={handleNextQuestionClick} disabled={!selected}>
          {phase === phases.length - 1 && question === questions.length - 1
            ? "Finish"
            : "Next"}
        </button>
      </div>
    </div>
  );
}
