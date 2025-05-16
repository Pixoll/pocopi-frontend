// Header de la página de inicio con título y subtítulo
// Recibe la prop isDarkMode para ajustar el estilo

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";

interface HomeHeaderProps {
  isDarkMode: boolean;
}

const HomeHeader = ({ isDarkMode }: HomeHeaderProps) => (
  <div className="text-center mb-5 fade-in">
    {/* Ícono decorativo */}
    <div
      className={`d-inline-block mb-3 p-3 rounded-circle ${
        isDarkMode ? "bg-primary bg-opacity-25" : "bg-primary bg-opacity-10"
      }`}
    >
      <FontAwesomeIcon
        icon={faBrain}
        className="text-primary"
        style={{ fontSize: "2.5rem" }}
      />
    </div>
    {/* Título principal */}
    <h1 className="display-4 fw-bold mb-3">
      Raven's Progressive
      <span className="text-primary"> Matrices Test</span>
    </h1>
    {/* Subtítulo */}
    <p className="lead opacity-75 mb-0">
      An assessment to measure analytical reasoning and problem-solving skills
    </p>
  </div>
);

export default HomeHeader;
