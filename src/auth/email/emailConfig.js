const nodemailer = require("nodemailer");
const axios = require("axios");

const authData = {
    type: 'OAuth2',
    user: 'greenroofoficial@gmail.com',
    clientId: "718505879287-va6hhk081tt2ol5o3fu5ja1f4ttc5nii.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken: "1//045LP4ih3VJYsCgYIARAAGAQSNwF-L9Ir5J84AzJaQtJaKOGP7R7jSUV8TgfSoT9l_revWTR9PPMEH1UABUzA9qDXO19uTMOp_9o",
    accessToken: 'ya29.a0AfB_byDBSW1FwSPmki2xGgsRyhiBYvyq3PLmyI4bnM1_sgBNu-syvSdmfHWBkdVgSVEAU_s7fLGG4JRs8Z4XMPQvvfZWzOkdDui76pstMCs6LQzERUCROj90AcHjpIxeq2KkJ7AwIiZQC37uwdxJtZPgjztdiyYB5kx0aCgYKAUsSARESFQHGX2MiDBD0U98DVJeNVHcxygaHuw0171',
    expires: 1484314697598,
};

async function getAccessTokenIfNeeded() {
    const currentTime = new Date().getTime();
    if (authData.expires < currentTime) {
        try {
            const response = await axios.post('https://www.googleapis.com/oauth2/v4/token', {
                client_id: authData.clientId,
                client_secret: authData.clientSecret,
                refresh_token: authData.refreshToken,
                grant_type: 'refresh_token'
            });
            authData.accessToken = response.data.access_token;
            authData.expires = new Date().getTime() + 3500000;
        } catch (error) {
            console.error('Error al renovar el token de acceso:', error);
        }
    }
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: authData,
});

module.exports = {
    transporter,
    getAccessTokenIfNeeded,
};