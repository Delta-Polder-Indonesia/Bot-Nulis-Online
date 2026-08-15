# Bot Nulis Online (Text to Handwriting) ✍️

Aplikasi web modern berbasis **React 19**, **Vite**, dan **Tailwind CSS** untuk mengubah teks ketikan menjadi gambar tulisan tangan otentik di atas kertas folio bergaris, kertas kotak-kotak (grid), atau kertas polos. Dilengkapi dukungan penuh untuk penulisan rumus matematika (**KaTeX**), bentuk bangun datar (geometri), identitas header tugas, preset pengaturan instan, dan export resolusi tinggi (300 DPI equivalent).

---

## 🌟 Fitur Unggulan

- ✍️ **Text to Handwriting Alami**: Mengubah teks ketikan menjadi tulisan tangan dengan variasi rotasi dan jitter yang realistis (menggunakan algoritma *Seeded Pseudo-Random* agar deterministik dan tidak berkedip antar render).
- 🔤 **40+ Pilihan Font Tulisan Tangan**:
  - Font Populer: *Kalam, Caveat, Indie Flower, Patrick Hand, Shadows Into Light, Coming Soon*.
  - Font Tambahan: *Dancing Script, Great Vibes, Architects Daughter, Rock Salt, Alex Brush, Mali, dll.* dengan fitur live-search dan dynamic Google Font loader.
- 📐 **Format Kertas Lengkap**:
  - **Folio Bergaris**: Khas kertas binder/SiDU dengan garis margin ganda merah, garis header, logo Saraswati, dan watermark SiDU.
  - **Kotak-kotak (Grid)**: Khas buku milimeter block / catatan matematika & fisika.
  - **Polos (Blank)**: Kertas bersih tanpa garis.
- ➗ **Dukungan Rumus Matematika (KaTeX)**:
  - Tulis rumus apa pun dengan syntax `$$...$$` (contoh: `$$\frac{1}{2}$$`, `$$\sqrt{x}$$`, `$$\int_{0}^{1} x^2 dx$$`, `$$\lim_{x \to 0} \frac{\sin x}{x}$$`).
  - Dilengkapi toolbar tombol cepat untuk simbol matematika, pecahan, integral, sigma, dan huruf Yunani ($\pi, \theta, \alpha, \beta, \Delta, \lambda$).
- 🔷 **Bentuk Bangun Datar Geometri**:
  - Sisipkan ilustrasi bangun datar hand-drawn wobbly: `[shape:circle]`, `[shape:square]`, `[shape:triangle]`, dan `[shape:star]`.
- 🎛️ **Kustomisasi Presisi**:
  - Ukuran font (14px – 28px).
  - Jarak antar baris kertas (24px – 48px).
  - **Posisi Tulisan di Garis**: mode *Di Atas Garis* (tulisan duduk menempel di garis buku, lengkap dengan ekor huruf g/j/p/q/y yang turun melewati garis — seperti menulis di folio sungguhan) atau mode *Tengah-tengah* (tulisan di tengah jarak antar garis).
  - Variasi ketidakteraturan tulisan / roughness (0% sangat rapi – 100% kasual).
  - Margin atas & margin kiri kertas.
  - Pilihan warna tinta pulpen (Biru Standar, Biru Gelap, Hitam Natural, Dongker, Hijau Gelap, Cokelat Vintage, Merah, Ungu) + *Custom Color Picker*.
  - Pilihan warna garis kertas + *Custom Color Picker*.
- 📑 **Identitas Header Kertas**: Kolom fleksibel untuk Nama, NIM, Mata Kuliah, Kelas, Tanggal, dll. dengan template cepat (Format Kuliah & Format Sekolah).
- 💾 **Preset & Auto-Save**:
  - Preset bawaan: *Folio Standar, Tinta Hitam Rapi, Gaya Kasual, Tugas Matematika, Catatan Vintage*.
  - Simpan preset kustom tanpa batas ke `localStorage`.
  - Auto-save konten teks dan seluruh pengaturan secara otomatis.
