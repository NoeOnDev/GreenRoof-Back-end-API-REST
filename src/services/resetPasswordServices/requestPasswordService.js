const emailConfig = require("../../auth/email/emailConfig");

async function sendVerificationCodeEmail(email, verificationCode) {
  try {
    await emailConfig.getAccessTokenIfNeeded();

    const mailOptions = {
      from: '"GreenRoof Oficial" <myemail@mail.com>',
      to: email,
      subject: "Código de Verificación para Cambio de Contraseña en GreenRoof",
      html: `
  <div style="background-color: #1E90FF; padding: 10px; text-align: center;">
  </div>

  <h2 style="color: #1E90FF; font-size: 22px; font-weight: bold; text-align: center;">¡Hola, Usuario de GreenRoof!</h2>

  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px; text-align: center;">
    Recibiste este correo porque has solicitado un cambio de contraseña en GreenRoof. Estamos aquí para ayudarte a recuperar el acceso a tu cuenta.
  </p>

  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 40px; text-align: center;">
    Utiliza el siguiente código de verificación para completar el proceso:
  </p>

  <div style="text-align: center; margin-bottom: 40px;">
    <p style="font-size: 24px; font-weight: bold; color: #1E90FF; margin: 0;">${verificationCode}</p>
  </div>

  <p style="font-size: 16px; line-height: 1.5; margin: 20px 0; text-align: center;">
    Este código de verificación es válido por un tiempo limitado. Si no has solicitado este cambio, puedes ignorar este correo.
  </p>

  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px; text-align: center;">
    ¿Necesitas ayuda o tienes alguna pregunta? No dudes en contactarnos en <a href="mailto:greenroofoficial@gmail.com" style="color: #1E90FF;">greenroofoficial@gmail.com</a>. Estamos aquí para asistirte.
  </p>

  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px; text-align: center;">¡Gracias por confiar en GreenRoof!</p>

  <p style="font-size: 14px; line-height: 1.5; text-align: center; margin-bottom: 20px;">Atentamente,<br>El equipo de GreenRoof</p>

</div>
    <div style="background-color: #1E90FF; padding: 10px; text-align: center;">
  </div>
            `,
    };

    await new Promise((resolve, reject) => {
      emailConfig.transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
          return reject(err);
        }
        resolve();
      });
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = {
  sendVerificationCodeEmail,
};
