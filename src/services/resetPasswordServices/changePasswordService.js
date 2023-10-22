const emailConfig = require('../../auth/email/emailConfig');

async function sendPasswordChangeConfirmationEmail(email) {
    try {
        await emailConfig.getAccessTokenIfNeeded();

        const mailOptions = {
            from: '"GreenRoof Oficial" <myemail@mail.com>',
            to: email,
            subject: 'Confirmación de Cambio de Contraseña en GreenRoof',
            html: `
  <div style="background-color: #1E90FF; padding: 10px; text-align: center;">
  </div>

  <h2 style="color: #1E90FF; font-size: 22px; font-weight: bold; text-align: center;">¡Cambio de Contraseña Exitoso!</h2>

  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px; text-align: center;">
    Hola,
  </p>

  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px; text-align: center;">
    Queremos informarte que tu contraseña ha sido cambiada con éxito en nuestro sistema.
  </p>

  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px; text-align: center;">
    Si no reconoces esta actividad, por favor contáctanos de inmediato.
  </p>

  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px; text-align: center;">
    ¡Gracias por confiar en nosotros!
  </p>

  <p style="font-size: 14px; line-height: 1.5; text-align: center; margin-bottom: 20px;">Atentamente,<br>El equipo de GreenRoof</p>

  <div style="background-color: #1E90FF; padding: 10px; text-align: center;">
  </div>
            `,
        };

        await new Promise((resolve, reject) => {
            emailConfig.transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Error sending email:', err);
                    return reject(err);
                }
                resolve();
            });
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

module.exports = {
    sendPasswordChangeConfirmationEmail,
};
