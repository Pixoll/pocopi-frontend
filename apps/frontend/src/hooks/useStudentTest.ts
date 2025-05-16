// Hook personalizado para manejar la lógica del test y el formulario del estudiante
// Permite separar la lógica de estado y acciones del componente HomePage

import { useState } from "react";
import { StudentData } from "@/types/student";
import { studentService } from "@/services/studentService";

export function useStudentTest() {
  // Estado para mostrar/ocultar el modal del formulario
  const [showModal, setShowModal] = useState(false);
  // Estado para saber si el consentimiento fue aceptado
  const [consentAccepted, setConsentAccepted] = useState(false);
  // Estado para almacenar los datos del estudiante
  const [studentData, setStudentData] = useState<StudentData | null>(null);

  // Abre el modal para ingresar datos
  const handleStartTest = () => setShowModal(true);
  // Cierra el modal
  const handleCloseModal = () => setShowModal(false);
  // Maneja el cambio del checkbox de consentimiento
  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setConsentAccepted(e.target.checked);
  // Maneja el envío del formulario del estudiante
  const handleFormSubmit = (data: StudentData) => {
    setStudentData(data);
    setShowModal(false);
    // Se podría guardar en localStorage o llamar a un API
    studentService.saveStudentData(data);
  };

  return {
    showModal,
    setShowModal,
    consentAccepted,
    setConsentAccepted,
    studentData,
    setStudentData,
    handleStartTest,
    handleCloseModal,
    handleConsentChange,
    handleFormSubmit,
  };
}
