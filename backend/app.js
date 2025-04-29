//Importo todo lo de la libreria express
import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';

import doctorsRoutes from "./src/routes/doctors.js";
import registerDoctors from "./src/routes/registerDoctor.js";
import passwordRecoveryRoutes from "./src/routes/passwordRecovery.js";
import authRouter from "./src/routes/auth.js";

//Creo una constante que es igual a la libreria que acabo de importar, y la ejecuto

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Cambia esto al origen de tu frontend
  credentials: true, // Permitir el envío de cookies
}));

app.use("/api/doctor", doctorsRoutes);
app.use("/api/registerDoctor", registerDoctors)
app.use("/api/passwordRecovery", passwordRecoveryRoutes)
app.use("/api/auth", authRouter);

//Exporto esta constante para usar express en todos lados
export default app;