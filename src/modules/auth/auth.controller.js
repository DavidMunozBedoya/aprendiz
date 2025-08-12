import { escape } from "mysql2";
import { generarToken } from "../helpers/administrarToken.js";
import {
  getUsersDB,
  getUserporIdDB,
  createUserDB,
  updateUserDB,
  deleteUserDB,
  authUserDB,
  updateImgDB,
} from "./auth.model.js";

import validator from "validator";

export async function getAllUsers(req, res) {
  try {
    const users = await getUsersDB();
    res.status(200).send({
      status: "ok",
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.code + "=>" + error.message,
    });
  }
}

export async function getUserById(req, res) {
  const { id } = req.params; // extrae el parametro de consulta  de la url (/id)
  try {
    const user = await getUserporIdDB(id);
    if (!user) {
      throw {
        status: "error",
        message: "usuario no encontrado.",
        statusCode: 404,
      };
    }
    res.status(200).send({
      status: "ok",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.code + "=>" + error.message,
    });
  }
}

export async function createUser(req, res) {
  try {
    let data = req.body;
    //Validaciones
    const errores = [];
    // valido que el email sea ingresado, quite los espacios vacio
    //  y sea un email válido
    if (!data.user_email || validator.isEmpty(data.user_email.trim()) || !validator.isEmail(data.user_email)) {
      errores.push("El email no es válido.");
    }

    // valido el nombre de usuario
    if (!data.user_nombre || validator.isEmpty(data.user_nombre.trim())) {
      errores.push("El nombre de usuario es requerido.");
    }

    //valido el apellido de usuario
    if (!data.user_apellido || validator.isEmpty(data.user_apellido.trim())) {
      errores.push("El apellido de usuario es requerido.");
    }

    // VALIDAR CONTRASEÑA
    if (!data.user_password) {
      errores.push("La contraseña es requerida.");
    } else {

      // Valida la complejidad
      if (!validator.isStrongPassword(data.user_password, {
        minLength: 8, // Longitud mínima
        minLowercase: 1, // Mínimo 1 letra minúscula
        minUppercase: 1, // Mínimo 1 letra mayúscula
        minNumbers: 1, // Mínimo 1 número
        minSymbols: 0  // 0 = opcional
      })) {
        errores.push("La contraseña debe contener mínimo 8 caracteres y tener al menos 1 mayúscula, 1 minúscula y 1 número.");
      }
    }

    //validar telefono
    if (data.user_telefono && !validator.isEmpty(data.user_telefono)) {
      if (!validator.isMobilePhone(data.user_telefono, 'es-CO')) {
        errores.push("Teléfono inválido");
      }
    }

    // SI HAY ERRORES, RETORNAR ERROR 400
    if (errores.length > 0) {
      return res.status(400).send({
        status: "error",
        message: "Errores de validación",
        errores: errores
      });
    }
    // Si no hay errores, continuar con la creación del usuario
    const result = await createUserDB(data);
    res.status(200).send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
}

export async function updateUser(req, res) {
  const { id } = req.params; // extrae el parametro de consulta  de la url (/id)
  const data = req.body; // extrae el cuerpo de la peticion (json)
  
  try {
    // VALIDACIONES
    const errores = [];
    
    // 📧 VALIDAR EMAIL (SOLO SI SE PROPORCIONA)
    if (data.user_email !== undefined) {
      if (!data.user_email || validator.isEmpty(data.user_email.trim()) || !validator.isEmail(data.user_email)) {
        errores.push("El email no es válido.");
      }
    }
    
    // 👤 VALIDAR NOMBRE (SOLO SI SE PROPORCIONA)
    if (data.user_nombre !== undefined) {
      if (!data.user_nombre || validator.isEmpty(data.user_nombre.trim())) {
        errores.push("El nombre no puede estar vacío.");
      }
    }
    
    // 👤 VALIDAR APELLIDO (SOLO SI SE PROPORCIONA)
    if (data.user_apellido !== undefined) {
      if (!data.user_apellido || validator.isEmpty(data.user_apellido.trim())) {
        errores.push("El apellido no puede estar vacío.");
      }
    }
    
    // 🔒 VALIDAR CONTRASEÑA (SOLO SI SE PROPORCIONA)
    if (data.user_password !== undefined) {
      if (!data.user_password) {
        errores.push("La contraseña no puede estar vacía.");
      } else {
        if (!validator.isStrongPassword(data.user_password, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 0
        })) {
          errores.push("La contraseña debe contener mínimo 8 caracteres y tener al menos 1 mayúscula, 1 minúscula y 1 número.");
        }
      }
    }
    
    // 📱 VALIDAR TELÉFONO (SOLO SI SE PROPORCIONA)
    if (data.user_telefono !== undefined && !validator.isEmpty(data.user_telefono)) {
      if (!validator.isMobilePhone(data.user_telefono, 'es-CO')) {
        errores.push("Teléfono inválido");
      }
    }
    
    // SI HAY ERRORES, RETORNAR ERROR 400
    if (errores.length > 0) {
      return res.status(400).send({
        status: "error",
        message: "Errores de validación",
        errores: errores
      });
    }

    const result = await updateUserDB(id, data);
    if (result.affectedRows === 0) {
      throw {
        status: "error",
        message: "usuario no encontrado o no hubo cambios para actualizar.",
        statusCode: 404,
      };
    }
    res.status(200).send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params; // extrae el parametro de consulta  de la url (/id)
  try {
    const result = await deleteUserDB(id);
    if (result.affectedRows === 0) {
      throw {
        status: "error",
        message: "usuario no encontrado para eliminar.",
        statusCode: 404,
      };
    }
    res.status(200).send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
}

export async function authUser(req, res) {
  try {
    let data = req.body;
    // Aquí debes añadir validaciones de entrada de datos --- passport-u otra libreria  !!!!!

    const user = await authUserDB(data);
    console.log(user);

    if (user) {
      const token = generarToken(user[0], process.env.TOKEN_LIFE);
      res.status(200).send({
        status: "ok",
        usuario: user[0].user_email,
        foto: user[0].user_foto,
        token: token,
      });
    }

  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
}

export async function subirImagen(req, res) {
  //tratamiento del archivo subido a la api
  //console.log(req.file);

  if(!req.file && !req.files){
    return res.status(404).send({
      status: "error",
      message: "petición invalida!",
    })
  }

  //validar la extension del archivo
  let archivo = req.file.originalname;
  let archivoSeparado = archivo.split(".");
  let extension = archivoSeparado[1];

  console.log(archivo, archivoSeparado, extension);
  
  //comprobar la extension y actualizacion de la DB

  if(extension != "png" && extension != "jpg" && extension != "PNG" && extension != "JPG"){
    return res.status(400).send({
      status: "error",
      message: "formato de imagen no valido",
    });
  }

  // recibimos el parametro del id
  let userid = req.params.id

  // recibimos la ruta de la imagen 
  let rutaImg = req.file.filename

  // actualizamos en la DB
  let resultado = await updateImgDB(rutaImg, userid);
  // enviamos mensaje de exito

  return res.status(200).send({
    status: "ok",
    message: "Actualizado Exitosamente " + resultado,
  })


}


