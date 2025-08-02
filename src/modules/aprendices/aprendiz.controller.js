import {
  getAprendicesDB,
  getAprendizporIdDB,
  createAprendizDB,
  updateAprendizDB,
  deleteAprendizDB,
} from "./aprendiz.model.js";

export async function getAllAprendices(req, res) {
  try {
    const aprendices = await getAprendicesDB();
    res.status(200).send({
      status: "ok",
      data: aprendices,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.code + "=>" + error.message,
    });
  }
}

export async function getAprendizById(req, res) {
  const {id} = req.params; // extrae el parametro de consulta  de la url (/id) 
  try {
    const aprendiz = await getAprendizporIdDB(id);
    if (!aprendiz) {
      throw {
        status: "error",
        message: "Aprendiz no encontrado.",
        statusCode: 404,
      };
    }
    res.status(200).send({
      status: "ok",
      data: aprendiz,
    });
  } catch (error) {
    // OTRA FORMA POSIBLE
    /*   console.error("Error en AprendizService.getAprendizByIdService:", error);
    throw {
      status: "error",
      message: error.message || "Error al buscar aprendiz.",
      statusCode: error.statusCode || 500,
    }; */
    res.status(500).send({
      status: "error",
      message: error.code + "=>" + error.message,
    });
  }
}

export async function createAprendiz(req, res) {
  try {
    let data = req.body;
    // Aquí debes añadir validaciones de entrada de datos --- passport-u otra libreria  !!!!!

    const result = await createAprendizDB(data);
    res.status(200).send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.code + "=>" + error.message,
    });
  }
}

export async function updateAprendiz(req, res) {
  const {id} = req.params; // extrae el parametro de consulta  de la url (/id) 
  let data = req.body; // extrae el cuerpo de la peticion (json)
  try {
    const result = await updateAprendizDB(id, data);
    if (result.affectedRows === 0) {
      throw {
        status: "error",
        message: "Aprendiz no encontrado o no hubo cambios para actualizar.",
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
      message: error.code + "=>" + error.message,
    });
  }
}

export async function deleteAprendiz(req, res) {
  const {id} = req.params; // extrae el parametro de consulta  de la url (/id)
  try {
    const result = await deleteAprendizDB(id);
    if (result.affectedRows === 0) {
      throw {
        status: "error",
        message: "Aprendiz no encontrado para eliminar.",
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
      message: error.code + "=>" + error.message,
    });
  }
}
