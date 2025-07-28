# EduLab Website

**EduLab** adalah platform edukasi digital modern yang menyediakan berbagai layanan pembelajaran, blog, portofolio proyek, dan fitur interaktif untuk mendukung pengembangan karir di era digital.

## 🚀 Fitur Utama

- **Homepage:** Hero interaktif, statistik animasi, katalog layanan, testimoni carousel, dan CTA.
- **Tentang Kami:** Timeline perjalanan, statistik perusahaan, profil tim, dan nilai-nilai inti.
- **Layanan & Produk:** Katalog produk, filter kategori, kalkulator estimasi biaya, tabel perbandingan paket, dan form permintaan kustom.
- **Blog:** Daftar artikel, filter kategori, pencarian, preview, dan pagination.
- **Portofolio:** Showcase proyek, filter kategori, modal detail proyek, galeri gambar, dan testimoni klien.
- **Kontak:** Form kontak dengan validasi, info kantor, FAQ interaktif, dan chatbot EduBot.

## 🗂️ Struktur Direktori

```
.
├── about.html
├── blog.html
├── contact.html
├── index.html
├── portofolio.html
├── services.html
├── assets/
│   ├── components/
│   │   ├── navbar.html
│   │   └── product-card.html
│   ├── css/
│   │   ├── about-styles.css
│   │   ├── blog-styles.css
│   │   ├── contact-styles.css
│   │   ├── global.css
│   │   ├── index-styles.css
│   │   ├── portofolio-styles.css
│   │   └── services-styles.css
│   ├── data/
│   │   ├── about.json
│   │   ├── blog.json
│   │   ├── contact.json
│   │   ├── index.json
│   │   ├── portofolio.json
│   │   ├── services.json
│   │   └── testimonials.json
│   ├── images/
│   │   ├── hero.jpg
│   │   ├── landing-page.png
│   │   └── logo.png
│   └── js/
│       ├── about-scripts.js
│       ├── blog-scripts.js
│       ├── contact-scripts.js
│       ├── index-scripts.js
│       ├── portofolio-scripts.js
│       └── services-scripts.js
```

## 📦 Teknologi

- **HTML5, CSS3, JavaScript (Vanilla)**
- Data dinamis menggunakan file JSON di `assets/data/`
- Komponen modular (navbar, product card, dsb)
- Efek animasi dan interaktif tanpa framework frontend
- Tidak membutuhkan backend/server khusus

## 💡 Cara Menjalankan

1. **Clone repository ini:**
   ```sh
   git clone https://github.com/JeffereyCI/edulab-website.git
   cd edulab
   ```
2. **Buka file `index.html` di browser** dengan extension Live Server pada VScode atau Codespaces github untuk mulai menjelajah.
3. Semua data dinamis diambil dari file JSON di folder `assets/data/`.

## ✏️ Kustomisasi Konten

- **Produk/Layanan:** Edit [`assets/data/services.json`](assets/data/services.json)
- **Artikel Blog:** Edit [`assets/data/blog.json`](assets/data/blog.json)
- **Proyek Portofolio:** Edit [`assets/data/portofolio.json`](assets/data/portofolio.json)
- **FAQ & Kontak:** Edit [`assets/data/contact.json`](assets/data/contact.json)

