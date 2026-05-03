import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Hanya menerima metode POST' });
  }

  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Gagal memproses file di server" });
    }

    try {
      const host = Array.isArray(fields.host) ? fields.host[0] : fields.host;
      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      if (!file) {
        return res.status(400).json({ error: "Tidak ada file yang diterima" });
      }

      const targetFormData = new FormData();
      targetFormData.append('file', fs.createReadStream(file.filepath), {
        filename: file.originalFilename || 'upload.bin',
        contentType: file.mimetype || 'application/octet-stream',
      });

      const API_TARGET = `https://api.ikyyxd.my.id/uploads?host=${host}`;

      const response = await fetch(API_TARGET, {
        method: 'POST',
        body: targetFormData,
        headers: targetFormData.getHeaders(),
      });

      const responseText = await response.text();
      
      try {
        const data = JSON.parse(responseText);
        res.status(response.status).json(data);
      } catch (e) {
        res.status(response.status).send(responseText);
      }

    } catch (error) {
      res.status(500).json({ error: "Gagal mengirim ke server pusat: " + error.message });
    }
  });
}
