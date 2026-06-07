// src/middlewares/upload.middleware.js
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(), // RAM, nunca toca disco ni B2
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Solo se aceptan archivos PDF"), false);
    }
  },
});

module.exports = upload;
