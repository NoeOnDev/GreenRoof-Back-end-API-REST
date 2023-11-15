const nodemailer = require("nodemailer");
const axios = require("axios");

const authData = {
    type: 'OAuth2',
    user: 'greenroofoficial@gmail.com',
    clientId: "718505879287-va6hhk081tt2ol5o3fu5ja1f4ttc5nii.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken: "1//04jCtvCFwbsx5CgYIARAAGAQSNwF-L9IrCYHNFkG8iAIRmwCjxi_jFO2MQ2GY7C8D_4tPJz5e3BhAKHN0-4LKJL3Y1ijmrUsHZTk",
    accessToken: 'ya29.a0AfB_byBsbMFCq8yew5xyr9R8DbghJ2QFoC5Ehs6AgIsjQp5v844RneHLSYmlnDj-mHfb3KclSDJKy9c3e-ariP8Gz_p_JOTUQt5nqvrqEDDZcsf-UVvyXE49x7fIl-4PVOKrhcT4z1EYaJ68MHz1v7KiQmdXXuR3v8jlaCgYKAdUSARESFQHGX2MiZdn7muHwhRUurbOI0FWhxg0171',
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