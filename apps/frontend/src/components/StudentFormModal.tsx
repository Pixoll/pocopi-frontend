import { useState } from "react";
import {
  Button,
  Form,
  Modal,
  FloatingLabel,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faIdCard,
  faEnvelope,
  faCakeCandles,
  faShield,
  faSave,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/hooks/useTheme";

interface StudentData {
  name: string;
  id: string;
  email: string;
  age: string;
}

interface StudentFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: StudentData) => void;
}

interface InputWithIconProps {
  icon: IconDefinition;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  min?: string;
  max?: string;
  isDarkMode: boolean;
}

const InputWithIcon = ({
  icon,
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  min,
  max,
  isDarkMode,
}: InputWithIconProps) => (
  <div className="position-relative mb-3">
    <FloatingLabel
      controlId={`form${name}`}
      label={<span style={{ paddingLeft: "1.75rem" }}>{label}</span>}
    >
      <Form.Control
        type={type}
        placeholder={`Enter your ${name.toLowerCase()}`}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
        className={`${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
        style={{ paddingLeft: "2.5rem" }}
      />
      <div
        className="position-absolute"
        style={{
          left: "0.75rem",
          top: "calc(50% - 0.15rem)",
          transform: "translateY(-50%)",
          zIndex: 4,
          color: isDarkMode ? "#7984ff" : "#4361ee",
          pointerEvents: "none",
        }}
      >
        <FontAwesomeIcon icon={icon} />
      </div>
      <Form.Control.Feedback type="invalid">
        Please enter{" "}
        {name === "id"
          ? "your identification number"
          : name === "email"
          ? "a valid email address"
          : `a valid ${name.toLowerCase()}`}
        .
      </Form.Control.Feedback>
    </FloatingLabel>
  </div>
);

const StudentFormModal = ({
  show,
  onHide,
  onSubmit,
}: StudentFormModalProps) => {
  const [validated, setValidated] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [formData, setFormData] = useState<StudentData>({
    name: "",
    id: "",
    email: "",
    age: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    onSubmit(formData);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      size="lg"
      contentClassName={`border-0 rounded-4 shadow ${
        isDarkMode ? "bg-dark" : ""
      }`}
    >
      <Modal.Header className="bg-primary border-0 text-white">
        <h5 className="modal-title d-flex align-items-center m-0 fw-bold">
          <FontAwesomeIcon icon={faUser} className="me-2" />
          Participant Information
        </h5>
        <Button
          variant="link"
          className="ms-auto text-white p-0 border-0 shadow-none fs-4 lh-1"
          onClick={onHide}
        >
          &times;
        </Button>
      </Modal.Header>
      <Modal.Body className={`p-4 ${isDarkMode ? "bg-dark text-light" : ""}`}>
        <Alert
          variant={isDarkMode ? "primary" : "info"}
          className="d-flex align-items-center mb-4"
        >
          <FontAwesomeIcon icon={faShield} className="me-3 fs-5" />
          <div>
            Your data will be treated confidentially and used solely for
            academic purposes.
          </div>
        </Alert>

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <InputWithIcon
            icon={faUser}
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            isDarkMode={isDarkMode}
          />

          <Row className="g-3">
            <Col md={6}>
              <InputWithIcon
                icon={faIdCard}
                label="Identification Number"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
                isDarkMode={isDarkMode}
              />
            </Col>
            <Col md={6}>
              <InputWithIcon
                icon={faCakeCandles}
                label="Age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="5"
                max="100"
                isDarkMode={isDarkMode}
              />
            </Col>
          </Row>

          <InputWithIcon
            icon={faEnvelope}
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            isDarkMode={isDarkMode}
          />

          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button
              variant={isDarkMode ? "outline-light" : "outline-secondary"}
              onClick={onHide}
              className="px-3"
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="px-4">
              <FontAwesomeIcon icon={faSave} className="me-2" />
              Save Information
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default StudentFormModal;
