// src/services/email/resend.service.js
const { Resend } = require("resend");
const aplicacionTemplate = require("./templates/aplicacion.template");

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envía el correo de aplicación a la empresa.
 * El cvBuffer viene de multer memoryStorage — se pasa como adjunto y se descarta.
 */
const enviarAplicacion = async ({
  empresaEmail,
  empresaNombre,
  vacanteTitulo,
  candidato,
  cvBuffer, // Buffer | undefined
  cvNombre, // string | undefined
}) => {
  const attachments = cvBuffer
    ? [
        {
          filename: cvNombre || `CV_${candidato.nombre}.pdf`,
          content: cvBuffer, // Resend acepta Buffer directamente
        },
      ]
    : [];

  const { data, error } = await resend.emails.send({
    from: `Enlace Local <${process.env.EMAIL_FROM}>`,
    to: empresaEmail,
    subject: `Nueva aplicación para: ${vacanteTitulo}`,
    html: aplicacionTemplate({
      vacanteTitulo,
      empresaNombre,
      candidato: {
        ...candidato,
        tieneCv: !!cvBuffer,
      },
    }),
    attachments,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return data;
};

module.exports = { enviarAplicacion };
