import dbconn from "../../config/dbconexion.js";

export async function getFichasDb() {
    const [rows] = await dbconn.query("SELECT * FROM ficha");
    return rows;    
}

export async function getFichaPorNumeroFichaDB(numero_ficha){
    const [rows] = await dbconn.query("SELECT * FROM ficha WHERE numero_ficha = ?", [
        numero_ficha,
    ]);
    return rows[0];
}


export async function createFichaDB(fichaData){
    const [result] = await dbconn.query("INSERT INTO ficha SET ?", [
        fichaData,
    ]);
    return result;
}

export async function updateFichaDB(numero_ficha, fichaData) {
    const [result] = await dbconn.query("UPDATE ficha SET ? WHERE numero_ficha = ?", [
        fichaData,
        numero_ficha,
    ]);
    return result;
}

export async function deleteFichaDB(numero_ficha) {
    const [result] = await dbconn.query("DELETE FROM ficha WHERE numero_ficha = ?",[
        numero_ficha,
    ]);
    return result;
}