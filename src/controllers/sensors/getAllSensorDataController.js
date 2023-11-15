const connection = require('../../database/database');

async function getAllSensorData(req, res) {
  try {

    const query = 'SELECT * FROM sensor';
    const sensorData = await queryDatabase(query);

    res.status(200).json(sensorData);
  } catch (error) {
    console.error('Error al obtener datos del sensor:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener datos del sensor.' });
  }
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
