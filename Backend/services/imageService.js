import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

const MAX_DIMENSION = 1600; // px, lado más largo

async function processAndUpload(buffer, empresaId, { isProfile = false } = {}) {
  const webpBuffer = await sharp(buffer)
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();

  const key = isProfile
    ? `negocios/${empresaId}/perfil.webp`
    : `negocios/${empresaId}/${uuidv4()}.webp`;

  // Si es perfil, intenta borrar la versión anterior primero
  if (isProfile) {
    try {
      await deleteFromB2(key);
    } catch {
      // Si no existe versión previa, ignorar el error
    }
  }

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: key,
      Body: webpBuffer,
      ContentType: "image/webp",
    }),
  );

  const timestamp = Date.now();
  return {
    url: isProfile
      ? `${process.env.IMG_CDN_BASE}/${key}?v=${timestamp}`
      : `${process.env.IMG_CDN_BASE}/${key}`,
    key,
  };
}

async function getB2AuthToken() {
  const credentials = Buffer.from(
    `${process.env.B2_KEY_ID}:${process.env.B2_APPLICATION_KEY}`,
  ).toString("base64");

  const res = await fetch(
    "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
    {
      headers: { Authorization: `Basic ${credentials}` },
    },
  );

  const data = await res.json();
  return {
    apiUrl: data.apiUrl,
    authToken: data.authorizationToken,
  };
}

async function deleteFromB2(key) {
  const { apiUrl, authToken } = await getB2AuthToken();

  // 1. Listar todas las versiones del archivo por nombre
  const listRes = await fetch(`${apiUrl}/b2api/v2/b2_list_file_versions`, {
    method: "POST",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bucketId: process.env.B2_BUCKET_ID,
      startFileName: key,
      startFileId: null,
      maxFileCount: 50,
      prefix: key,
    }),
  });

  const listData = await listRes.json();

  // 2. Borrar cada versión por fileId
  const versiones = listData.files.filter((f) => f.fileName === key);

  await Promise.all(
    versiones.map((version) =>
      fetch(`${apiUrl}/b2api/v2/b2_delete_file_version`, {
        method: "POST",
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: version.fileName,
          fileId: version.fileId,
        }),
      }),
    ),
  );
}

export { processAndUpload, deleteFromB2 };
