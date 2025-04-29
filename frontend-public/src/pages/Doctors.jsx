import { useEffect, useState } from 'react';

function Doctores() {
    const [doctores, setDoctores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctores = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/doctor', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Enviar el token
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al obtener los doctores');
                }

                const data = await response.json();
                setDoctores(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctores();
    }, []);

    if (loading) return <p>Cargando doctores...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="doctores-container">
            <h1>Lista de Doctores</h1>
            <ul>
                {doctores.map((doctor) => (
                    <li key={doctor._id}>
                        <strong>{doctor.nombre}</strong> - {doctor.especialidad}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Doctores;