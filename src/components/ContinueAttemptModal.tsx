import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle, faTrash, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "@/components/Spinner";
import api, { type AssignedTestGroup } from "@/api";
import { useAuth } from "@/contexts/AuthContext";

type ContinueAttemptModalProps = {
  show: boolean;
  onContinue: (group: AssignedTestGroup) => void;
  onDiscard: () => void;
  onError?: (error: string) => void;
};

export function ContinueAttemptModal({
                                       show,
                                       onContinue,
                                       onDiscard,
                                       onError,
                                     }: ContinueAttemptModalProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<"continue" | "discard" | null>(null);

  const handleContinue = async () => {
    if (!token) {
      onError?.("No hay sesión activa");
      return;
    }

    setLoading(true);
    setAction("continue");

    try {
      const response = await api.continueTest({ auth: token });

      if (response.data) {
        onContinue(response.data.assignedGroup);
      } else if (response.error) {
        onError?.(response.error.message || "Error al continuar el intento");
      }
    } catch (error) {
      console.error("Error continuing test:", error);
      onError?.(error instanceof Error ? error.message : "Error al continuar el intento");
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  const handleDiscard = async () => {
    if (!token) {
      onError?.("No hay sesión activa");
      return;
    }

    setLoading(true);
    setAction("discard");

    try {
      const response = await api.discardTest({ auth: token });

      if (response.error) {
        onError?.(response.error.message || "Error al descartar el intento");
      } else {
        onDiscard();
      }
    } catch (error) {
      console.error("Error discarding test:", error);
      onError?.(error instanceof Error ? error.message : "Error al descartar el intento");
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  return (
    <Modal show={show} centered backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning me-2" />
          Intento en progreso
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-3">
            Tienes un intento de test en progreso. ¿Deseas continuar donde lo dejaste o comenzar un nuevo intento?
        </p>

        <div className="alert alert-info small mb-0">
          <strong>Nota:</strong> Si descartás el intento anterior, perderás todo tu progreso y comenzarás desde cero.
        </div>
      </Modal.Body>

      <Modal.Footer className="justify-content-between">
        <Button
          variant="outline-danger"
          onClick={handleDiscard}
          disabled={loading}
        >
          {loading && action === "discard" ? (
            <>
              <Spinner /> Descartando...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faTrash} /> Descartar y empezar de nuevo
            </>
          )}
        </Button>

        <Button
          variant="primary"
          onClick={handleContinue}
          disabled={loading}
        >
          {loading && action === "continue" ? (
            <>
              <Spinner /> Continuando...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faPlayCircle} /> Continuar donde lo dejé
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}