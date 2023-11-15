const connection = require('../../database/database');

async function saveSensorData(req, res) {
    try {
        const { temperatura_dht, humedad_dht, temperatura_exterior, estado_suelo } = req.body;

        if (!temperatura_dht || !humedad_dht || !temperatura_exterior || !estado_suelo) {
            return res.status(400).json({ error: 'Por favor, proporcione todos los datos requeridos.' });
        }

        const insertQuery = 'INSERT INTO sensor (temperatura_dht, humedad_dht, temperatura_exterior, estado_suelo) VALUES (?, ?, ?, ?)';
        const insertValues = [temperatura_dht, humedad_dht, temperatura_exterior, estado_suelo];
        await queryDatabase(insertQuery, insertValues);

        res.status(200).json({ message: 'Datos del sensor guardados con éxito.' });
    } catch (error) {
        console.error('Error al guardar datos del sensor:', error);
        res.status(500).json({ error: 'Ocurrió un error al guardar datos del sensor.' });
    }
}

async function queryDatabase(query, values) {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (err, results) => {
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
    saveSensorData,
};
