const fetch = require("node-fetch");

process.loadEnvFile();

const verifyRecaptcha = async (recaptchaValue) => {
  try {
    console.log("Verifying reCAPTCHA...");

    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET;
    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaValue}`;

    const recaptchaResult = await fetch(recaptchaUrl, {
      method: "POST",
    });

    const recaptchaData = await recaptchaResult.json();

    console.log("reCAPTCHA verification result:", recaptchaData);

    return recaptchaData.success;
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return false;
  }
};

module.exports = {
  verifyRecaptcha,
};
