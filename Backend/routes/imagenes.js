import express from "express";
import { uploadSingle } from "../middleware/uploadMiddleware.js";
import {
  subirImagenGaleria,
  subirFotoPerfil,
  getImagenesGaleria,
  eliminarImagenGaleria,
} from "../controllers/imagenesUpload.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id/imagenes", getImagenesGaleria);
router.post(
  "/:id/imagenes",
  verifyToken,
  uploadSingle("imagen"),
  subirImagenGaleria,
);
router.put("/:id/perfil", verifyToken, uploadSingle("imagen"), subirFotoPerfil);
router.delete("/:id/imagenes/:imagenId", verifyToken, eliminarImagenGaleria);

export default router;