- ⚡ **Undo / Redo & Shortcut Keyboard**:
  - Undo: `Ctrl + Z`
  - Redo: `Ctrl + Y` atau `Ctrl + Shift + Z`
  - Fullscreen: `ESC` untuk keluar
- 📄 **Multi-Halaman Otomatis & High-Res Export**:
  - Otomatis menghitung dan membagi teks panjang ke halaman 1, 2, 3, dst.
  - Export langsung ke gambar `PNG` bersih berkualitas tinggi tanpa perlu screenshot manual.

---

## 🚀 Panduan Menjalankan Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18 atau yang lebih baru
- npm, yarn, atau pnpm

### Langkah Instalasi
1. Clone repositori:
   ```bash
   git clone https://github.com/Delta-Polder-Indonesia/Bot-Nulis-Online.git
   cd Bot-Nulis-Online
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Jalankan development server:
   ```bash
   npm run dev
   ```

4. Buka di browser Anda pada alamat `http://localhost:5173`.

### Build untuk Produksi
```bash
npm run build
```
Hasil build akan tersimpan dalam folder `dist/` sebagai single-file HTML bundle yang siap dideploy ke static hosting apa pun.

---

## 🌐 Panduan Deploy ke GitHub Pages (Bebas Blank Putih)

Repositori ini sudah dilengkapi GitHub Actions Workflow (`.github/workflows/deploy.yml`):

1. **Push ke GitHub**: Commit dan push kode ke branch `main`.
2. Buka **Settings** repositori di GitHub.
3. Masuk ke menu **Pages** di sebelah kiri.
4. Di bagian **Build and deployment**, ubah **Source** menjadi **GitHub Actions**.
5. Workflow akan otomatis melakukan build dan deploy setiap kali ada commit baru di branch `main`.

---

## 📖 Panduan Syntax Penulisan

| Tipe Konten | Contoh Syntax | Keterangan |
|---|---|---|
| **Teks Biasa** | `Hari ini kita belajar aljabar.` | Otomatis diubah ke gaya font tulisan tangan |
| **Pecahan** | `$$\frac{3}{4}$$` | Menghasilkan pecahan vertikal rapi |
| **Akar Kuadrat** | `$$\sqrt{16} = 4$$` | Simbol akar matematika |
| **Pangkat / Kuadrat** | `$$x^2 + y^2 = r^2$$` | Superscript matematika |
| **Subskrip** | `$$x_1, x_2, v_0$$` | Subscript indeks variabel |
| **Integral** | `$$\int_{a}^{b} f(x) dx$$` | Integral tentu dan tak tentu |
| **Limit** | `$$\lim_{x \to 0} \frac{\sin x}{x}$$` | Notasi limit fungsi |
| **Sigma / Jumlah** | `$$\sum_{i=1}^{n} i$$` | Notasi jumlahan |
| **Lingkaran** | `[shape:circle]` | Ilustrasi lingkaran tulisan tangan |
| **Persegi / Kotak** | `[shape:square]` | Ilustrasi kotak tulisan tangan |
| **Segitiga** | `[shape:triangle]` | Ilustrasi segitiga tulisan tangan |
| **Bintang** | `[shape:star]` | Ilustrasi bintang tulisan tangan |

---

## 🛠️ Audit & Kualitas Kode

- **TypeScript Strict Mode**: Bebas type error (`tsc --noEmit` lulus 100%).
- **Deterministic Rendering**: Menggunakan Seeded Random hashing untuk mencegah layout jitter atau re-render loop.
- **Async KaTeX Auto-Retry**: Menjamin rumus matematika tetap dirender sempurna bahkan saat koneksi CDN lambat.
- **Full Responsive**: Desain split-screen desktop & mobile friendly.
- **Zero Vulnerabilities**: Dependensi diaudit dan bersih dari celah keamanan.

---

## 📄 Lisensi
Didistribusikan di bawah lisensi MIT. Silakan gunakan dan kembangkan secara bebas!
