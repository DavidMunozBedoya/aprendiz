import express from "express";
import multer from "multer"; // middleWare para cargar archivos
import { subirImagen } from "./auth.controller.js";

import {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  authUser,
} from "./auth.controller.js";

import { authMiddleware } from "../helpers/administrarToken.js";

const router = express.Router();

const almacenamiento = multer.diskStorage({
  destination:(req, file, cb) => {
    cb(null, "./public/img/user")
  },
  filename: (req, file, cb) => {
    cb(null, "user-" + Date.now() + "-" + file.originalname);
  }
});

const subir = multer({ storage: almacenamiento });

// Rutas para Aprendices
router.get("/listartodos", authMiddleware ,getAllUsers);
router.get("/listarporid/:id", getUserById);
router.post("/crear", createUser);
router.post("/subirImagen", [subir.single("file0")], subirImagen);
router.post("/login", authUser);
router.put("/actualizar/:id", updateUser);
router.delete("/borrar/:id", deleteUser);

export default router;
