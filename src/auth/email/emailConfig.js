const nodemailer = require("nodemailer");
const axios = require("axios"); // Importa axios para hacer solicitudes HTTP


// Definir los datos de autenticación
const authData = {
    type: 'OAuth2',
    user: 'greenroofoficial@gmail.com',
    clientId: "718505879287-va6hhk081tt2ol5o3fu5ja1f4ttc5nii.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken: "1//04rSC6ZhsLO46CgYIARAAGAQSNwF-L9IrpmlBezgCPUrqWHDqBNESQkk_7Jl-NbtMGDh-4Pm5ca_PURKtC5PY0eygEZ7kD1vug0A",
    accessToken: 'ya29.a0AfB_byAxUVmQSQURZFsBwcCc0pil4z16sRwSU6CkWZKX3GDfVey0uJzSxPBegImhATAvOgMBpEGjwu9_OR76Q99w2FG4Rg94eu10qQKKmv3AXdD7dfFJXkYoE1uiM2J_63WHOxqpchgLjOOMjHHynl0JTRVSF8-EWFexaCgYKAYwSARESFQGOcNnCsiOA-KJz0qUVg5B3emr0_A0171',
    expires: 1484314697598,
};


// Función para obtener un nuevo token de acceso si ha expirado
async function getAccessTokenIfNeeded() {
    // Verificar si el token de acceso ha expirado (compararlo con la hora actual)
    const currentTime = new Date().getTime();
    if (authData.expires < currentTime) {
        try {
            // El token de acceso ha expirado, obtener un nuevo token de acceso usando el refreshToken
            const response = await axios.post('https://www.googleapis.com/oauth2/v4/token', {
                client_id: authData.clientId,
                client_secret: authData.clientSecret,
                refresh_token: authData.refreshToken,
                grant_type: 'refresh_token'
            });

            // Actualizar el campo authData.accessToken con el nuevo token de acceso
            authData.accessToken = response.data.access_token;

            // Calcular la nueva fecha de vencimiento (una hora desde la hora actual)
            authData.expires = new Date().getTime() + 3500000; // 3600000 milisegundos = 1 hora
        } catch (error) {
            console.error('Error al renovar el token de acceso:', error);
        }
    }
}

// Crear el transporte de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: authData,
});

module.exports = {
    transporter,
    getAccessTokenIfNeeded, // Exportar la función para su uso en otros lugares
};