import { useState } from 'react';
import './PasswordRecovery.css'; // Archivo CSS para estilos

function PasswordRecovery() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // Controla el paso actual
    const [message, setMessage] = useState('');

    const handleRequestCode = async () => {
        try {
            if (!email) {
                throw new Error("El campo de correo electrónico está vacío");
            }

            const response = await fetch('http://localhost:4000/api/passwordRecovery/requestCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al solicitar el código');
            }

            setMessage('Código enviado a tu correo');
            setStep(2);
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleVerifyCode = async () => {
        try {
            if (!code) {
                throw new Error("El campo de código está vacío");
            }

            const response = await fetch('http://localhost:4000/api/passwordRecovery/verifyCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al verificar el código');
            }

            setMessage('Código verificado, ahora puedes cambiar tu contraseña');
            setStep(3); // Avanzar al siguiente paso
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleNewPassword = async () => {
        try {
            if (!newPassword) {
                throw new Error("El campo de nueva contraseña está vacío");
            }

            const response = await fetch('http://localhost:4000/api/passwordRecovery/newPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ newPassword, code }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar la contraseña');
            }

            setMessage('Contraseña actualizada con éxito');
            setStep(1); // Opcional: Regresar al paso inicial o redirigir al login
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="password-recovery-container">
            <h1 className="password-recovery-title">Recuperación de Contraseña</h1>
            <p className="password-recovery-message">{message}</p>
            {step === 1 && (
                <>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="password-recovery-input"
                    />
                    <button onClick={handleRequestCode} className="password-recovery-button">
                        Solicitar Código
                    </button>
                </>
            )}
            {step === 2 && (
                <>
                    <input
                        type="text"
                        placeholder="Código de verificación"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="password-recovery-input"
                    />
                    <button onClick={handleVerifyCode} className="password-recovery-button">
                        Verificar Código
                    </button>
                </>
            )}
            {step === 3 && (
                <>
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="password-recovery-input"
                    />
                    <button onClick={handleNewPassword} className="password-recovery-button">
                        Actualizar Contraseña
                    </button>
                </>
            )}
        </div>
    );
}

export default PasswordRecovery;