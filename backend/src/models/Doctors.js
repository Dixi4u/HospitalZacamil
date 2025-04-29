import { Schema, model } from "mongoose";

const clientsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      match: [
        /^[A-Za-z\s]+$/,
        "El nombre solo puede contener letras y espacios",
      ], // Solo letras y espacios
      minlength: [3, "El nombre debe tener al menos 3 caracteres"], //PD: un nombre corto de 3 letras puede ser Ana, Eva, Luz,
    },
    speciality: {
      type: String,
      required: true,
      match: [
        /^[A-Za-z\s]+$/,
        "El nombre solo puede contener letras y espacios",
      ], // Solo letras y espacios
      minlength: [3, "El nombre debe tener al menos 3 caracteres"], //PD: No encontré un apellido corto, solo "Paz" pero que tampoco sea chabacan no 3 letras en apellido
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        "Por favor, ingrese un correo electrónico válido",
      ],
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // La contraseña debe tener al menos 6 caracteres
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Clients", clientsSchema);
