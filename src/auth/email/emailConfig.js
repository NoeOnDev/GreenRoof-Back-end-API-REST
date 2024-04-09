const nodemailer = require("nodemailer");
const axios = require("axios");

process.loadEnvFile();

const { GMAIL_USER, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } = process.env;

const authData = {
    type: 'OAuth2',
    user: 'greenroofoficial@gmail.com',
    clientId: "718505879287-va6hhk081tt2ol5o3fu5ja1f4ttc5nii.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken: "1//0429uo86H0yvVCgYIARAAGAQSNwF-L9IrawgHNO-yvMFWD-SNlOndfs0KKMUT3A2pxlSt6j_WQWJuQNUQX8ZvmFlIZEEHnuz3CUY",
    accessToken: 'ya29.a0AfB_byAcsWlOh-7gYBqa5gAekBd6X2y8eSbG4GSQ4dr2r60zQyiDQnxxXUmHd2MF-Toq2OkrLhRoE0Iy3l1nB4IuvCI_TPsRjIr0bWKEgQ3f2usJGzLqs33cv8ZBiiYN9UE3pa6CQ9Jj6-2K4C0lWIp87ipXkbMlcquLaCgYKAeISARESFQHGX2Mi_dRjA6axbmQYPBSX-eA13Q0171',
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