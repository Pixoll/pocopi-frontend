import { ChangeEvent, useState } from "react";
import { UserData } from "@/types/user";
import { studentService } from "@/services/studentService";

type HookedUserData = {
  showModal: boolean;
  consentAccepted: boolean;
  userData: UserData | null;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  handleConsentChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (data: UserData) => void;
};

export function useUserData(): HookedUserData {
  const [showModal, setShowModal] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConsentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConsentAccepted(e.target.checked);
  };

  const handleFormSubmit = (data: UserData) => {
    setUserData(data);
    setShowModal(false);
    studentService.saveStudentData(data);
  };

  return {
    showModal,
    consentAccepted,
    userData,
    handleOpenModal,
    handleCloseModal,
    handleConsentChange,
    handleFormSubmit,
  };
}
