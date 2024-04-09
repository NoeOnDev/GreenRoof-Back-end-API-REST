const express = require('express');
const http = require('http');
const cors = require('cors');
//const startRabbitMQConsumer = require('./src/services/registerDataSensorsServices/rabbitmqConsumer');

const app = express();
const server = http.createServer(app);
const socketHandler = require('./src/services/registerDataSensorsServices/socketHandler');

app.use(express.json());
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

app.get("/", (req, res) => {
    res.send("API Funcionando!");
});

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
app.get('/media-sensores' ,getMediaSensorDataController.getMediaSensorData);

//startRabbitMQConsumer();
socketHandler.initSocket(server);

const PORT = 3000;

server.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
