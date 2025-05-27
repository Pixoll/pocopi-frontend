// Service para manejar la persistencia y lógica de datos del estudiante
// Aquí se puede conectar con una API, localStorage, etc.

import { StudentData } from "@/types/student";

export const studentService = {
  // Guarda los datos del estudiante (ejemplo: en localStorage)
  saveStudentData: (data: StudentData) => {
    localStorage.setItem("studentData", JSON.stringify(data));
  },
  // Obtiene los datos del estudiante
  getStudentData: (): StudentData | null => {
    const data = localStorage.getItem("studentData");
    return data ? JSON.parse(data) : null;
  },
  // Limpia los datos del estudiante
  clearStudentData: () => {
    localStorage.removeItem("studentData");
  },
};
