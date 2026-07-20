import db from "../config/database.js";
import { processAndUpload, deleteFromB2 } from "../services/imageService.js";
import { getLimiteYConteo } from "../services/planLimitService.js";

// POST /api/empresas/:id/imagenes
async function subirImagenGaleria(req, res) {
  const empresaId = req.params.id;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se recibió ningún archivo" });
    }

    const { limite, conteo, plan_nombre } = await getLimiteYConteo(empresaId);

    if (conteo >= limite) {
      return res.status(403).json({
        error: `Límite de imágenes alcanzado para el plan ${plan_nombre} (${limite} imagen${limite === 1 ? "" : "es"})`,
      });
    }

    const { url, key } = await processAndUpload(req.file.buffer, empresaId);

    await db.query(
      `INSERT INTO imagenes_empresa (empresa_id, url, b2_key, orden)
       VALUES (?, ?, ?, ?)`,
      [empresaId, url, key, conteo], // orden = conteo actual = siguiente posición
    );

    res.status(201).json({ url });
  } catch (err) {
    console.error("subirImagenGaleria:", err);
    if (err.message === "La empresa no tiene una suscripción activa") {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: "Error al subir la imagen" });
  }
}

// PUT /api/empresas/:id/perfil
async function subirFotoPerfil(req, res) {
  const empresaId = req.params.id;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se recibió ningún archivo" });
    }

    // perfil.webp siempre tiene el mismo key → B2 lo sobrescribe automáticamente
    const { url } = await processAndUpload(req.file.buffer, empresaId, {
      isProfile: true,
    });

    await db.query(`UPDATE empresas SET picture_perfil = ? WHERE id = ?`, [
      url,
      empresaId,
    ]);

    res.json({ url });
  } catch (err) {
    console.error("subirFotoPerfil:", err);
    res.status(500).json({ error: "Error al subir la foto de perfil" });
  }
}

// GET /api/empresas/:id/imagenes
async function getImagenesGaleria(req, res) {
  const empresaId = req.params.id;

  try {
    const [rows] = await db.query(
      `SELECT id, url, orden, es_carrusel
       FROM imagenes_empresa
       WHERE empresa_id = ?
       ORDER BY orden ASC`,
      [empresaId],
    );

    const { limite, conteo } = await getLimiteYConteo(empresaId);
    res.json({ imagenes: rows, limite, conteo });
  } catch (err) {
    console.error("getImagenesGaleria:", err);
    res.status(500).json({ error: "Error al obtener las imágenes" });
  }
}

// DELETE /api/empresas/:id/imagenes/:imagenId
async function eliminarImagenGaleria(req, res) {
  const { id: empresaId, imagenId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT b2_key FROM imagenes_empresa
       WHERE id = ? AND empresa_id = ?`,
      [imagenId, empresaId],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    const { b2_key } = rows[0];

    // Primero borra de B2, luego de MySQL
    // Si B2 falla, MySQL no se toca → no quedan referencias huérfanas
    await deleteFromB2(b2_key);

    await db.query(
      `DELETE FROM imagenes_empresa WHERE id = ? AND empresa_id = ?`,
      [imagenId, empresaId],
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("eliminarImagenGaleria:", err);
    res.status(500).json({ error: "Error al eliminar la imagen" });
  }
}

async function seleccionarImagenCarrusel(req, res) {
  const empresaId = req.params.id;
  const { imagenId } = req.params;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Verificar que la empresa tenga un plan que permita esta función
    const [[empresa]] = await connection.query(
      `
      SELECT p.nombre AS plan
      FROM empresas e
      INNER JOIN suscripciones s
        ON s.empresa_id = e.id
      INNER JOIN planes p
        ON p.id = s.plan_id
      WHERE e.id = ?
        AND s.estado = 'activa'
      `,
      [empresaId],
    );

    if (!empresa) {
      await connection.rollback();
      return res.status(404).json({
        error: "La empresa no tiene una suscripción activa.",
      });
    }

    if (!["Plan Pro", "Plan Premium"].includes(empresa.plan)) {
      await connection.rollback();
      return res.status(403).json({
        error: "Tu plan no permite seleccionar una imagen para el carrusel.",
      });
    }

    // Verificar que la imagen pertenezca a la empresa
    const [[imagen]] = await connection.query(
      `
      SELECT id
      FROM imagenes_empresa
      WHERE id = ?
        AND empresa_id = ?
      `,
      [imagenId, empresaId],
    );

    if (!imagen) {
      await connection.rollback();
      return res.status(404).json({
        error: "La imagen no existe o no pertenece a la empresa.",
      });
    }

    // Quitar la selección anterior
    await connection.query(
      `
      UPDATE imagenes_empresa
      SET es_carrusel = 0
      WHERE empresa_id = ?
      `,
      [empresaId],
    );

    // Marcar la nueva imagen
    await connection.query(
      `
      UPDATE imagenes_empresa
      SET es_carrusel = 1
      WHERE id = ?
      `,
      [imagenId],
    );

    await connection.commit();

    res.json({
      message: "Imagen del carrusel actualizada correctamente.",
    });
  } catch (err) {
    await connection.rollback();

    console.error("seleccionarImagenCarrusel:", err);

    res.status(500).json({
      error: "Error al actualizar la imagen del carrusel.",
    });
  } finally {
    connection.release();
  }
}

export {
  subirImagenGaleria,
  subirFotoPerfil,
  getImagenesGaleria,
  eliminarImagenGaleria,
  seleccionarImagenCarrusel,
};
