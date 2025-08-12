// importamos la libreria
import express from "express"; // es6

import "dotenv/config";
import aprendiz from "./src/modules/aprendices/aprendiz.routes.js";
import usuario from "./src/modules/auth/auth.routes.js";
import ficha from "./src/modules/ficha/ficha.routes.js";
import morgan from "morgan";

import cors from "cors";
//dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

app.use("/aprendiz", aprendiz);
app.use("/usuario", usuario);
app.use("/ficha", ficha);

const port = process.env.PORT || 4100;

app.listen(port, () => {
  console.log(`API ON in port: ${port}`);
});
