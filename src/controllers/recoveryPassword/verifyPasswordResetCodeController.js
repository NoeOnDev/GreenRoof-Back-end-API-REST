const emailConfig = require('../../auth/email/emailConfig'); // Importa el módulo de configuración de correo
const connection = require('../../database/database');

async function verifyPasswordResetCodeController(req, res) {
    try {
        const { email, verificationCode } = req.body;

        // Verificar si el correo electrónico proporcionado está registrado
        const userQuery = 'SELECT * FROM users WHERE email = ?';
        const user = await new Promise((resolve, reject) => {
            connection.query(userQuery, [email], (err, results) => {
                if (err) {
                    console.error('Error querying the database:', err);
                    reject(err);
                }
                resolve(results[0]);
            });
        });

        if (!user) {
            return res.status(400).json({ error: 'El correo electrónico no está registrado' });
        }

        // Verificar si el código de verificación coincide con el almacenado en la base de datos
        if (user.verificationCode !== verificationCode) {
            return res.status(400).json({ error: 'El código de verificación no es válido' });
        }

        // Eliminar el código de verificación de la base de datos
        const clearCodeQuery = 'UPDATE users SET verificationCode = NULL WHERE email = ?';
        await new Promise((resolve, reject) => {
            connection.query(clearCodeQuery, [email], (err, result) => {
                if (err) {
                    console.error('Error clearing verification code:', err);
                    reject(err);
                }
                resolve();
            });
        });

        res.status(200).json({ message: 'Código de verificación válido' });
    } catch (error) {
        console.error('Error interno en el servidor:', error);
        res.status(500).json({ error: 'Ocurrió un error al verificar el código. Por favor, inténtelo de nuevo más tarde.' });
    }

}

module.exports = {
  verifyPasswordResetCodeController,
};