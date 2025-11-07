import {useAuth} from "@/contexts/AuthContext.tsx";
import {useState} from "react";
import {LoginModal} from "@/components/HomePage/LoginModal.tsx";
import {ModifyLatestConfig} from "@/components/ModifyConfigPage/ModifyLatestConfig.tsx";
import type {TrimmedConfig} from "@/api";

export default function ModifyLatestConfigPage({config}:{config:TrimmedConfig}) {
  const { token, isLoggedIn } = useAuth();
  const [showLogin, setShowLogin] = useState(!isLoggedIn);

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  if (!isLoggedIn) {
    return (
      <LoginModal
        config={config}
        show={showLogin}
        onHide={() => setShowLogin(false)}
        goToNextPage={handleLoginSuccess}
      />
    );
  }

  return <ModifyLatestConfig token={token!} />;
}