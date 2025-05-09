// apps/frontend/src/Welcome.tsx
import { useState } from 'react';
import './Welcome.css';
import ConsentPop from '../components/ConsentPop';
import Footer from '../components/Footer';
import CustomTextField from '../components/CustomTextField';

interface WelcomeProps {
    goToStartPage: () => void; // Prop para redirigir al inicio del test
}

function Welcome({ goToStartPage }: WelcomeProps) {
    const [showConsent, setShowConsent] = useState(false);
    const [consentGiven, setConsentGiven] = useState<boolean | null>(null); // null: no decisión, true: aceptado, false: rechazado
    const [showForm, setShowForm] = useState(false); // Controla si se muestra el formulario

    const handleConsent = (accepted: boolean) => {
        setConsentGiven(accepted);
        setShowConsent(false); // Cierra el popup
    };

    return (
        <div>
            <div className="general-welcome">
                
                {!showForm ? (
                    <div className="welcome-container">
                        <h1>¡Bienvenido al Test!</h1>
                        <h2>Estamos encantados de que hayas decidido participar.Muchas Gracias!</h2>
                        {!consentGiven && (
                            <button onClick={() => setShowConsent(true)}>Mostrar Términos y Condiciones</button>
                        )}
                        {consentGiven === true && <p>Has aceptado los Términos y Condiciones.</p>}
                        {consentGiven === false && <p>Has rechazado los Términos y Condiciones.</p>}
                        <button onClick={() => setShowForm(true)}>Ir al Formulario</button>
                    </div>
                ) : (
                    <div className="general-form">
                        <div className="content-form">
                            <div className="information-form">
                                <h1>
                                    Ingrese sus
                                    <br />
                                    Datos
                                </h1>
                                <h2>Complete todos los campos antes de continuar con la encuesta</h2>
                            </div>
                            <div className="data-form">
                                <div className="data-container-form">
                                    <div>
                                        <CustomTextField width="45%" height="100%" hintText="Nombres" />
                                        <CustomTextField width="45%" height="100%" hintText="Apellidos" />
                                    </div>
                                    <div>
                                        <CustomTextField width="45%" height="100%" hintText="Sexo" />
                                        <CustomTextField width="45%" height="100%" hintText="Rut" />
                                    </div>
                                    <div>
                                        <CustomTextField width="45%" height="100%" hintText="Direccion" />
                                        <CustomTextField width="45%" height="100%" hintText="Grado academico" />
                                    </div>
                                    <div>
                                        <CustomTextField width="45%" height="100%" hintText="Numero de telefono" />
                                        <CustomTextField width="45%" height="100%" hintText="correo electronico" />
                                    </div>
                                    <div>
                                        <CustomTextField width="95%" height="100%" hintText="Razon de examen" />
                                    </div>
                                    <button onClick={goToStartPage}>Continuar</button>
                                    <button onClick={() => setShowForm(false)}>Volver</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <Footer />
                {showConsent && (
                    <ConsentPop
                        onClose={() => setShowConsent(false)}
                        onAccept={() => handleConsent(true)}
                        onReject={() => handleConsent(false)}
                    />
                )}
            </div>
        </div>
    );
}

export default Welcome;
