# SISTEMA GESTION DE APRENDICES

# Mejoras de seguridad:

🔐 Entropía: De 2^45 a 2^256 combinaciones
🎲 Aleatoriedad: Generado con CSPRNG
🏭 Estándar: Cumple NIST SP 800-132
🛡️ Resistencia: Contra ataques de fuerza bruta

// comando ejecutado en consola para generar el codigo SALT: node -e "console.log('SALT profesional:', require('crypto').randomBytes(32).toString('hex'))"

# Despliegue en Render
las variables en .env se agregaron a render