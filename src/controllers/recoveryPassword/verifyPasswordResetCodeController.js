const emailConfig = require('../../auth/email/emailConfig');
const connection = require('../../database/database');

async function verifyPasswordResetCodeController(req, res) {
  try {
    const { email, verificationCode } = req.body;

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).json({ error: 'El correo electrónico no está registrado' });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ error: 'El código de verificación no es válido' });
    }

    await clearVerificationCode(email);

    res.status(200).json({ message: 'Código de verificación válido' });
  } catch (error) {
    console.error('Error interno en el servidor:', error);
    res.status(500).json({
      error: 'Ocurrió un error al verificar el código. Por favor, inténtelo de nuevo más tarde.',
    });
  }
}

async function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
}

async function clearVerificationCode(email) {
  return new Promise((resolve, reject) => {
    connection.query('UPDATE users SET verificationCode = NULL WHERE email = ?', [email], (err, result) => {
      if (err) {
        console.error('Error clearing verification code:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  verifyPasswordResetCodeController,
};
