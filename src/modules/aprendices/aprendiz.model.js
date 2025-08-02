
import dbconn from "../../config/dbconexion.js"; 

export async function getAprendicesDB() {
  const [rows] = await dbconn.query("SELECT * FROM aprendiz");
  return rows;
}

export async function getAprendizporIdDB(id) {
  const [rows] = await dbconn.query("SELECT * FROM aprendiz WHERE codigo = ?", [
    id,
  ]);
  return rows[0]; // Retorna el primer resultado o undefined si no se encuentra
}

export async function createAprendizDB(aprendizData) {
  const [result] = await dbconn.query("INSERT INTO aprendiz SET ?", [
    aprendizData,
  ]);
  return result;
}

export async function updateAprendizDB(id, aprendizData) {
  const [result] = await dbconn.query("UPDATE aprendiz SET ? WHERE codigo = ?", [
    aprendizData,
    id,
  ]);
  return result;
}

export async function deleteAprendizDB(id) {
  const [result] = await dbconn.query("DELETE FROM aprendiz WHERE codigo = ?", [
    id,
  ]);
  return result;
}
