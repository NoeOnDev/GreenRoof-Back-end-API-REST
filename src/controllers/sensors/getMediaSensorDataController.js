const connection = require('../../database/database');

async function getMediaSensorData(req, res) {
    try {
        const selectQuery = 'SELECT temperatura_dht, humedad_dht, temperatura_exterior FROM sensor';
        const result = await queryDatabase(selectQuery);

        const totalTemperatura = result.reduce((sum, dato) => sum + dato.temperatura_dht, 0);
        const mediaTemperatura = (totalTemperatura / result.length).toFixed(2);

        const totalHumedad = result.reduce((sum, dato) => sum + dato.humedad_dht, 0);
        const mediaHumedad = (totalHumedad / result.length).toFixed(2);

        const totalTemperaturaExterior = result.reduce((sum, dato) => sum + dato.temperatura_exterior, 0);
        const mediaTemperaturaExterior = (totalTemperaturaExterior / result.length).toFixed(2);

        res.status(200).json({
            mediaTemperatura,
            mediaHumedad,
            mediaTemperaturaExterior,
        });
    } catch (error) {
        console.error('Error al obtener las medias de los sensores:', error);
        res.status(500).json({ error: 'Ocurrió un error al obtener las medias de los sensores.' });
    }
}

async function queryDatabase(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error querying the database:', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = {
    getMediaSensorData,
};
