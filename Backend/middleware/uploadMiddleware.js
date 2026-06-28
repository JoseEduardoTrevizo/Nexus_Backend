// src/middlewares/upload.middleware.js
import multer from "multer";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 8;

const TIPOS_PERMITIDOS = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

export const upload = multer({
  storage: multer.memoryStorage(), // RAM, nunca toca disco ni B2
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (TIPOS_PERMITIDOS.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Solo se aceptan archivos PDF,DOC o DOCX"), false);
    }
  },
});

export const uploadImg = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error("Tipo de archivo no permitido"));
    }
    cb(null, true);
  },
});

// Wrapper que convierte errores de Multer en respuestas JSON legibles
export function uploadSingle(fieldName) {
  return (req, res, next) => {
    uploadImg.single(fieldName)(req, res, (err) => {
      if (!err) return next();

      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: `El archivo es demasiado grande. El límite es ${MAX_SIZE_MB}MB.`,
        });
      }

      if (err.message === "Tipo de archivo no permitido") {
        return res.status(400).json({
          error: "Solo se permiten imágenes JPG, PNG o WebP.",
        });
      }

      // Cualquier otro error de Multer
      return res.status(400).json({
        error: err.message || "Error al procesar el archivo.",
      });
    });
  };
}
