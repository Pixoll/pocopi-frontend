// apps/frontend/src/Welcome.tsx
import { useState } from 'react';
import './Welcome.css';
import Navbar from '../components/Navbar';
import ConsentPop from '../components/ConsentPop';
import Footer from '../components/Footer';
import Form from './Form';

function Welcome({ goToStartPage }: { goToStartPage: () => void }) {
    const [showConsent, setShowConsent] = useState(false);

    return (
        <div>
            <div className="general-welcome">
                <Navbar />
                <div className="welcome-container">
                    <h1>
                        ¡Bienvenido a nuestra página web!
                    </h1>
                    <h2>
                        Estamos encantados de que hayas decidido visitarnos.
                    </h2>
                    {/* Cambia la acción del botón */}
                    <button onClick={() => setShowConsent(true)}>Mostrar Términos y Condiciones</button>
                </div>
                <Footer />
                {showConsent && (
                    <ConsentPop onClose={() => setShowConsent(false)} />
                )}
                {/* Formulario incluido en Welcome */}
                <Form goToStartPage={goToStartPage} />
            </div>
        </div>
    );
}

export default Welcome;
