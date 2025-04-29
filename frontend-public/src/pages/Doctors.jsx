import React, { useState, useEffect } from "react";
import "./Doctors.css"; // Archivo CSS para estilos

const Doctors = () => {
    const [doctores, setDoctores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctores = async () => {
            try {
                console.log("Llamando a la API...");
                const response = await fetch("http://localhost:4000/api/doctor");
                if (!response.ok) {
                    throw new Error("Error al obtener los datos");
                }
                const data = await response.json();
                console.log("Datos obtenidos de la API:", data);
                setDoctores(data);
            } catch (err) {
                console.error("Error:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctores();
    }, []);

    if (loading) return <p className="loading">Cargando doctores...</p>;
    if (error) return <p className="error">Error: {error}</p>;

    return (
        <div className="doctores-container">
            <h1 className="title">Lista de Doctores</h1>
            <div className="doctores-grid">
                {doctores.map((doctor) => (
                    <div className="doctor-card" key={doctor._id}>
                        <h2 className="doctor-name">{doctor.name}</h2>
                        <p className="doctor-speciality">{doctor.speciality}</p>
                        <p className="doctor-email">{doctor.email}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Doctors;