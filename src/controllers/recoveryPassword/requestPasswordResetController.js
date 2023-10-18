const crypto = require('crypto');
const emailConfig = require('../../auth/email/emailConfig');
const connection = require('../../database/database');
const { sendVerificationCodeEmail } = require('../../services/resetPasswordServices/requestPasswordService');

async function requestPasswordResetController(req, res) {
  try {
    const { email } = req.body;

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).json({ error: 'El correo electrónico no está registrado' });
    }

    if (!user.verified) {
      return res.status(400).json({ error: 'Correo no verificado' });
    }

    const verificationCode = crypto.randomBytes(6).toString('hex');
    await updateVerificationCode(email, verificationCode);

    await sendVerificationCodeEmail(email, verificationCode);

    res.status(200).json({ message: 'Se ha enviado un código de verificación a tu correo electrónico' });
  } catch (error) {
    console.error('Error interno en el servidor:', error);
    res.status(500).json({
      error: 'Ocurrió un error al solicitar el cambio de contraseña. Por favor, inténtalo de nuevo más tarde.',
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

async function updateVerificationCode(email, verificationCode) {
  return new Promise((resolve, reject) => {
    connection.query('UPDATE users SET verificationCode = ? WHERE email = ?', [verificationCode, email], (err, result) => {
      if (err) {
        console.error('Error updating verification code:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  requestPasswordResetController,
};
