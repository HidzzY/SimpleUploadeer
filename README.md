# 🚀 Simple Uploadeer

Sebuah platform web sederhana untuk mengunggah file ke berbagai host CDN (Uguu & Ikyy CDN) menggunakan **Vercel Serverless Functions**.

## ✨ Fitur
*   **Multi-Host Support:** Pilih antara Uguu atau Ikyy CDN.
*   **Drag & Drop:** Antarmuka modern dengan fitur tarik-dan-lepas file.
*   **Progress Bar:** Indikator unggahan secara real-time.
*   **Auto Copy:** Salin URL hasil unggahan dengan satu klik.
*   **Responsive:** Tampilan optimal di perangkat mobile maupun desktop.

## 🛠️ Tech Stack
*   **Frontend:** HTML5, Tailwind-like CSS, Vanilla JavaScript.
*   **Backend:** Node.js (Vercel Serverless Functions).
*   **Libraries:** `formidable`, `node-fetch`, `form-data`.

## 🚀 Cara Instalasi Lokal
1.  Clone repository:
    ```bash
    git clone [https://github.com/HidzzY/SimpleUploadeer.git](https://github.com/HidzzY/SimpleUploadeer.git)
    ```
2.  Masuk ke direktori:
    ```bash
    cd SimpleUploadeer
    ```
3.  Instal dependencies:
    ```bash
    npm install
    ```

## 🌐 Deployment
Project ini dirancang untuk di-deploy di **Vercel**. Pastikan struktur folder Anda mengikuti aturan berikut:
*   `/api`: Berisi logika serverless (`upload.js`).
*   `/public`: Berisi file statis (`index.html`, `script.js`, `style.css`).
*   `vercel.json`: Konfigurasi routing.

---
Dibuat dengan ❤️ oleh [Hidz](https://github.com/HidzzY)
