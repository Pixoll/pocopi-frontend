import api, {type NewUser, type TrimmedConfig} from "@/api";
import { type ChangeEvent, useState } from "react";

type HookedUserData = {
  showModal: boolean;
  consentAccepted: boolean;
  userData: NewUser | null;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  handleConsentChange: (e: ChangeEvent<HTMLInputElement>) => void;
  sendUserData: (data: NewUser, onSaved?: () => void, onError?: (message: string) => void) => void;
};

export function useUserData( config: TrimmedConfig): HookedUserData {
  const [showModal, setShowModal] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [userData, setUserData] = useState<NewUser | null>(config.anonymous ? {
    username: "",
    age: "0",
    email: "",
    name: "",
    password: "",
    anonymous: false,
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

  const sendUserData = async (data: NewUser, onSaved?: () => void, onError?: (message: string) => void) => {
    try {
      const response = await api.createUser({
        body: data,
      });

      if (response.error) {
        console.error("error when saving user:", response.error);
        onError?.(response.error.message?.toString().toString() as string);
      } else {
        console.log("user saved successfully.");
        setUserData(data);
        setShowModal(false);
        onSaved?.();
      }
    } catch (error) {
      console.error("error when saving user:", error);
      onError?.(error instanceof Error ? error.message : `${error}`);
    }
  };

  return {
    showModal,
    consentAccepted,
    userData,
    handleOpenModal,
    handleCloseModal,
    handleConsentChange,
    sendUserData,
  };
}
