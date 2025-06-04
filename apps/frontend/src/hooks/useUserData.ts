import { config } from "@pocopi/config";
import { ChangeEvent, useState } from "react";
import { UserData } from "@/types/user";
import { userService } from "@/services/userService";

type HookedUserData = {
  showModal: boolean;
  consentAccepted: boolean;
  userData: UserData | null;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  handleConsentChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (data: UserData, onSaved: () => void, onError: (message: string) => void) => void;
};

export function useUserData(groupLabel: string): HookedUserData {
  const [showModal, setShowModal] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(config.anonymous ? {
    anonymous: true,
    id: getRandomUserId(),
    group: groupLabel,
  } : null);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConsentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConsentAccepted(e.target.checked);
  };

  const handleFormSubmit = (data: UserData, onSaved: () => void, onError: (message: string) => void) => {
    userService.saveUserData(data, () => {
      setUserData(data);
      setShowModal(false);
      onSaved();
    }, onError);
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

function getRandomUserId(): string {
  const bytes = new Uint8Array(1);
  let value = crypto.getRandomValues(bytes)[0];

  while (value > 79) {
    value = crypto.getRandomValues(bytes)[0];
  }

  // now(base36) + random_ascii_char(between 0 and ~)
  return `${Date.now().toString(36)}${String.fromCharCode(value + 48).replace("\\", "/")}`;
}
