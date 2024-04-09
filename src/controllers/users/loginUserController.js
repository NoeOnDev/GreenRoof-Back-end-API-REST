const connection = require('../../database/database');
const middleWare = require('../../auth/middleware/middleWare');
const { verifyRecaptcha } = require('../../utils/verifyReCaptchaUtils');

process.loadEnvFile();

async function loginUserController(req, res) {
  try {
    const { email, password, recaptchaValue } = req.body;

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'No hemos podido autenticar su acceso' });
    }

    const isRecaptchaValid = await verifyRecaptcha(recaptchaValue);

    if (!isRecaptchaValid) {
      return res.status(400).json({ error: 'Completa el reCAPTCHA para continuar' });
    }

    if (!user.verified) {
      return res.status(401).json({ error: 'Por favor, verifique su cuenta antes de iniciar sesión' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'No hemos podido autenticar su acceso' });
    }

    const token = middleWare.generateToken(user.id);
    res.status(200).json({ message: 'Datos de acceso validados satisfactoriamente', token, username: user.username });
  } catch (error) {
    console.error('Error interno en el servidor:', error);
    res.status(500).json({ error: 'Ocurrió un error durante el proceso de inicio de sesión. Por favor, inténtelo de nuevo más tarde.' });
  }
}

async function getUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = ?';
  const results = await queryDatabase(query, [email]);
  return results.length > 0 ? results[0] : null;
}

async function queryDatabase(query, values) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        reject(err);
      }
      resolve(results);
    });
  });
}

module.exports = {
  loginUserController,
};
