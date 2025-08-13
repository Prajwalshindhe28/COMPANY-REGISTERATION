const admin = require("firebase-admin");
const serviceAccount = require("./bluestock-auth-9f86d-firebase-adminsdk-fbsvc-8ff6c6e1dc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
