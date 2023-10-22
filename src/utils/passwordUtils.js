const bcrypt = require("bcrypt");
const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongPasswordRegex.test(password);
};

function validarPasswords(req, res, next) {
    const { newPassword, confirmPassword } = req.body;

    try {
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'Las contraseñas no coinciden' });
        }
        next();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al validar las contraseñas' });
    }
}

async function generateHashedPassword(password) {
    try {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error generating hashed password:', error);

        if (error instanceof bcrypt.BcryptError) {
            throw new Error('Error en el proceso de hashing de la contraseña');
        } else {
            throw new Error('Error interno durante la generación de la contraseña');
        }
    }
}


module.exports = {
    isStrongPassword,
    validarPasswords,
    generateHashedPassword,
};

