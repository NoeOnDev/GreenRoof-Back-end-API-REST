const nodemailer = require("nodemailer");
const axios = require("axios");

process.loadEnvFile();

const { GMAIL_USER, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_ACCESS_TOKEN } = process.env;

const authData = {
    type: 'OAuth2',
    user: GMAIL_USER,
    clientId: GMAIL_CLIENT_ID,
    clientSecret: GMAIL_CLIENT_SECRET,
    refreshToken: GMAIL_REFRESH_TOKEN,
    accessToken: GMAIL_ACCESS_TOKEN,
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