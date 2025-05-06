import './Form.css';
import Footer from '../components/Footer';
import CustomTextField from '../components/CustomTextField';

function Form({ goToStartPage }: { goToStartPage: () => void }) {
    return (
        <div>
            <div className="general-form">
                <div className="content-form">
                    <div className="information-form">
                        <h1>
                            Ingrese sus
                            <br />
                            Datos
                        </h1>
                        <h2>
                            Complete todos los campos antes de continuar con la encuesta
                        </h2>
                    </div>
                    <div className="data-form">
                        <div className="data-container-form">
                            <div>
                                <CustomTextField
                                    width="45%"
                                    height="100%"
                                    hintText="Nombres"
                                />
                                <CustomTextField
                                    width="45%"
                                    height="100%"
                                    hintText="Apellidos"
                                />
                            </div>
                            <div>
                                <CustomTextField
                                    width="45%"
                                    height="100%"
                                    hintText="Sexo"
                                />
                                <CustomTextField
                                    width="45%"
                                    height="100%"
                                    hintText="Rut"
                                />
                            </div>
                            <div>
                                <CustomTextField
                                    width="45%"
                                    height="100%"
                                    hintText="Direccion"
                                />
                                <CustomTextField
                                    width="45%"
                                    height="100%"
                                    hintText="Grado academico"
                                />
                            </div>
                            <div>
                                <CustomTextField
                                    width="45%"
                                    height="100%"
                                    hintText="Numero de telefono"
                                />
                                <CustomTextField
                                    width="45%"
                                    height="100%"
                                    hintText="correo electronico"
                                />
                            </div>
                            <div>
                                <CustomTextField
                                    width="95%"
                                    height="100%"
                                    hintText="Razon de examen"
                                />
                            </div>
                            <button onClick={goToStartPage}>Continuar</button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default Form;
