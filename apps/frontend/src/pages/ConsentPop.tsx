// apps/frontend/src/ConsentPop.tsx
import React from 'react';
import './ConsentPop.css';

interface ConsentPopProps {
    onClose: () => void; // Función para cerrar el consentimiento
}

const ConsentPop: React.FC<ConsentPopProps> = ({ onClose }) => {
    return (
        <div className="consent-overlay">
            <div className="consent-pop">
                <div className="consent-pop-content">
                    <h2>Términos y Condiciones</h2>
                    <h3>The standard Lorem Ipsum passage, used since the 1500s</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Quisque non diam vitae libero sollicitudin fermentum.
                        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae...
                    </p>
                    <h3>Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h3>
                    <p>
                        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                        laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
                        beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                        odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
                        sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
                        voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
                        laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui
                        in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat
                        quo voluptas nulla pariatur?"
                    </p>
                </div>
                <div className="button-pop">
                    {/* Botón para rechazar */}
                    <button onClick={onClose}>Rechazar</button>
                    {/* Botón para aceptar */}
                    <button onClick={onClose}>Aceptar</button>
                </div>
            </div>
        </div>
    );
};

export default ConsentPop;
