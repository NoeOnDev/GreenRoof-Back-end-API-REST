const connection = require('../../database/database');
const emailConfig = require('../../auth/email/emailConfig');

const verifyValidService = require('../../services/verifyEmailServices/verifyValidService');
const verifyInvalidService = require('../../services/verifyEmailServices/verifyInvalidService');

//main
async function verifyUserController(req, res) {
    try {
        const { token } = req.query;

        // Query para verificar el token y actualizar el estado de verificación
        const updateQuery = 'UPDATE users SET verified = true, verificationToken = NULL WHERE verificationToken = ?';
        const result = await new Promise((resolve, reject) => {
            connection.query(updateQuery, [token], async (err, result) => {
                if (err) {
                    console.error('Error verifying email:', err);
                    reject(err);
                } else {
                    if (result.affectedRows === 0) {
                        // Token de verificación no válido
                        const invalidTokenMessage = await verifyInvalidService.generateInvalidTokenMessage();
                        return res.send(invalidTokenMessage);
                    } else {
                        // Token verificado con éxito
                        const verificationMessage = await verifyValidService.generateVerificationMessage();
                        return res.send(verificationMessage);
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error interno en el servidor:', error);
        res.status(500).json({ error: 'Ocurrió un error durante la verificación de correo. Por favor, inténtelo de nuevo más tarde.' });
    }
}

module.exports = {
    verifyUserController,
};
