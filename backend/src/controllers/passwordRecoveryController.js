import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import doctorsModel from "../models/Doctors.js";

import { config } from "../config.js";
import { sendMail, HTMLRecoveryEmail } from "../utils/MailPasswordrecovery.js";

//1- Creo un array de funciones

const passwordRecoveryController = {};

passwordRecoveryController.requestCode = async (req, res) => {
  const { email } = req.body;
  //buscakmos si el correo está en la coleccion de doctores
  try {
    let userFound;
    let userType;

    userFound = await doctorsModel.findOne({ email });
    if (userFound) {
      userType = "doctor";
    } 

    //si no encuentra ni en doctores ni en empleados
    if (!userFound) {
      return res.json({ message: "User not found" });
    }
    //Generar un codigo aleatorio
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    //Crear un token que guarde todo
    const token = jsonwebtoken.sign(
      //1-¿Qué voy a guardar?
      { email, code, userType, verified: false },
      //2- secret key
      config.JWT.secret,
      //3- ¿cuando expira?
      { expiresIn: "30m" }
    );

    res.cookie("tokenRecoveryCode", token, { maxAge: 20 * 60 * 1000 });

    //ULTIMO PASO, enviar el correo
    await sendMail(
      email,
      "Password recovery code", //Asun to
      `Yout verification code is: ${code}`, //Texto
      HTMLRecoveryEmail(code) //
    );


    res.json({ message: "Email sent successfully" });
  } catch (error) {}
};


passwordRecoveryController.verifyCode = async (req, res) => {
  const { code } = req.body;

  try {
    //Extraer el token de las cookies
    const token = req.cookies.tokenRecoveryCode;

    //Decodificar el token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    //Verificar que pasa si el codigo que esta guardado en el token, no es el mismo que el usuario escribió
    if (decoded.code !== code) {
      return res.json({ message: "Invalid Code" });
    }

    //Generemos un nuevo token
    const newToken = jsonwebtoken.sign(
      //1- ¿Que vamos a guardar?
      {
        email: decoded.email,
        code: decoded.code,
        userType: decoded.userType,
        verified: true
      },
      //2- Secret key
      config.JWT.secret,
      //3- ¿Cuando expira?
      { expiresIn: "20m" }
    );
    res.cookie("tokenRecoveryCode", newToken, { maxAge: 20 * 60 * 1000 });

    res.json({ message: "Code verified succesfully" });
  } catch (error) {
    console.log("error" + error);
  }
  
};

passwordRecoveryController.newPassword = async(req, res) => {
    const { newPassword } = req.body;

    try {
        //1- Extraer el token de las cookies
        const token = req.cookies.tokenRecoveryCode

        //2- Desglozar lo que tiee el token adentro
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)

        //3- Accedemos a la vaiable verified a ver que valor tiene
        if (!decoded.verified) {
            return res.json({message: "Code not verified"})            
        }

        //Extraer el correo y tipo de usuario del token
        const {email, userType} = decoded;

        let user ;

        //Buscamos al usuario dependiendo del userType
        if(userType === "doctor"){
            user = await doctorsModel.findOne({email})
        } 

        //Encriptar la contraseña
        const hashPassword = await bcryptjs.hash(newPassword, 10)

        //Ultimo paso, actualizar la contraseña

        let updateUser;
        if(userType === "doctor"){
            updateUser = await doctorsModel.findOneAndUpdate(
                {email},
                {password: hashPassword},
                {new: true}
            )
        }

        res.clearCookie("tokenRecoveryCode");

        res.json({message: "Password updated successfully"})



    } catch (error) {
        console.log("error" + error)
    }
}

export default passwordRecoveryController;
