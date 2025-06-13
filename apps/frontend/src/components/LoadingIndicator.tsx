import { config } from "@pocopi/config";
import { Container, Spinner } from "react-bootstrap";

export function LoadingIndicator() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="text-center">
        <Spinner animation="border" variant="primary" className="mb-3"/>
        <p>{config.t("dashboard.loadingResults")}</p>
      </div>
    </Container>
  );
}
