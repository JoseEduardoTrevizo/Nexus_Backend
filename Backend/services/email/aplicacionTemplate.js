// src/services/email/templates/aplicacion.template.js
const camposOpcionales = (candidato) => {
  const campos = [
    { label: "Apellido", value: candidato.apellido },
    { label: "Edad", value: candidato.edad },
    { label: "Domicilio", value: candidato.domicilio },
    { label: "Sexo", value: candidato.sexo },
    { label: "Fecha de nacimiento", value: candidato.fechaNacimiento },
    { label: "Estado civil", value: candidato.estadoCivil },
    { label: "Escolaridad", value: candidato.escolaridad },
    { label: "Título recibido", value: candidato.tituloRecibido },
    { label: "Idiomas", value: candidato.idiomas },
    { label: "Software", value: candidato.software },
    { label: "Máquinas de oficina", value: candidato.maquinas },
    { label: "Otros trabajos", value: candidato.otroTrabajos },
    { label: "Empresa anterior", value: candidato.empresa },
    { label: "Puesto anterior", value: candidato.puesto },
    { label: "Actividades desempeñadas", value: candidato.descripcion },
  ].filter((c) => c.value);

  return campos
    .map(
      ({ label, value }) => `
                <tr>
                  <td style="padding:16px 20px; border-bottom:1px solid #e5e7eb;">
                    <span style="font-size:12px; color:#6b7280; display:block;
                                 text-transform:uppercase; letter-spacing:0.05em;">
                      ${label}
                    </span>
                    <span style="font-size:15px; color:#111827; line-height:1.6;">
                      ${value}
                    </span>
                  </td>
                </tr>`,
    )
    .join("");
};

const aplicacionTemplate = ({ vacanteTitulo, empresaNombre, candidato }) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Nueva aplicación</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff; border-radius:8px; overflow:hidden;
                 box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#1a56db; padding: 32px 40px;">
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">
                Enlace Local
              </h1>
              <p style="margin:6px 0 0; color:#bfdbfe; font-size:14px;">
                Nueva aplicación recibida
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 40px;">
              <p style="margin:0 0 8px; font-size:15px; color:#374151;">
                Hola, <strong>${empresaNombre}</strong>
              </p>
              <p style="margin:0 0 28px; font-size:15px; color:#374151;">
                Un candidato aplicó a tu vacante
                <strong style="color:#1a56db;">${vacanteTitulo}</strong>.
                Aquí están sus datos:
              </p>

              <!-- Datos del candidato -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#f9fafb; border-radius:6px;
                       border: 1px solid #e5e7eb; margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px; border-bottom:1px solid #e5e7eb;">
                    <span style="font-size:12px; color:#6b7280; display:block;
                                 text-transform:uppercase; letter-spacing:0.05em;">
                      Nombre
                    </span>
                    <span style="font-size:15px; color:#111827; font-weight:600;">
                      ${candidato.nombre}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px; border-bottom:1px solid #e5e7eb;">
                    <span style="font-size:12px; color:#6b7280; display:block;
                                 text-transform:uppercase; letter-spacing:0.05em;">
                      Correo
                    </span>
                    <a href="mailto:${candidato.email}"
                       style="font-size:15px; color:#1a56db; font-weight:600;">
                      ${candidato.email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px; border-bottom:1px solid #e5e7eb;">
                    <span style="font-size:12px; color:#6b7280; display:block;
                                 text-transform:uppercase; letter-spacing:0.05em;">
                      Teléfono
                    </span>
                    <span style="font-size:15px; color:#111827; font-weight:600;">
                      ${candidato.telefono || "No proporcionado"}
                    </span>
                  </td>
                </tr>
                ${camposOpcionales(candidato)}
                ${
                  candidato.mensaje
                    ? `
                <tr>
                  <td style="padding:16px 20px;">
                    <span style="font-size:12px; color:#6b7280; display:block;
                                 text-transform:uppercase; letter-spacing:0.05em;">
                      Mensaje
                    </span>
                    <span style="font-size:15px; color:#111827; line-height:1.6;">
                      ${candidato.mensaje}
                    </span>
                  </td>
                </tr>`
                    : ""
                }
              </table>

              ${
                candidato.tieneCv
                  ? `
              <p style="margin:0; font-size:14px; color:#374151;">
                📎 El CV del candidato viene adjunto en este correo.
              </p>`
                  : `
              <p style="margin:0; font-size:14px; color:#6b7280;">
                El candidato no adjuntó CV.
              </p>`
              }
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background:#f9fafb;
                       border-top:1px solid #e5e7eb;">
              <p style="margin:0; font-size:12px; color:#9ca3af; text-align:center;">
                Este mensaje fue generado automáticamente por
                <a href="https://enlacelocal.mx" style="color:#1a56db;">
                  Enlace Local
                </a>.
                Para gestionar tus vacantes, ingresa a tu cuenta.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

export default aplicacionTemplate;
