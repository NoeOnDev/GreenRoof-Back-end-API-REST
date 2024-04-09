const connection = require('../../database/database');
const verifyValidService = require('../../services/verifyEmailServices/verifyValidService');
const verifyInvalidService = require('../../services/verifyEmailServices/verifyInvalidService');

async function verifyUserController(req, res) {
  try {
    const { token } = req.query;

    const updateQuery = 'UPDATE users SET verified = true, verificationToken = NULL WHERE verificationToken = ?';
    const result = await queryDatabase(updateQuery, [token]);

    if (result.affectedRows === 0) {
      const invalidTokenMessage = await verifyInvalidService.generateInvalidTokenMessage();
      return res.send(invalidTokenMessage);
    } else {
      const verificationMessage = await verifyValidService.generateVerificationMessage();
      return res.send(verificationMessage);
    }
  } catch (error) {
    console.error('Error interno en el servidor:', error);
    res.status(500).json({
      error: 'Ocurrió un error durante la verificación de correo. Por favor, inténtelo de nuevo más tarde.',
    });
  }
}

async function queryDatabase(query, values) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error querying the database:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = {
  verifyUserController,
};
