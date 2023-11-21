const connection = require('../../database/database');
const moment = require('moment-timezone');

async function getAllSensorData(req, res) {
  try {
    const { limit } = req.query;
    const query = `SELECT fecha_registro, temperatura_dht, humedad_dht, temperatura_exterior, estado_suelo FROM sensor ORDER BY fecha_registro DESC LIMIT ${limit || 100}`;
    const sensorData = await queryDatabase(query);

    const formattedSensorData = sensorData.map((data) => ({
      ...data,
      fecha_registro: formatDate(data.fecha_registro),
    }));

    res.status(200).json(formattedSensorData);
  } catch (error) {
    console.error('Error al obtener datos del sensor:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener datos del sensor.' });
  }
}

function formatDate(dateString) {
  const fechaRegistroUTC = dateString;
  const fechaRegistroMexico = fechaRegistroUTC
    ? moment.utc(fechaRegistroUTC).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss')
    : null;

  return fechaRegistroMexico;
}

async function queryDatabase(query, values = []) {
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
  getAllSensorData,
};
