const emailConfig = require('../../auth/email/emailConfig');

async function sendVerificationEmail(email, verificationToken) {
    try {
        await emailConfig.getAccessTokenIfNeeded();

        const mailOptions = {
            from: '"GreenRoof Oficial" <myemail@mail.com>',
            to: email,
            subject: 'Verificación de Correo para ser miembro en GreenRoof',
            html: `
            
  <div style="background-color: #1E90FF; padding: 10px; text-align: center;">
    
  </div>

  <h2 style="color: #1E90FF; font-size: 22px; font-weight: bold; text-align: center;">¡Bienvenido a GreenRoof!</h2>

  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px; text-align: center;">
    Estás a punto de formar parte de GreenRoof, la plataforma diseñada para monitorear temperatura y humedad en casitas para perros. 
    Recibiste este correo porque te registraste en nuestra plataforma.
  </p>

  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 40px; text-align: center;">
    Por favor verifica tu cuenta haciendo clic en el siguiente botón:
  </p>

  <div style="text-align: center; margin-bottom: 40px;">
    <a href="http://localhost:5000/verify?token=${verificationToken}" target="_blank" rel="noopener noreferrer" style="background-color: #1E90FF; color: #fff; padding: 12px 20px; font-size: 16px; border-radius: 4px; text-decoration: none;">
      Verificar mi cuenta
    </a>
  </div>

  <p style="font-size: 16px; line-height: 1.5; margin: 20px 0; text-align: center;">
    Si no solicitaste este registro, puedes ignorar este correo. Tu cuenta no se activará hasta que completes la verificación.
  </p>

  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px; text-align: center;">
    Si necesitas ayuda o tienes alguna pregunta, no dudes en contactarnos en <a href="mailto:greenroofoficial@gmail.com" style="color: #1E90FF;">greenroofoficial@gmail.com</a>. Estamos aquí para asistirte.
  </p>

  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px; text-align: center;">¡Gracias por unirte a GreenRoof!</p>

  <p style="font-size: 14px; line-height: 1.5; text-align: center; margin-bottom: 20px;">Atentamente,<br>El equipo de GreenRoof</p>

</div>
    <div style="background-color: #1E90FF; padding: 10px; text-align: center;">
    
  </div>
            `
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
    sendVerificationEmail,
};
