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

        const desviacionTemperatura = calcularDesviacionEstandar(result.map(dato => dato.temperatura_dht)).toFixed(2);
        const desviacionHumedad = calcularDesviacionEstandar(result.map(dato => dato.humedad_dht)).toFixed(2);
        const desviacionTemperaturaExterior = calcularDesviacionEstandar(result.map(dato => dato.temperatura_exterior)).toFixed(2);

        const umbralTemperaturaAlta = 26; 
        const umbralTemperaturaBaja = 15; 
        const umbralTemperaturaExternaAlta = 30; 
        const umbralHumedadAlta = 80; 
        const umbralHumedadBaja = 20; 

        const probabilidadTemperaturaAlta = calcularProbabilidadExcederUmbral(result.map(dato => dato.temperatura_dht), umbralTemperaturaAlta).toFixed(2);
        const probabilidadTemperaturaBaja = calcularProbabilidadDebajoUmbral(result.map(dato => dato.temperatura_dht), umbralTemperaturaBaja).toFixed(2);
        const probabilidadTemperaturaExternaAlta = calcularProbabilidadExcederUmbral(result.map(dato => dato.temperatura_exterior), umbralTemperaturaExternaAlta).toFixed(2);
        const probabilidadHumedadAlta = calcularProbabilidadExcederUmbral(result.map(dato => dato.humedad_dht), umbralHumedadAlta).toFixed(2);
        const probabilidadHumedadBaja = calcularProbabilidadDebajoUmbral(result.map(dato => dato.humedad_dht), umbralHumedadBaja).toFixed(2);

        res.status(200).json({
            mediaTemperatura,
            desviacionTemperatura,
            probabilidadTemperaturaAlta,
            probabilidadTemperaturaBaja,
            mediaHumedad,
            desviacionHumedad,
            probabilidadHumedadAlta,
            probabilidadHumedadBaja,
            mediaTemperaturaExterior,
            desviacionTemperaturaExterior,
            probabilidadTemperaturaExternaAlta,
        });
    } catch (error) {
        console.error('Error al obtener las medias y probabilidades de los sensores:', error);
        res.status(500).json({ error: 'Ocurrió un error al obtener las medias y probabilidades de los sensores.' });
    }
}

function calcularDesviacionEstandar(data) {
    const n = data.length;
    const media = data.reduce((sum, value) => sum + value, 0) / n;
    const sumSquaredDifferences = data.reduce((sum, value) => sum + Math.pow(value - media, 2), 0);
    const variance = sumSquaredDifferences / n;
    return Math.sqrt(variance);
}

function calcularProbabilidadExcederUmbral(data, umbral) {
    const countExceedingThreshold = data.filter(value => value > umbral).length;
    return countExceedingThreshold / data.length;
}

function calcularProbabilidadDebajoUmbral(data, umbral) {
    const countBelowThreshold = data.filter(value => value < umbral).length;
    return countBelowThreshold / data.length;
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
