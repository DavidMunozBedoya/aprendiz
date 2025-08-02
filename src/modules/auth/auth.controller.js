import {
  getUsersDB,
  getUserporIdDB,
  createUserDB,
  updateUserDB,
  deleteUserDB,
  authUserDB,
} from "./auth.model.js";

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

    const result = await authUserDB(data);
    console.log(result);
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
