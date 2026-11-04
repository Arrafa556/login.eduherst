// ============================================================
// Latihan login dengan JavaScript
// PENTING: ini hanya untuk BELAJAR. Semua kode JavaScript bisa
// dibaca siapa saja lewat browser, jadi password di bawah tidak
// rahasia. Untuk aplikasi sungguhan, pengecekan harus di server
// (PHP + MySQL).
// ============================================================

// Daftar akun contoh. Tambahkan akun lain dengan menambah baris baru.
const AKUN = [
  { username: "arrafa", password: "coding123" },
  { username: "budi",  password: "budi12345" }
];

// Nama kunci untuk menyimpan status login di browser
const KUNCI = "userLogin";

// Menyimpan status login hanya selama tab browser terbuka
function simpanLogin(username) {
  sessionStorage.setItem(KUNCI, username);
}
function ambilLogin() {
  return sessionStorage.getItem(KUNCI);
}
function hapusLogin() {
  sessionStorage.removeItem(KUNCI);
}

// ---------- Halaman login (index.html) ----------
const formLogin = document.getElementById("formLogin");

if (formLogin) {
  const kolomUsername = document.getElementById("username");
  const kolomPassword = document.getElementById("password");
  const pesan = document.getElementById("pesan");
  const tombolLihat = document.getElementById("tombolLihat");

  // Kalau sudah login, langsung ke dashboard
  if (ambilLogin()) {
    window.location.href = "dashboard.html";
  }

  function tampilkanGalat(teks) {
    pesan.textContent = teks;
    pesan.hidden = false;
  }

  // Tombol "Lihat" untuk menampilkan atau menyembunyikan password
  tombolLihat.addEventListener("click", function () {
    const tersembunyi = kolomPassword.type === "password";
    kolomPassword.type = tersembunyi ? "text" : "password";
    tombolLihat.textContent = tersembunyi ? "Sembunyikan" : "Lihat";
    tombolLihat.setAttribute("aria-pressed", String(tersembunyi));
  });

  // Saat form dikirim
  formLogin.addEventListener("submit", function (event) {
    event.preventDefault(); // cegah halaman memuat ulang
    pesan.hidden = true;

    const username = kolomUsername.value.trim();
    const password = kolomPassword.value;

    if (username === "" || password === "") {
      tampilkanGalat("Isi username dan password.");
      return;
    }

    // Cari akun yang cocok
    const cocok = AKUN.find(function (akun) {
      return akun.username === username && akun.password === password;
    });

    if (cocok) {
      simpanLogin(cocok.username);
      window.location.href = "dashboard.html";
    } else {
      tampilkanGalat("Username atau password salah.");
      kolomPassword.value = "";
      kolomPassword.focus();
    }
  });
}

// ---------- Halaman dashboard (dashboard.html) ----------
const salam = document.getElementById("salam");

if (salam) {
  const pengguna = ambilLogin();

  // Kalau belum login, kembalikan ke halaman login
  if (!pengguna) {
    window.location.href = "index.html";
  } else {
    salam.textContent = "Halo, " + pengguna;
  }

  document.getElementById("tombolKeluar").addEventListener("click", function () {
    hapusLogin();
    window.location.href = "index.html";
  });
}