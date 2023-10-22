const nodemailer = require("nodemailer");
const axios = require("axios");

const authData = {
    type: 'OAuth2',
    user: 'greenroofoficial@gmail.com',
    clientId: "718505879287-va6hhk081tt2ol5o3fu5ja1f4ttc5nii.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken: "1//04rSC6ZhsLO46CgYIARAAGAQSNwF-L9IrpmlBezgCPUrqWHDqBNESQkk_7Jl-NbtMGDh-4Pm5ca_PURKtC5PY0eygEZ7kD1vug0A",
    accessToken: 'ya29.a0AfB_byAxUVmQSQURZFsBwcCc0pil4z16sRwSU6CkWZKX3GDfVey0uJzSxPBegImhATAvOgMBpEGjwu9_OR76Q99w2FG4Rg94eu10qQKKmv3AXdD7dfFJXkYoE1uiM2J_63WHOxqpchgLjOOMjHHynl0JTRVSF8-EWFexaCgYKAYwSARESFQGOcNnCsiOA-KJz0qUVg5B3emr0_A0171',
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