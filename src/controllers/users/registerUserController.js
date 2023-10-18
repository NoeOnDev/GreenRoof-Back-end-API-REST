const bcrypt = require('bcrypt');
const crypto = require('crypto');
const validator = require('validator');
const fetch = require('node-fetch');
require('dotenv').config();

const { isStrongPassword, generateHashedPassword } = require('../../utils/passwordUtils');
const registerEmailService = require('../../services/registerUsersServices/registerEmailService');
const connection = require('../../database/database');

async function registerUserController(req, res) {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ error: 'Por favor complete todos los campos requeridos antes de registrarse' });
        }

        if (!isStrongPassword(password)) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número' });
        }

        const allowedDomains = [
            'gmail.com',
            'ids.upchiapas.edu.mx',
            'yahoo.com.mx',
            'hotmail.com',
            'catolica.edu.sv'
        ];

        const emailDomain = email.split('@')[1];

        if (!allowedDomains.includes(emailDomain)) {
            return res.status(400).json({ error: 'Correo de dominio no permitido' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Ingrese un email válido' });
        }

        const existingUserQuery = 'SELECT * FROM users WHERE email = ?';

        const results = await new Promise((resolve, reject) => {
            connection.query(existingUserQuery, [email], (err, results) => {
                if (err) {
                    console.error('Error querying the database:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (results.length > 0) {
            if (results[0].verified) {
                return res.status(400).json({ error: 'Este correo ya está registrado y verificado' });
            } else {
                const verificationToken = crypto.randomBytes(32).toString('hex');
                const hashedPassword = await generateHashedPassword(password);

                try {
                    await registerEmailService.sendVerificationEmail(email, verificationToken);
                } catch (error) {
                    console.error('Error al enviar el correo:', error);
                    return res.status(500).json({ error: 'Ocurrió un error al enviar el correo de verificación.' });
                }

                const updateQuery = 'UPDATE users SET username = ?, password = ?, verificationToken = ? WHERE email = ?';
                const updateValues = [username, hashedPassword, verificationToken, email];

                await new Promise((resolve, reject) => {
                    connection.query(updateQuery, updateValues, (err, updateResult) => {
                        if (err) {
                            console.error('Error updating user:', err);
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });

                return res.status(200).json({ message: 'Su registro ha sido actualizado con éxito' });
            }
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const hashedPassword = await generateHashedPassword(password);

        try {
            await registerEmailService.sendVerificationEmail(email, verificationToken);
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            return res.status(500).json({ error: 'Ocurrió un error al enviar el correo de verificación.' });
        }

        const insertQuery = 'INSERT INTO users (email, username, password, verificationToken, verified) VALUES (?, ?, ?, ?, ?)';
        const insertValues = [email, username, hashedPassword, verificationToken, false];

        await new Promise((resolve, reject) => {
            connection.query(insertQuery, insertValues, (err, insertResult) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        res.status(200).json({ message: 'Su registro ha sido completado' });
    } catch (error) {
        console.error('Error interno en el servidor:', error);
        res.status(500).json({ error: 'Ocurrió un error durante el proceso de registro. Por favor, inténtelo de nuevo más tarde.' });
    }
}

module.exports = {
    registerUserController,
};
