const bcrypt = require("bcrypt");
const connection = require("../../database/database");
const {
  sendPasswordChangeConfirmationEmail,
} = require("../../services/resetPasswordServices/changePasswordService");
const { isStrongPassword } = require("../../utils/passwordUtils");

async function changePasswordController(req, res) {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        error:
          "La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número",
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await updatePassword(email, hashedPassword);

    await sendPasswordChangeConfirmationEmail(email);

    res.status(200).json({ message: "Contraseña cambiada exitosamente" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al cambiar la contraseña" });
  }
}

async function updatePassword(email, hashedPassword) {
  return new Promise((resolve, reject) => {
    const updatePasswordQuery =
      "UPDATE users SET password = ?, verificationCode = NULL WHERE email = ?";
    connection.query(updatePasswordQuery, [hashedPassword, email], (err) => {
      if (err) {
        console.error("Error updating password:", err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  changePasswordController,
};
