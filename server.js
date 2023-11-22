const express = require('express');
const http = require('http');
const startRabbitMQConsumer = require('./src/services/registerDataSensorsServices/rabbitmqConsumer');
const socketHandler = require('./src/services/registerDataSensorsServices/socketHandler');
const app = express();
const server = http.createServer(app);
app.use(express.json());
const fetch = require('node-fetch');
const cors = require('cors');
app.use(cors());

const registerUserController = require('./src/controllers/users/registerUserController');
const verifyUserController = require('./src/controllers/users/verifyUserController');
const loginUserController = require('./src/controllers/users/loginUserController');

const requestPasswordResetController = require('./src/controllers/recoveryPassword/requestPasswordResetController');
const verifyPasswordResetCodeController = require('./src/controllers/recoveryPassword/verifyPasswordResetCodeController');
const changePasswordController = require('./src/controllers/recoveryPassword/changePasswordController');

const sensorController = require('./src/controllers/sensors/sensorController');
const getAllSensorDataController = require('./src/controllers/sensors/getAllSensorDataController');
const getMediaSensorDataController = require('./src/controllers/sensors/getMediaSensorDataController');


const middleWare = require('./src/auth/middleware/middleWare');

const { validarPasswords } = require('./src/utils/passwordUtils');

// RUTAS PARA GESTION DE USUARIOS

app.post('/register', registerUserController.registerUserController);
app.get('/verify', verifyUserController.verifyUserController);
app.post('/login', loginUserController.loginUserController);

// RUTAS PARA RESTAURAR CONTRASEÑA

app.post('/solicitar-cambio-contrasena', requestPasswordResetController.requestPasswordResetController);
app.post('/verificar-codigo', verifyPasswordResetCodeController.verifyPasswordResetCodeController);
app.post('/cambiar-contrasena', validarPasswords, changePasswordController.changePasswordController);

// RUTAS PARA SENSORES
app.post('/sensores', sensorController.saveSensorData);
app.get('/sensores', middleWare.verifyToken,getAllSensorDataController.getAllSensorData);
app.get('/media-sensores', middleWare.verifyToken ,getMediaSensorDataController.getMediaSensorData);

startRabbitMQConsumer();
socketHandler.initSocket(server);

server.listen(5000, () => {
    console.log('Server listening on port 5000');
});
