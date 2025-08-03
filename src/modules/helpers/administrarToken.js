/* 
 * ADMINISTRADOR DE TOKENS JWT (JSON Web Token)
 * 
 * Los JWT son tokens de seguridad que contienen información del usuario
 * de forma encriptada y con fecha de expiración.
 * 
 * Estructura de un JWT: header.payload.signature
 * - Header: Tipo de token y algoritmo de encriptación
 * - Payload: Datos del usuario (no sensibles)
 * - Signature: Firma para verificar autenticidad
 */

import jwt from "jsonwebtoken";
import { token } from "morgan";

/**
 * GENERAR TOKEN JWT
 * 
 * @param {Object} payload - Datos del usuario a incluir en el token (ej: {id, email, nombre})
 * @param {String} vida - Tiempo de expiración del token (ej: "1h", "24h", "7d")
 * @returns {String} - Token JWT generado
 * 
 * FUNCIONAMIENTO:
 * 1. Recibe los datos del usuario autenticado
 * 2. Configura el tiempo de expiración
 * 3. Firma el token con una clave secreta
 * 4. Retorna el token para enviarlo al cliente
 * 
 * USO TÍPICO:
 * - Después del login exitoso
 * - El cliente guarda el token (localStorage/cookies)
 * - El cliente envía el token en cada petición protegida
 */
export const generarToken = (payload, vida) => {
    
    // OPCIONES DEL TOKEN
    const options = {
        expiresIn: vida, // Tiempo de vida del token (ej: "4h" = 4 horas)
    };

    /**
     * FIRMAR Y GENERAR EL TOKEN
     * 
     * jwt.sign(payload, secretKey, options)
     * - payload: Datos del usuario
     * - "xyz123": CLAVE SECRETA (⚠️ En producción debe estar en variables de entorno)
     * - options: Configuraciones adicionales (tiempo de vida)
     * 
     * ⚠️ SEGURIDAD: La clave "xyz123" debe cambiarse por una más segura
     * y guardarse en process.env.JWT_SECRET
     */
    return jwt.sign(payload, process.env.SALT, options);
};

/* middelware para autenticar el token */

export const authMiddleware = (req, res, next) => {
    try {
        //token valido o generado desde la peticion req
        const tokenRecibido = req.headers.authorization;
        console.log("Token recibido:", tokenRecibido);

        // Mostrar el token en la respuesta Y continuar
        res.status(200).send({
            status: "success",
            message: "Token recibido correctamente - MODO PRUEBA",
            token: tokenRecibido,
            timestamp: new Date().toISOString()
        });

        //validacion del token

        //comparacion del token del request req con el generado del login

        // Si el token es válido, continúa con la siguiente función
        //next(); // llama la siguiente funcion
    } catch (error) {
        res.status(401).send({
            status: "error",
            message: "No autorizado, Token Invalido." + error,
        });        
    }
};

