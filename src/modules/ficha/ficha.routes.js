import express from "express";
import {
    getAllFichas,
    getFichaByNumeroFicha,
    createFicha,
    updateFicha,
    deleteFicha,
} from "./ficha.controller.js";

const router = express.Router();

// Rutas para Fichas
router.get("/listartodos", getAllFichas);
router.get("/listarpornumeroficha/:numeroFicha", getFichaByNumeroFicha);
router.post("/crear", createFicha);
router.put("/actualizar/:numeroFicha", updateFicha);
router.delete("/eliminar/:numeroFicha", deleteFicha);   

export default router;