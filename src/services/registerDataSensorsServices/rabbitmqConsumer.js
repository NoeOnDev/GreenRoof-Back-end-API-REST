require('dotenv').config();
const amqp = require('amqplib/callback_api');
const axios = require('axios');

module.exports = function startRabbitMQConsumer() {

    const rabbitmqHost = process.env.RABBITMQ_HOST;
    const rabbitmqUser = process.env.RABBITMQ_USER;
    const rabbitmqPassword = process.env.RABBITMQ_PASSWORD;
    const rabbitmqExchange = process.env.RABBITMQ_EXCHANGE;
    const rabbitmqQueue = process.env.RABBITMQ_QUEUE;
    const rabbitmqRoutingKey = process.env.RABBITMQ_ROUTING_KEY;

amqp.connect(`amqp://${rabbitmqUser}:${rabbitmqPassword}@${rabbitmqHost}`, (error0, connection) => {
  if (error0) {
    console.error('Error al conectar con RabbitMQ:', error0.message);
    process.exit(1);
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      console.error('Error al crear el canal:', error1.message);
      process.exit(1);
    }
    channel.assertExchange(rabbitmqExchange, 'topic', { durable: true });
    channel.assertQueue(rabbitmqQueue, { durable: true });
    channel.bindQueue(rabbitmqQueue, rabbitmqExchange, rabbitmqRoutingKey);

    console.log('Esperando mensajes. Para salir, presiona CTRL+C');

    channel.consume(rabbitmqQueue, (msg) => {
      if (msg.content) {
        try {
          const message = JSON.parse(msg.content.toString());
          console.log('Mensaje recibido:', message);

          sendToAnotherAPI(message);
        } catch (error) {
          console.error('Error al parsear el mensaje JSON:', error);
          console.log('Contenido del mensaje:', msg.content.toString());
        }
      }
    }, { noAck: true });
  });
});

function sendToAnotherAPI(data) {
  const apiUrl = 'http://localhost:5000/sensores';

  axios.post(apiUrl, data, { headers: { 'Content-Type': 'application/json' } })
    .then(response => {
      console.log('Respuesta de la API:', response.data);
    })
    .catch(error => {
      console.error('Error al enviar los datos a la API:', error.message);
    });
}
  };