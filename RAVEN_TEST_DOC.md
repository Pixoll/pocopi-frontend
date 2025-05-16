# Documentación: Test de Matrices Progresivas de Raven

## ¿Qué es el Test de Raven?

El Test de Matrices Progresivas de Raven es una prueba psicométrica ampliamente utilizada para medir la inteligencia general, especialmente la capacidad de razonamiento analítico y la inteligencia no verbal. Consiste en una serie de problemas visuales donde el participante debe identificar el patrón que completa una matriz.

## ¿Cómo funciona la aplicación?

### Flujo general

1. **Pantalla de inicio (HomePage):**
   - El usuario ve una introducción al test y debe aceptar el consentimiento informado.
   - Se solicita información básica del participante (nombre, identificación, email, edad).
2. **Test de Raven (RavenMatrixPage):**
   - El test está dividido en fases y cada fase contiene varias preguntas.
   - En cada pregunta, el usuario ve una imagen con una matriz incompleta y varias opciones de respuesta (imágenes).
   - El usuario selecciona la opción que considera correcta y navega entre preguntas y fases.
   - El progreso se muestra visualmente.
3. **Finalización:**
   - Al terminar, se muestra un mensaje de agradecimiento y un resumen de la información registrada.
   - Los resultados se almacenan localmente y pueden ser usados para análisis posteriores.

### Estructura de datos y analítica

- **Datos del participante:**
  - Nombre
  - Identificación
  - Email
  - Edad
- **Datos recogidos durante el test:**
  - Tiempo de inicio y fin del test
  - Tiempo dedicado a cada pregunta
  - Opciones seleccionadas y cambios de selección
  - Respuestas correctas/incorrectas
  - Progreso y navegación (fases, preguntas)
  - Metadatos del dispositivo (user agent, resolución de pantalla, timestamp)

#### Ejemplo de estructura de resultados (`TestResults`)

```json
{
  "participantId": "user_123456",
  "groupName": "control",
  "protocolName": "control",
  "startTime": 1715790000000,
  "endTime": 1715790300000,
  "totalTime": 300000,
  "questions": [
    {
      "phaseIndex": 0,
      "questionIndex": 0,
      "startTime": 1715790000000,
      "endTime": 1715790010000,
      "timeTaken": 10000,
      "selectedOption": "abc123",
      "isCorrect": true,
      "optionChanges": 1
    }
    // ...
  ],
  "totalCorrect": 8,
  "metadata": {
    "userAgent": "Mozilla/5.0 ...",
    "screenWidth": 1920,
    "screenHeight": 1080,
    "timestamp": 1715790000000
  }
}
```

## ¿Qué mide el test?

- **Razonamiento analítico y abstracto**
- **Capacidad de identificar patrones**
- **Resolución de problemas no verbales**

## ¿Cómo se almacenan los datos?

- Los resultados y los datos del participante se guardan en el navegador (localStorage) bajo una clave única por usuario.
- Los datos pueden ser exportados o enviados a un backend para análisis grupal o investigación.

## Consideraciones éticas

- El test es voluntario y los datos se usan solo con fines académicos y de investigación.
- El participante puede abandonar el test en cualquier momento.
- La información personal se maneja de forma confidencial.

## Personalización y extensibilidad

- El test soporta múltiples protocolos y grupos experimentales (definidos en archivos de configuración YAML/JSON).
- Es posible agregar nuevas fases, preguntas y opciones simplemente editando los archivos de configuración.

## Tecnologías utilizadas

- **React** (frontend)
- **TypeScript**
- **React Bootstrap** (UI)
- **Vite** (build)
- **YAML/JSON** para configuración de protocolos y grupos
