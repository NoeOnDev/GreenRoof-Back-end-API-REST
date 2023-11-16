const socketHandler = require('../../../socketHandler');
const connection = require('../../database/database');
const moment = require('moment-timezone');

async function saveSensorData(req, res) {
    try {
        const { temperatura_dht, humedad_dht, temperatura_exterior, estado_suelo } = req.body;

        if (!temperatura_dht || !humedad_dht || !temperatura_exterior || !estado_suelo) {
            return res.status(400).json({ error: 'Por favor, proporcione todos los datos requeridos.' });
        }

        const insertQuery = 'INSERT INTO sensor (temperatura_dht, humedad_dht, temperatura_exterior, estado_suelo) VALUES (?, ?, ?, ?)';
        const insertValues = [temperatura_dht, humedad_dht, temperatura_exterior, estado_suelo];
        const result = await queryDatabase(insertQuery, insertValues);

        const fecha_registro = result && result.insertId ? await getFechaRegistro(result.insertId) : null;

        socketHandler.emitSensorData({ temperatura_dht, humedad_dht, temperatura_exterior, estado_suelo, fecha_registro });

        res.status(200).json({ message: 'Datos del sensor guardados con éxito.' });
    } catch (error) {
        console.error('Error al guardar datos del sensor:', error);
        res.status(500).json({ error: 'Ocurrió un error al guardar datos del sensor.' });
    }
}

async function getFechaRegistro(insertId) {
    const selectQuery = 'SELECT fecha_registro FROM sensor WHERE id = ?';
    const selectValues = [insertId];
    const result = await queryDatabase(selectQuery, selectValues);

    const fechaRegistroUTC = result && result.length > 0 ? result[0].fecha_registro : null;
    const fechaRegistroMexico = fechaRegistroUTC
        ? moment.utc(fechaRegistroUTC).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss')
        : null;

    return fechaRegistroMexico;
}

async function queryDatabase(query, values) {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (err, results) => {
            if (err) {
                console.error('Error query  ing the database:', err);
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
