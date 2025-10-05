import api, {type CreateUserRequest, type Group, type SingleConfigResponse} from "@/api";
import { type ChangeEvent, useState } from "react";

type HookedUserData = {
  showModal: boolean;
  consentAccepted: boolean;
  userData: CreateUserRequest | null;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  handleConsentChange: (e: ChangeEvent<HTMLInputElement>) => void;
  sendUserData: (data: CreateUserRequest, onSaved?: () => void, onError?: (message: string) => void) => void;
};

export function useUserData(group: Group, config: SingleConfigResponse): HookedUserData {
  const [showModal, setShowModal] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [userData, setUserData] = useState<CreateUserRequest | null>(config.anonymous ? {
    username: "",
    age: 0,
    email: "",
    groupId: group.id,
    name: "",
    password: "",
    anonymous: true,
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

  const sendUserData = async (data: CreateUserRequest, onSaved?: () => void, onError?: (message: string) => void) => {
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
