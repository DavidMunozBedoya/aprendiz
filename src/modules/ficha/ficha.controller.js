import {
    getFichasDb,
    getFichaPorNumeroFichaDB,
    createFichaDB,
    updateFichaDB,
    deleteFichaDB,
} from "./ficha.model.js";

export async function getAllFichas(req, res) {
    try{
        const fichas = await getFichasDb();
        res.status(200).send({
            status: "ok",
            data: fichas,
        });
    } catch(error) {
        res.status(500).send({
            status: "error",
            message: error.code + "=>" + error.message,
        });
    }
}

export async function getFichaByNumeroFicha(req, res) {
    try {
        const numero_ficha = req.params.numeroFicha;
        const ficha = await getFichaPorNumeroFichaDB(numero_ficha);
        if(!ficha){
            throw {
                status: "error",
                message: "Ficha No encontrada",
                statusCode: 404,
            };
        }
        res.status(200).send({
            status: "ok",
            data: ficha,
        })
    } catch(error) {
        res.status(500).send({
            status: "error",
            message: error.code + "=>" + error.message,
        });
    }
}

export async function createFicha(req, res) {
    try {
        let data = req.body;
        const result = await createFichaDB(data);
        res.status(200).send({
            status: "ok",
            data: result,
        });
    } catch(error) {
        res.status(500).send({
            status: "error",
            message: error.code + "=>" + error.message,
        });
    }
}

export async function updateFicha(req, res) {
    try {
        const numero_ficha = req.params.numeroFicha;
        const data = req.body;
        const result = await updateFichaDB(numero_ficha, data);
        if(result.affectedRows === 0) {
            throw{
                status: "error",
                message: "Ficha no encontrada o no hubo cambios para actualizar",
                statusCode: 404,
            };
        }
        res.status(200).send({
            status: "ok",
            data: result,
        })
    } catch(error) {
        res.status(500).send({
            status: "error",
            message: error.code + "=>" + error.message,
        });
    }
}

export async function deleteFicha(req, res) {
    try {
        const numero_ficha = req.params.numeroFicha;
        const result = await deleteFichaDB(numero_ficha);
        if(result.affectedRows === 0) {
            throw {
                status: "error",
                message: "Ficha no encontrada para eliminar",
                statusCode: 404,
            };
        }
        res.status(200).send({
            status: "ok",
            data: result,
        });
    } catch(error) {
        res.status(500).send({
            status: "error",
            message: error.code + "=>" + error.message,
        });
    }
}