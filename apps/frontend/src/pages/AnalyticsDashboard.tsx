import { Timelog } from "@/analytics/TestAnalytics";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTheme } from "@/hooks/useTheme";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowLeft,
  faChartLine,
  faCheckCircle,
  faDownload,
  faExclamationTriangle,
  faFileExport,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@pocopi/config";
import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, Row, Spinner, Tab, Table, Tabs } from "react-bootstrap";

type UserSummary = {
  userId: string;
  name: string;
  timestamp: number;
  date: string;
  totalTime: number;
  totalCorrect: number;
  totalQuestions: number;
  correctPercentage: number;
  email?: string;
};

type UserData = {
  id: string;
  username: string;
  email: string;
  age: number;
};

type AnalyticsDashboardProps = {
  onBack: () => void;
};

/**
 * Dashboard para ver los resultados del test
 */
export function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const [timelogs, setTimelogs] = useState(new Map<string, Timelog[]>());
  const [participants, setParticipants] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("participants");
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Obteniendo datos del backend");

      // Obtener timelogs
      const [timelogsResponse, usersResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/timelog`),
        fetch(`${import.meta.env.VITE_API_URL}/users`)
      ]);

      if (!timelogsResponse.ok) {
        setLoading(false);
        console.error("Error cargando timelogs:", await timelogsResponse.text());
        setError("Error al cargar los resultados. Por favor, actualiza la página.");
        return;
      }

      const timelogs = await timelogsResponse.json() as Timelog[];
      const users = usersResponse.ok ? await usersResponse.json() as UserData[] : [];

      // Crear un mapa de usuarios para búsqueda rápida
      const userMap = new Map<string, UserData>();
      users.forEach(user => userMap.set(user.id, user));

      // Agrupar timelogs por usuario
      const userTimelogs = new Map<string, Timelog[]>();
      const userSummaries = new Map<string, UserSummary>();

      for (const timelog of timelogs) {
        // Agregar el timelog al mapa de usuario
        const currentUserTimelogs = userTimelogs.get(timelog.userId) || [];
        currentUserTimelogs.push(timelog);
        userTimelogs.set(timelog.userId, currentUserTimelogs);

        // Actualizar o crear el resumen del usuario
        let userSummary = userSummaries.get(timelog.userId);

        if (!userSummary) {
          const userData = userMap.get(timelog.userId);
          userSummary = {
            userId: timelog.userId,
            name: userData?.username || "Usuario Desconocido",
            email: userData?.email,
            timestamp: timelog.startTimestamp,
            date: new Date(timelog.startTimestamp).toLocaleString(),
            totalTime: 0,
            totalCorrect: 0,
            totalQuestions: 0,
            correctPercentage: 0,
          };
          userSummaries.set(timelog.userId, userSummary);
        }

        // Actualizar estadísticas
        userSummary.totalQuestions++;
        if (timelog.correct) {
          userSummary.totalCorrect++;
        }

        // Actualizar timestamp más temprano
        if (timelog.startTimestamp < userSummary.timestamp) {
          userSummary.timestamp = timelog.startTimestamp;
          userSummary.date = new Date(timelog.startTimestamp).toLocaleString();
        }
      }

      // Calcular tiempo total y porcentaje correcto para cada usuario
      userSummaries.forEach((summary, userId) => {
        const userLogs = userTimelogs.get(userId) || [];

        if (userLogs.length > 0) {
          // Encontrar el timestamp más temprano y más tardío
          const minTimestamp = Math.min(...userLogs.map(log => log.startTimestamp));
          const maxTimestamp = Math.max(...userLogs.map(log => log.endTimestamp));

          // Calcular tiempo total en segundos
          summary.totalTime = (maxTimestamp - minTimestamp) / 1000;

          // Calcular porcentaje correcto
          summary.correctPercentage = summary.totalQuestions > 0
            ? (summary.totalCorrect / summary.totalQuestions) * 100
            : 0;
        }
      });

      setTimelogs(userTimelogs);
      setParticipants(Array.from(userSummaries.values()));
      setLoading(false);

      if (userSummaries.size === 0) {
        setError(
          "No se encontraron resultados. Los usuarios deben completar el test para ver los resultados aquí."
        );
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
      setError("Error al cargar los resultados. Por favor, actualiza la página.");
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    try {
      let csv = "ID Participante,Nombre,Email,Fecha,Tiempo Total (s),Respuestas Correctas,Total Preguntas,Precisión %\n";

      participants.forEach((p) => {
        csv += `${p.userId},${p.name},${p.email || "N/A"},${p.date},`;
        csv += `${p.totalTime.toFixed(2)},${p.totalCorrect},${p.totalQuestions},${p.correctPercentage.toFixed(1)}\n`;
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", "resultados_test.csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exportando CSV:", error);
      setError("Error al exportar los datos como CSV.");
    }
  };

  const exportUserTimelogs = (userId: string) => {
    const userTimelogs = timelogs.get(userId);
    if (!userTimelogs) return;

    try {
      const participant = participants.find(p => p.userId === userId);
      const exportData = {
        participant: {
          id: userId,
          name: participant?.name || "Desconocido",
          email: participant?.email || "N/A",
          totalTime: participant?.totalTime || 0,
          totalCorrect: participant?.totalCorrect || 0,
          totalQuestions: participant?.totalQuestions || 0,
          correctPercentage: participant?.correctPercentage || 0
        },
        timelogs: userTimelogs
      };

      const json = JSON.stringify(exportData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", `participante_${userId}_resultados.json`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exportando datos del participante:", error);
      setError(`Error al exportar los datos del participante ${userId}.`);
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p>Cargando resultados del test...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className={`p-4 min-vh-100 ${isDarkMode ? "bg-dark text-light" : "bg-light"
        }`}
    >
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="d-flex align-items-center">
              <FontAwesomeIcon
                icon={faChartLine}
                className="me-2 text-primary"
              />
              {config.title} - Analíticas
            </h2>
            <Button
              variant={isDarkMode ? "outline-light" : "outline-dark"}
              onClick={onBack}
              className="d-flex align-items-center"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Volver al Inicio
            </Button>
          </div>
          <p className="text-secondary">
            Ver y exportar los resultados del test de los participantes.
          </p>
        </Col>
      </Row>

      {/* Alerta de error si es necesario */}
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="warning" className="d-flex align-items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Pestañas para diferentes vistas */}
      <Row className="mb-4">
        <Col>
          <Tabs
            id="dashboard-tabs"
            activeKey={selectedTab}
            onSelect={(k) => k && setSelectedTab(k)}
            className={isDarkMode ? "text-white" : ""}
          >
            <Tab eventKey="participants" title="Lista de Participantes">
              <Card
                className={`border-0 shadow-sm ${isDarkMode ? "bg-dark" : ""}`}
              >
                <Card.Header className="d-flex justify-content-between align-items-center bg-transparent border-bottom-0 pt-4">
                  <h5 className="mb-0">Resultados del Test</h5>
                  <div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={exportToCSV}
                      className="me-2"
                      disabled={participants.length === 0}
                    >
                      <FontAwesomeIcon icon={faDownload} className="me-2" />
                      Exportar CSV
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="px-0 pt-0">
                  {participants.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted mb-0">
                        No hay resultados disponibles todavía
                      </p>
                    </div>
                  ) : (
                    <Table
                      responsive
                      hover
                      className={isDarkMode ? "table-dark" : ""}
                    >
                      <thead>
                        <tr>
                          <th>Participante</th>
                          <th>Fecha</th>
                          <th>Tiempo (s)</th>
                          <th>Correctas</th>
                          <th>Total</th>
                          <th>Precisión</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {participants.map((participant) => (
                          <tr key={participant.userId}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div
                                  className={`p-2 rounded-circle me-2 ${isDarkMode
                                    ? "bg-primary bg-opacity-10"
                                    : "bg-light"
                                    }`}
                                >
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-primary"
                                  />
                                </div>
                                <div>
                                  <div className="fw-medium">
                                    {participant.name}
                                  </div>
                                  <small className="text-secondary">
                                    ID: {participant.userId}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>{participant.date}</td>
                            <td>{participant.totalTime.toFixed(2)}</td>
                            <td>{participant.totalCorrect}</td>
                            <td>{participant.totalQuestions}</td>
                            <td>
                              <Badge
                                bg={getAccuracyBadgeColor(
                                  participant.correctPercentage
                                )}
                                className="px-2 py-1"
                              >
                                {participant.correctPercentage.toFixed(1)}%
                              </Badge>
                            </td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() =>
                                  exportUserTimelogs(
                                    participant.userId
                                  )
                                }
                                title="Exportar resultados detallados"
                              >
                                <FontAwesomeIcon icon={faFileExport} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="summary" title="Resumen">
              <Card
                className={`border-0 shadow-sm ${isDarkMode ? "bg-dark" : ""}`}
              >
                <Card.Body>
                  <Row className="g-4">
                    <Col md={6} lg={3}>
                      <StatCard
                        title="Total Participantes"
                        value={participants.length.toString()}
                        icon={faUser}
                        isDarkMode={isDarkMode}
                      />
                    </Col>
                    <Col md={6} lg={3}>
                      <StatCard
                        title="Precisión Promedio"
                        value={`${calculateAverageAccuracy(participants)}%`}
                        icon={faCheckCircle}
                        isDarkMode={isDarkMode}
                      />
                    </Col>
                    <Col md={6} lg={3}>
                      <StatCard
                        title="Tiempo Promedio"
                        value={`${calculateAverageTime(participants)} seg`}
                        icon={faChartLine}
                        isDarkMode={isDarkMode}
                      />
                    </Col>
                    <Col md={6} lg={3}>
                      <StatCard
                        title="Total Preguntas"
                        value={`${calculateTotalQuestions(participants)}`}
                        icon={faChartLine}
                        isDarkMode={isDarkMode}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      <ThemeSwitcher />
    </Container>
  );
}

// Componente auxiliar para las tarjetas de estadísticas
type StatCardProps = {
  title: string;
  value: string;
  icon: IconProp;
  isDarkMode: boolean;
};

function StatCard({ title, value, icon, isDarkMode }: StatCardProps) {
  return (
    <Card
      className={`border-0 h-100 ${isDarkMode ? "bg-dark bg-opacity-50 border-secondary" : "bg-white"
        }`}
    >
      <Card.Body className="d-flex align-items-center">
        <div
          className={`me-3 p-3 rounded-circle ${isDarkMode ? "bg-primary bg-opacity-10" : "bg-light"
            }`}
        >
          <FontAwesomeIcon icon={icon} className="text-primary fa-lg" />
        </div>
        <div>
          <h6 className="text-secondary mb-1">{title}</h6>
          <h4 className="mb-0">{value}</h4>
        </div>
      </Card.Body>
    </Card>
  );
}

// Función auxiliar para determinar el color del badge según la precisión
function getAccuracyBadgeColor(accuracy: number): string {
  if (accuracy >= 90) return "success";
  if (accuracy >= 70) return "primary";
  if (accuracy >= 50) return "warning";
  return "danger";
}

// Función auxiliar para calcular la precisión promedio
function calculateAverageAccuracy(participants: UserSummary[]): string {
  if (participants.length === 0) return "0.0";

  const total = participants.reduce((sum, p) => sum + p.correctPercentage, 0);
  return (total / participants.length).toFixed(1);
}

// Función auxiliar para calcular el tiempo promedio
function calculateAverageTime(participants: UserSummary[]): string {
  if (participants.length === 0) return "0.0";

  const total = participants.reduce((sum, p) => sum + p.totalTime, 0);
  return (total / participants.length).toFixed(1);
}

// Función auxiliar para calcular el total de preguntas respondidas
function calculateTotalQuestions(participants: UserSummary[]): number {
  return participants.reduce((sum, p) => sum + p.totalQuestions, 0);
}