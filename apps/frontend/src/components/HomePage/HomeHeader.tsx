// Header de la página de inicio con título y subtítulo
// Recibe la prop isDarkMode para ajustar el estilo

import appIcon from "/app_icon.png?url";
import { config } from "@pocopi/config";
import "./HomeHeader.css"

export default function HomeHeader() {
  return (
    <div className="text-center mb-5 fade-in">
      <img className="d-inline-block mb-3 app-icon" src={appIcon} alt="App Icon"/>
      <h1 className="display-4 fw-bold mb-3">
        {config.title}
      </h1>
      {config.subtitle && (
        <p className="lead opacity-75 mb-0">
          {config.subtitle}
        </p>
      )}
    </div>
  );
}
