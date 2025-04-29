import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config.js";
import doctorsModel from "../models/Doctors.js";
import nodemailer from "nodemailer"; // Para el envío de correos electrónicos
import crypto from "crypto"; // Para generar un código aleatorio

const registerDoctorController = {};

// CREATE: Registra un nuevo doctor y envía un código de verificación por correo
registerDoctorController.register = async (req, res) => {
  const { name, speciality, email, password } = req.body;

  // Validación de campos requeridos
  if (!name || !speciality || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Verificar si el doctor ya existe
    const existingDoctor = await doctorsModel.findOne({ email });
    if (existingDoctor) {
      return res.status(409).json({ message: "Doctor already exists" }); // Código 409: Conflicto
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newDoctor = new doctorsModel({
      name,
      speciality,
      email,
      password: passwordHash,
    });

    await newDoctor.save();

    // Generar un código de verificación único
    const verificationCode = crypto.randomBytes(3).toString("hex"); // Código corto
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 horas de expiración

    // Crear un JWT con el código y su expiración
    const tokenCode = jwt.sign(
      {
        email,
        verificationCode,
        expiresAt,
      },
      config.JWT.secret,
      { expiresIn: "2h" } // El JWT expirará en 2 horas
    );

    // Guardar el token en una cookie
    res.cookie("verificationToken", tokenCode, {
      httpOnly: true, // La cookie no será accesible desde JavaScript
      secure: process.env.NODE_ENV === "production", // Solo se envía en HTTPS si estás en producción
      maxAge: 2 * 60 * 60 * 1000, // Duración de la cookie: 2 horas
    });

    // Enviar correo electrónico con el código de verificación (JWT)
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.email.email_user,
          pass: config.email.email_pass,
        },
      });

    const mailOptions = {
      from: config.email.username, // Tu correo electrónico
      to: email,
      subject: "Verificación de correo electrónico",
      text: `Para verificar tu cuenta, utiliza el siguiente código de verificación: ${verificationCode}\nEste código expirará en 2 horas.\nSi no solicitaste este registro, por favor ignora este correo.`,
    };

    // Enviar correo
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error sending email" });
      }
      console.log("Email sent: " + info.response);
    });

    // Enviar una respuesta con el código de verificación
    res.status(201).json({
      message:
        "Doctor registered. Please verify your email with the code sent.",
      token: tokenCode, // Devolver el token para verificación posterior
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// Verificación del correo electrónico al recibir el token
registerDoctorController.verifyCodeEmail = async (req, res) => {
  const { verificationCode } = req.body;
  const token = req.cookies.verificationToken; // Obtener el token de la cookie

  if (!token) {
    return res.status(401).json({ message: "No verification token provided" });
  }

  try {
    // Verificar y decodificar el JWT
    const decoded = jwt.verify(token, config.jwt.secret);
    const { email, verificationCode: storedCode } = decoded;

    // Comparar el código recibido con el almacenado en el JWT
    if (verificationCode !== storedCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Marcar al doctor como verificado
    const doctor = await doctorsModel.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Actualizar el campo de verificación
    doctor.isVerified = true;
    await doctor.save();
    // Limpiar la cookie después de la verificación
    res.clearCookie("verificationToken");

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying email", error: error.message });
  }
};

export default registerDoctorController;
