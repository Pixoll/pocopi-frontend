import { RavenMatrixPage } from "@/pages/RavenMatrixPage";
import AnalyticsDashboard from "@/pages/AnalyticsDashboard";
import { JSX, useState, useEffect } from "react";
import { config } from "@pocopi/config";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import Welcome from "@/pages/Welcome";
import Form from "@/pages/Form";

enum Page {
    WELCOME,
    FORM,
    START,
    RAVEN_MATRIX,
    END,
    ADMIN_DASHBOARD,
}

export default function App(): JSX.Element {
  // State for navigation and group assignment
    const [page, setPage] = useState<Page>(Page.WELCOME);
  const [group, setGroup] = useState<string | null>(null);
  const [protocol, setProtocol] = useState<string | null>(null);

  // State for admin access
  const [showAdminPrompt, setShowAdminPrompt] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const ADMIN_PASSWORD = "admin123"; // Admin password (should be more secure in production)

    const goToFormPage = () => {
        setPage(Page.FORM);
    };

    const goToStartPage = () => {
        setPage(Page.START);
    };

  // Debug logging
  useEffect(() => {
    console.log("App component mounted. Current page:", page);
    console.log("Available protocols:", Object.keys(config.protocols));
    console.log("Available groups:", Object.keys(config.groups));
  }, []);

  // Assign group based on probabilities when test starts
  useEffect(() => {
    if (page !== Page.RAVEN_MATRIX || group !== null) return;

    const assignGroup = () => {
      const random = Math.random();
      let cumulativeProbability = 0;

      console.log("Assigning group based on random value:", random);

      for (const [groupName, groupConfig] of Object.entries(config.groups)) {
        cumulativeProbability += groupConfig.probability;
        console.log(
          `Group ${groupName}, probability ${groupConfig.probability}, cumulative ${cumulativeProbability}`
        );

        if (random <= cumulativeProbability) {
          setGroup(groupName);
          setProtocol(groupConfig.protocol);
          console.log(
            `Assigned to group: ${groupName}, protocol: ${groupConfig.protocol}`
          );
          return;
        }
      }

      // Fallback to first group if something fails
      const firstGroup = Object.keys(config.groups)[0];
      console.log("Fallback to first group:", firstGroup);
      setGroup(firstGroup);
      setProtocol(config.groups[firstGroup].protocol);
    };

    assignGroup();
  }, [page, group]);

  // Start the test
  const handleStartTest = () => {
    console.log("Starting test");
    setPage(Page.RAVEN_MATRIX);
  };

  // Reset the test
  const handleReset = () => {
    console.log("Resetting application state");
    setPage(Page.START);
    setGroup(null);
    setProtocol(null);
  };

  // Show admin prompt
  const toggleAdminPrompt = () => {
    console.log("Toggling admin prompt");
    setShowAdminPrompt(!showAdminPrompt);
    setAdminPassword("");
  };

  // Validate admin password
  const checkAdminPassword = () => {
    console.log("Checking admin password");
    if (adminPassword === ADMIN_PASSWORD) {
      console.log("Password correct - accessing admin dashboard");
      setPage(Page.ADMIN_DASHBOARD);
      setShowAdminPrompt(false);
    } else {
      console.log("Password incorrect");
      alert("Incorrect password");
    }
  };

  // Render content based on current page
  const renderContent = () => {
    console.log(
      "Rendering content for page:",
      page,
      "with protocol:",
      protocol
    );

    switch (page) {
        case Page.WELCOME:
            return <Welcome goToFormPage={goToFormPage} />;

        case Page.FORM:
            return <Form goToStartPage={goToStartPage}  />;

      case Page.START:
        return (
          <div
            style={{
                height: "100vh",
                width: "100vw",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <h1>Raven's Progressive Matrices Test</h1>
            <p>
              This test measures non-verbal intelligence and abstract reasoning
              ability.
            </p>
            <p>
              It consists of multiple questions where you need to identify
              patterns and select the option that completes the matrix.
            </p>

            <button
              onClick={handleStartTest}
              style={{
                padding: "12px 24px",
                fontSize: "18px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              Start Test
            </button>

            {/* Hidden button for admin access */}
            <div
              onClick={toggleAdminPrompt}
              style={{
                position: "fixed",
                bottom: "10px",
                right: "10px",
                padding: "5px",
                cursor: "pointer",
                opacity: 0.2,
              }}
            >
              Admin
            </div>
          </div>
        );

      case Page.RAVEN_MATRIX:
        if (!protocol) {
          return <div>Loading test...</div>;
        }
        return (
          <RavenMatrixPage
            protocol={protocol}
            goToNextPage={() => {
              console.log("Moving to end page");
              setPage(Page.END);
            }}
          />
        );

      case Page.END:
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <h1>Test Completed!</h1>
            <p>
              Thank you for participating in the Raven's Progressive Matrices
              Test.
            </p>
            <p>Your responses have been successfully recorded.</p>

            <button
              onClick={handleReset}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              Return to Start
            </button>
          </div>
        );

      case Page.ADMIN_DASHBOARD:
        return (
          <div>
            <div
              style={{
                padding: "10px",
                backgroundColor: "#f0f0f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0 }}>Admin Dashboard</h3>
              <button onClick={handleReset}>Exit</button>
            </div>
            <AnalyticsDashboard />
          </div>
        );

      default:
        return <div>Error: Page not found</div>;
    }
  };

  return (
    <ThemeProvider>
      {renderContent()}

      {/* Modal for admin password */}
      {showAdminPrompt && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
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
              borderRadius: "5px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h3>Admin Access</h3>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Password"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  checkAdminPassword();
                }
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={toggleAdminPrompt}>Cancel</button>
              <button onClick={checkAdminPassword}>Access</button>
            </div>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}
