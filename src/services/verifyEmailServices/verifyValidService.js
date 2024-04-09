const emailConfig = require("../../auth/email/emailConfig");

async function generateVerificationMessage() {
  return `
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verificación de Correo Exitosa - GreenRoof</title>

  <style>
    body {
      background-color: #f2f2f2;
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh; 
    }

    .container {
      max-width: 600px;
      padding: 40px; 
      background-color: #e6f2ff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      text-align: center;
    }

    h1 {
      color: #1E90FF;
      font-size: 28px;
      margin-bottom: 20px;
    }

    p {
      color: #4d4d4d;
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 25px;
    }

    a {
      color: #1E90FF;
      font-weight: bold; 
      text-decoration: none;
    }

    .footer {
      color: #777;
      font-size: 14px;
    }
    
  </style>

</head>

<body>

  <div class="container">

    <div style="background-color: #1E90FF; height: 5px; border-radius: 10px 10px 0 0;"></div>

    <h1>¡Felicidades, tu correo está verificado!</h1>

    <p>
      Bienvenido a GreenRoof, la plataforma para monitorear temperatura y humedad en casitas para perros. 
      Estamos contentos de tenerte como miembro.
    </p>

    <p>
      Si tienes alguna pregunta, contáctanos en <a href="mailto:greenroofoficial@gmail.com">greenroofoficial@gmail.com</a>.
      Estamos para ayudarte en cada paso.
    </p>

    <p>¡Gracias por unirte a GreenRoof!</p>

    <p class="footer">
      Atentamente,<br>
      El equipo de GreenRoof
    </p>
    
    <div style="background-color: #1E90FF; height: 5px; border-radius: 0 0 10px 10px;"></div>

  </div>

</body>

</html>
    `;
}

module.exports = {
  generateVerificationMessage,
};
