// ============================================================
// Dashboard: tabel data siswa dengan tambah, hapus, dan cari.
// Data disimpan di localStorage browser Anda, jadi tetap ada
// saat halaman ditutup, tetapi hanya di browser dan komputer ini.
// ============================================================

const KUNCI_DATA = "dataSiswa";
const NILAI_LULUS = 95;

// Data contoh yang muncul pertama kali
const DATA_AWAL = [
  { id: 1, nama: "Budi Santoso",  kelas: "X-A",  nilai: 85 },
  { id: 2, nama: "Siti Aminah",   kelas: "X-A",  nilai: 92 },
  { id: 3, nama: "Andi Pratama",  kelas: "X-B",  nilai: 70 },
  { id: 4, nama: "Rina Wulandari", kelas: "XI-A", nilai: 78 },
  { id: 5, nama: "Dewi Lestari",  kelas: "XI-B", nilai: 64 }
];

// ---------- Simpan dan muat data ----------
function muatData() {
  try {
    const mentah = localStorage.getItem(KUNCI_DATA);
    if (mentah) {
      const data = JSON.parse(mentah);
      if (Array.isArray(data)) return data;
    }
  } catch (e) { /* abaikan, pakai data awal */ }
  return DATA_AWAL.slice();
}

function simpanData() {
  try {
    localStorage.setItem(KUNCI_DATA, JSON.stringify(dataSiswa));
  } catch (e) { /* penyimpanan tidak tersedia */ }
}

let dataSiswa = muatData();

// ---------- Elemen halaman ----------
const isiTabel  = document.getElementById("isiTabel");
const kosong    = document.getElementById("kosong");
const kolomCari = document.getElementById("cari");
const formSiswa = document.getElementById("formSiswa");
const pesanForm = document.getElementById("pesanForm");

// ---------- Tampilkan tabel ----------
function buatSel(teks, kelasCss) {
  const td = document.createElement("td");
  td.textContent = teks;          // textContent aman dari kode berbahaya
  if (kelasCss) td.className = kelasCss;
  return td;
}

function tampilkanTabel() {
  const kata = kolomCari.value.trim().toLowerCase();

  const tersaring = dataSiswa.filter(function (s) {
    return s.nama.toLowerCase().includes(kata) || s.kelas.toLowerCase().includes(kata);
  });

  isiTabel.textContent = "";      // kosongkan isi lama

  tersaring.forEach(function (siswa, i) {
    const tr = document.createElement("tr");
    tr.appendChild(buatSel(i + 1, "angka-sel"));
    tr.appendChild(buatSel(siswa.nama));
    tr.appendChild(buatSel(siswa.kelas));
    tr.appendChild(buatSel(siswa.nilai, "angka-sel"));

    // Status
    const tdStatus = document.createElement("td");
    const lencana = document.createElement("span");
    const lulus = siswa.nilai >= NILAI_LULUS;
    lencana.className = "lencana " + (lulus ? "lulus" : "remedial");
    lencana.textContent = lulus ? "Lulus" : "Remedial";
    tdStatus.appendChild(lencana);
    tr.appendChild(tdStatus);

    // Tombol hapus
    const tdAksi = document.createElement("td");
    const tombol = document.createElement("button");
    tombol.type = "button";
    tombol.className = "hapus";
    tombol.textContent = "Hapus";
    tombol.setAttribute("aria-label", "Hapus " + siswa.nama);
    tombol.addEventListener("click", function () {
      hapusSiswa(siswa.id, siswa.nama);
    });
    tdAksi.appendChild(tombol);
    tr.appendChild(tdAksi);

    isiTabel.appendChild(tr);
  });

  kosong.hidden = tersaring.length > 0;
  perbaruiRingkasan();
}

// ---------- Ringkasan (kotak angka di atas) ----------
function perbaruiRingkasan() {
  const total = dataSiswa.length;
  const jumlahNilai = dataSiswa.reduce(function (a, s) { return a + s.nilai; }, 0);
  const rata = total ? (jumlahNilai / total).toFixed(1) : "0";
  const lulus = dataSiswa.filter(function (s) { return s.nilai >= NILAI_LULUS; }).length;

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statRata").textContent = rata;
  document.getElementById("statLulus").textContent = lulus;
}

// ---------- Hapus data ----------
function hapusSiswa(id, nama) {
  if (!confirm("Hapus data " + nama + "?")) return;
  dataSiswa = dataSiswa.filter(function (s) { return s.id !== id; });
  simpanData();
  tampilkanTabel();
}

// ---------- Tambah data ----------
function tampilkanGalat(teks) {
  pesanForm.textContent = teks;
  pesanForm.hidden = false;
}

formSiswa.addEventListener("submit", function (event) {
  event.preventDefault();
  pesanForm.hidden = true;

  const nama  = document.getElementById("nama").value.trim();
  const kelas = document.getElementById("kelas").value.trim();
  const nilai = Number(document.getElementById("nilai").value);
  const nilaiKosong = document.getElementById("nilai").value.trim() === "";

  if (nama === "" || kelas === "") {
    tampilkanGalat("Nama dan kelas wajib diisi.");
    return;
  }
  if (nilaiKosong || !Number.isFinite(nilai) || nilai < 0 || nilai > 100) {
    tampilkanGalat("Nilai harus berupa angka 0 sampai 100.");
    return;
  }

  dataSiswa.push({ id: Date.now(), nama: nama, kelas: kelas, nilai: Math.round(nilai) });
  simpanData();
  formSiswa.reset();
  document.getElementById("nama").focus();
  tampilkanTabel();
});

// ---------- Cari ----------
kolomCari.addEventListener("input", tampilkanTabel);

// Tampilkan pertama kali
tampilkanTabel();