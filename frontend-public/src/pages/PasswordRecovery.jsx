import { useState } from 'react';

function PasswordRecovery() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // Controla el paso actual
    const [message, setMessage] = useState('');

    const handleRequestCode = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/passwordRecovery/requestCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Incluir cookies en la solicitud
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al solicitar el código');
            }

            setMessage('Código enviado a tu correo');
            setStep(2); // Avanzar al siguiente paso
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleVerifyCode = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/passwordRecovery/verifyCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Incluir cookies en la solicitud
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
            const response = await fetch('http://localhost:4000/api/passwordRecovery/newPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Incluir cookies en la solicitud
                body: JSON.stringify({ password: newPassword }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al cambiar la contraseña');
            }

            setMessage('Contraseña actualizada exitosamente');
            setStep(1); // Reiniciar el flujo
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="password-recovery-container">
            <h1>Recuperación de Contraseña</h1>
            <p>{message}</p>
            {step === 1 && (
                <>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleRequestCode}>Solicitar Código</button>
                </>
            )}
            {step === 2 && (
                <>
                    <input
                        type="text"
                        placeholder="Código de verificación"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button onClick={handleVerifyCode}>Verificar Código</button>
                </>
            )}
            {step === 3 && (
                <>
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button onClick={handleNewPassword}>Actualizar Contraseña</button>
                </>
            )}
        </div>
    );
}

export default PasswordRecovery;