import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Archivo CSS para estilos

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error desconocido');
            }

            const data = await response.json();
            alert('Inicio de sesión exitoso');
            localStorage.setItem('token', data.token); // Guardar el token en localStorage
            navigate('/doctores'); // Redirige a la página de doctores
        } catch (error) {
            alert('Error al iniciar sesión: ' + error.message); 
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1 className="login-title">Iniciar Sesión</h1>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                />
                <button type="submit" className="login-button">Ingresar</button>
            </form>
        </div>
    );
}

export default Login;