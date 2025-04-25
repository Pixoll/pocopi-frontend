import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <div className="footer">
            <div className="footer-left">
                &copy; {new Date().getFullYear()} LMAO. Poner informacion que se estime conveniente.
            </div>
            <div className="footer-right">
                <a>Términos</a>
                <a>Privacidad</a>
            </div>
        </div>
    );
};

export default Footer;
