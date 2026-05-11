// ==================== STORAGE KEYS ====================
const STORAGE_KEYS = {
    PESANAN_AKTIF: 'risyah_pesanan_aktif',
    RIWAYAT_PESANAN: 'risyah_riwayat',
    NEXT_ID: 'risyah_next_id',
    BAHAN: 'risyah_bahan',
    KARYAWAN: 'risyah_karyawan',
    SUPPLIER: 'risyah_supplier'
};

// ========== FUNGSI UNTUK MENYIMPAN DAN MEMUAT DATA ==========
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key, defaultValue) {
    const saved = localStorage.getItem(key);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Error parsing localStorage key:', key, e);
            return defaultValue;
        }
    }
    return defaultValue;
}

// ========== DATA MOCK DENGAN LOCALSTORAGE ==========
let pesananAktif = loadFromLocalStorage(STORAGE_KEYS.PESANAN_AKTIF, []);
let riwayatPesanan = loadFromLocalStorage(STORAGE_KEYS.RIWAYAT_PESANAN, []);
let nextId = loadFromLocalStorage(STORAGE_KEYS.NEXT_ID, 1);

let bahanData = loadFromLocalStorage(STORAGE_KEYS.BAHAN, [
    { idBahan: "B001", namaBahan: "Selada", stok: 50, satuan: "lembar", harga: 2000 },
    { idBahan: "B002", namaBahan: "Tomat", stok: 30, satuan: "buah", harga: 3000 },
    { idBahan: "B003", namaBahan: "Mayonaise", stok: 15, satuan: "sachet", harga: 5000 },
    { idBahan: "B004", namaBahan: "Timun", stok: 25, satuan: "buah", harga: 2500 },
    { idBahan: "B005", namaBahan: "Wortel", stok: 40, satuan: "buah", harga: 3000 }
]);

let karyawanData = loadFromLocalStorage(STORAGE_KEYS.KARYAWAN, [
    { idKaryawan: "K001", namaKaryawan: "Ahmad Barista", jabatan: "Kasir", noTelepon: "085678901234" },
    { idKaryawan: "K002", namaKaryawan: "Siti Salad", jabatan: "Pelayan", noTelepon: "085678901235" }
]);

let supplierData = loadFromLocalStorage(STORAGE_KEYS.SUPPLIER, [
    { idSupplier: "S001", namaSupplier: "PT Sayur Segar", noTelepon: "0274123456", alamat: "Jl. Pertanian No.10" },
    { idSupplier: "S002", namaSupplier: "CV Bumbu Rasa", noTelepon: "0274987654", alamat: "Jl. Pasar Baru No.22" }
]);

function saveAllData() {
    saveToLocalStorage(STORAGE_KEYS.PESANAN_AKTIF, pesananAktif);
    saveToLocalStorage(STORAGE_KEYS.RIWAYAT_PESANAN, riwayatPesanan);
    saveToLocalStorage(STORAGE_KEYS.NEXT_ID, nextId);
    saveToLocalStorage(STORAGE_KEYS.BAHAN, bahanData);
    saveToLocalStorage(STORAGE_KEYS.KARYAWAN, karyawanData);
    saveToLocalStorage(STORAGE_KEYS.SUPPLIER, supplierData);
}

// ========== CUSTOM ALERT ==========
function showAlert(message, type = "success", title = "") {
    return new Promise((resolve) => {
        const titles = {
            success: "✅ Berhasil!",
            error: "❌ Gagal!",
            warning: "⚠️ Peringatan!",
            info: "ℹ️ Informasi"
        };
        
        const icons = {
            success: "fas fa-check-circle",
            error: "fas fa-times-circle",
            warning: "fas fa-exclamation-triangle",
            info: "fas fa-info-circle"
        };
        
        const overlay = document.createElement("div");
        overlay.className = "custom-alert-overlay";
        
        overlay.innerHTML = `
            <div class="custom-alert ${type}">
                <div class="custom-alert-header">
                    <i class="${icons[type]}"></i>
                    <h3>${title || titles[type]}</h3>
                </div>
                <div class="custom-alert-body">
                    ${message}
                </div>
                <div class="custom-alert-footer">
                    <button class="alert-ok-btn">OK</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        const okBtn = overlay.querySelector(".alert-ok-btn");
        okBtn.addEventListener("click", () => {
            overlay.remove();
            resolve();
        });
        
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                overlay.remove();
                resolve();
            }
        });
    });
}

// ========== LOADING OVERLAY (TANPA ICON) ==========
function showLoading(message = "Loading") {
    const overlay = document.createElement("div");
    overlay.className = "loading-overlay";
    overlay.id = "globalLoading";
    overlay.innerHTML = `
        <div class="loading-spinner-large"></div>
        <div class="loading-text">
            ${message}
            <div class="loading-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function hideLoading() {
    const overlay = document.getElementById("globalLoading");
    if (overlay) {
        overlay.style.opacity = "0";
        setTimeout(() => {
            if (overlay && overlay.parentNode) overlay.remove();
        }, 200);
    }
}

// ========== TAB LOADING EFFECT (DENGAN TUTUP MENU MOBILE) ==========
async function switchTabWithLoading(tabId) {
    // Tutup menu mobile (titik tiga) jika sedang terbuka
    const navMenu = document.getElementById("navMenu");
    if (navMenu && navMenu.classList.contains("show")) {
        navMenu.classList.remove("show");
    }
    
    showLoading("Loading");
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const tabs = document.querySelectorAll(".nav-link");
    const contents = document.querySelectorAll(".tab-content");
    
    tabs.forEach(t => t.classList.remove("active"));
    const activeTab = document.querySelector(`.nav-link[data-tab="${tabId}"]`);
    if (activeTab) activeTab.classList.add("active");
    
    contents.forEach(content => {
        content.classList.remove("active-tab");
    });
    
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
        targetContent.classList.add("active-tab");
    }
    
    if (tabId === "pesanan") renderPesananAktif();
    if (tabId === "bahan") renderBahan();
    if (tabId === "karyawan") renderKaryawan();
    if (tabId === "supplier") renderSupplier();
    if (tabId === "riwayat") renderRiwayat();
    if (tabId === "dashboard") {
        renderRecentOrders();
        updateStats();
    }
    
    attachDeleteEvents();
    
    setTimeout(() => {
        hideLoading();
    }, 200);
}

// ========== Helper Functions ==========
function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

function parseRupiahKeAngka(str) {
    if (!str) return 0;
    let bersih = str.toString().replace(/\./g, "");
    bersih = bersih.replace(/[^0-9]/g, "");
    if (bersih === "") return 0;
    return parseInt(bersih, 10);
}

function formatInputUang(event) {
    let input = event.target;
    let nilai = input.value;
    let angkaOnly = nilai.replace(/[^0-9]/g, "");
    
    if (angkaOnly === "") {
        input.value = "";
        hitungKembalian();
        return;
    }
    
    let angkaInt = parseInt(angkaOnly, 10);
    let formatted = angkaInt.toLocaleString("id-ID");
    input.value = formatted;
    setTimeout(() => hitungKembalian(), 10);
}

function updateStats() {
    const totalPendapatanHariIni = riwayatPesanan.reduce((sum, p) => sum + p.total, 0);
    const totalPesananElem = document.getElementById("totalPesanan");
    const totalBahanElem = document.getElementById("totalBahan");
    const totalKaryawanElem = document.getElementById("totalKaryawan");
    const totalPendapatanElem = document.getElementById("totalPendapatan");
    
    if (totalPendapatanElem) totalPendapatanElem.innerText = formatRupiah(totalPendapatanHariIni);
    if (totalPesananElem) totalPesananElem.innerText = riwayatPesanan.length + pesananAktif.length;
    if (totalBahanElem) totalBahanElem.innerText = bahanData.length;
    if (totalKaryawanElem) totalKaryawanElem.innerText = karyawanData.length;
}

function hitungTotal() {
    const harga = parseInt(document.getElementById("hargaPerPcs")?.value) || 0;
    const jumlah = parseInt(document.getElementById("jumlah")?.value) || 0;
    const total = harga * jumlah;
    const totalHargaElem = document.getElementById("totalHarga");
    if (totalHargaElem) totalHargaElem.value = formatRupiah(total);
    return total;
}

function hitungKembalian() {
    const harga = parseInt(document.getElementById("hargaPerPcs")?.value) || 0;
    const jumlah = parseInt(document.getElementById("jumlah")?.value) || 0;
    const total = harga * jumlah;
    const uangBayarInput = document.getElementById("uangBayar");
    let uangBayar = 0;
    
    if (uangBayarInput && uangBayarInput.value) {
        uangBayar = parseRupiahKeAngka(uangBayarInput.value);
    }
    
    const kembalian = uangBayar - total;
    const kembalianElem = document.getElementById("kembalian");
    
    if (kembalianElem) {
        if (uangBayarInput && (!uangBayarInput.value || uangBayarInput.value === "")) {
            kembalianElem.value = "";
        } else if (kembalian >= 0) {
            kembalianElem.value = formatRupiah(kembalian);
        } else {
            kembalianElem.value = "⚠️ Uang Kurang!";
        }
    }
    return kembalian;
}

function renderPesananAktif() {
    const tbody = document.querySelector("#pesananTable tbody");
    if (!tbody) return;
    
    if (pesananAktif.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">📋 Belum ada pesanan aktif</td></tr>`;
    } else {
        tbody.innerHTML = pesananAktif.map((p, idx) => `
            <tr>
                <td>${p.id}</td>
                <td>${p.namaMenu}</td>
                <td>${p.jumlah}</td>
                <td>${formatRupiah(p.hargaPerPcs)}</td>
                <td>${formatRupiah(p.total)}</td>
                <td><button class="btn-danger delete-pesanan" data-idx="${idx}"><i class="fas fa-trash"></i> Hapus</button></td>
            </tr>
        `).join('');
    }
    
    document.querySelectorAll(".delete-pesanan").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const idx = parseInt(btn.dataset.idx);
            const pesanan = pesananAktif[idx];
            
            const confirmed = await showAlert(`Hapus pesanan ${pesanan.id} (${pesanan.namaMenu})?`, "warning", "Konfirmasi Hapus");
            if (confirmed !== false) {
                pesananAktif.splice(idx, 1);
                saveAllData();
                renderPesananAktif();
                updateStats();
                showAlert("Pesanan berhasil dihapus!", "success", "Terhapus!");
            }
        });
    });
}

function renderBahan() {
    const tbody = document.querySelector("#bahanTable tbody");
    if (!tbody) return;
    
    if (bahanData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">📦 Belum ada bahan baku</td></tr>`;
        return;
    }
    
    tbody.innerHTML = bahanData.map(b => `
        <tr>
            <td>${b.idBahan}</td>
            <td>${b.namaBahan}</td>
            <td>${b.stok} ${b.satuan}</td>
            <td>${b.satuan}</td>
            <td>${formatRupiah(b.harga)}</td>
            <td><button class="btn-danger delete-item" data-type="bahan" data-id="${b.idBahan}"><i class="fas fa-trash"></i> Hapus</button></td>
        </tr>
    `).join('');
}

function renderRiwayat() {
    const tbody = document.querySelector("#riwayatTable tbody");
    if (!tbody) return;
    
    if (riwayatPesanan.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center;">📭 Belum ada riwayat transaksi</td></tr>`;
        return;
    }
    
    tbody.innerHTML = riwayatPesanan.slice().reverse().map((p, idx) => {
        const originalIdx = riwayatPesanan.length - 1 - idx;
        return `
            <tr>
                <td>${p.id}</td>
                <td>${p.namaMenu}</td>
                <td>${p.jumlah}</td>
                <td>${formatRupiah(p.total)}</td>
                <td>${formatRupiah(p.uangBayar)}</td>
                <td>${formatRupiah(p.kembalian)}</td>
                <td>${p.waktu}</td>
                <td><button class="btn-danger delete-riwayat" data-idx="${originalIdx}"><i class="fas fa-trash-alt"></i> Hapus</button></td>
            </tr>
        `;
    }).join('');
    
    document.querySelectorAll(".delete-riwayat").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const idx = parseInt(btn.dataset.idx);
            const pesanan = riwayatPesanan[idx];
            
            const confirmed = await showAlert(`Hapus riwayat transaksi ${pesanan.id} (${pesanan.namaMenu})?`, "warning", "Konfirmasi Hapus");
            if (confirmed !== false) {
                riwayatPesanan.splice(idx, 1);
                saveAllData();
                renderRiwayat();
                renderRecentOrders();
                updateStats();
                showAlert("Riwayat berhasil dihapus!", "success", "Terhapus!");
            }
        });
    });
}

function renderRecentOrders() {
    const tbody = document.querySelector("#recentOrdersTable tbody");
    if (!tbody) return;
    const recent = [...riwayatPesanan].slice(-5).reverse();
    if (recent.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Belum ada pesanan</td></tr>`;
        return;
    }
    tbody.innerHTML = recent.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.namaMenu}</td>
            <td>${p.jumlah}</td>
            <td>${formatRupiah(p.total)}</td>
            <td>${formatRupiah(p.kembalian)}</td>
            <td>${p.waktu}</td>
        </tr>
    `).join('');
}

async function hapusSemuaRiwayat() {
    if (riwayatPesanan.length === 0) {
        await showAlert("Tidak ada riwayat untuk dihapus!", "info", "Informasi");
        return;
    }
    
    const confirmed = await showAlert(`⚠️ PERINGATAN!\n\nAnda akan menghapus SEMUA riwayat transaksi (${riwayatPesanan.length} data).\n\nData yang dihapus TIDAK dapat dikembalikan!\n\nYakin ingin melanjutkan?`, "warning", "Hapus Semua Riwayat");
    
    if (confirmed !== false) {
        riwayatPesanan = [];
        saveAllData();
        renderRiwayat();
        renderRecentOrders();
        updateStats();
        await showAlert("✅ Semua riwayat berhasil dihapus!", "success", "Berhasil!");
    }
}

async function simpanPesanan() {
    const simpanBtn = document.getElementById("simpanPesananBtn");
    const originalText = simpanBtn.innerHTML;
    
    simpanBtn.disabled = true;
    simpanBtn.innerHTML = '<div class="button-spinner"></div> Menyimpan...';
    
    const namaMenu = document.getElementById("namaMenu")?.value;
    const hargaPerPcs = parseInt(document.getElementById("hargaPerPcs")?.value) || 0;
    const jumlah = parseInt(document.getElementById("jumlah")?.value) || 0;
    const uangBayarInput = document.getElementById("uangBayar")?.value;
    const uangBayar = parseRupiahKeAngka(uangBayarInput);
    const total = hargaPerPcs * jumlah;
    const kembalian = uangBayar - total;
    
    if (!namaMenu || !hargaPerPcs || !jumlah) {
        simpanBtn.disabled = false;
        simpanBtn.innerHTML = originalText;
        await showAlert("Mohon lengkapi data (Nama, Harga, Jumlah)!", "error", "Data Tidak Lengkap");
        return;
    }
    
    if (!uangBayarInput || uangBayarInput === "" || uangBayar === 0) {
        simpanBtn.disabled = false;
        simpanBtn.innerHTML = originalText;
        await showAlert("Masukkan uang pelanggan terlebih dahulu!", "error", "Uang Belum Diisi");
        return;
    }
    
    if (uangBayar < total) {
        simpanBtn.disabled = false;
        simpanBtn.innerHTML = originalText;
        await showAlert(`Uang kurang! Total: ${formatRupiah(total)}`, "error", "Uang Kurang");
        return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPesanan = {
        id: "PS" + String(nextId++).padStart(3, "0"),
        namaMenu: namaMenu,
        hargaPerPcs: hargaPerPcs,
        jumlah: jumlah,
        total: total,
        uangBayar: uangBayar,
        kembalian: kembalian,
        waktu: new Date().toLocaleString("id-ID")
    };
    
    pesananAktif.push(newPesanan);
    riwayatPesanan.push(newPesanan);
    saveAllData();
    
    document.getElementById("namaMenu").value = "Salad Buah";
    document.getElementById("hargaPerPcs").value = "17000";
    document.getElementById("jumlah").value = "1";
    document.getElementById("uangBayar").value = "";
    document.getElementById("totalHarga").value = "";
    document.getElementById("kembalian").value = "";
    
    renderPesananAktif();
    renderRiwayat();
    renderRecentOrders();
    updateStats();
    
    simpanBtn.disabled = false;
    simpanBtn.innerHTML = originalText;
    
    await showAlert(`✅ Pesanan ${newPesanan.id} berhasil!\n\nTotal: ${formatRupiah(total)}\nKembalian: ${formatRupiah(kembalian)}`, "success", "Pesanan Tersimpan!");
}

function renderKaryawan() {
    const tbody = document.querySelector("#karyawanTable tbody");
    if (!tbody) return;
    tbody.innerHTML = karyawanData.map(k => `
        <tr>
            <td>${k.idKaryawan}</td>
            <td>${k.namaKaryawan}</td>
            <td>${k.jabatan}</td>
            <td>${k.noTelepon}</td>
            <td><button class="btn-danger delete-item" data-type="karyawan" data-id="${k.idKaryawan}"><i class="fas fa-trash"></i> Hapus</button></td>
        </tr>
    `).join('');
}

function renderSupplier() {
    const tbody = document.querySelector("#supplierTable tbody");
    if (!tbody) return;
    tbody.innerHTML = supplierData.map(s => `
        <tr>
            <td>${s.idSupplier}</td>
            <td>${s.namaSupplier}</td>
            <td>${s.noTelepon}</td>
            <td>${s.alamat}</td>
            <td><button class="btn-danger delete-item" data-type="supplier" data-id="${s.idSupplier}"><i class="fas fa-trash"></i> Hapus</button></td>
        </tr>
    `).join('');
}

async function handleDelete(e) {
    const btn = e.currentTarget;
    const type = btn.dataset.type;
    const id = btn.dataset.id;
    
    const confirmed = await showAlert(`Hapus data ${type} dengan ID ${id}?`, "warning", "Konfirmasi Hapus");
    
    if (confirmed !== false) {
        if (type === "bahan") {
            const index = bahanData.findIndex(b => b.idBahan === id);
            if (index !== -1) bahanData.splice(index, 1);
            renderBahan();
            await showAlert("Bahan berhasil dihapus!", "success", "Terhapus!");
        } else if (type === "karyawan") {
            const index = karyawanData.findIndex(k => k.idKaryawan === id);
            if (index !== -1) karyawanData.splice(index, 1);
            renderKaryawan();
            await showAlert("Karyawan berhasil dihapus!", "success", "Terhapus!");
        } else if (type === "supplier") {
            const index = supplierData.findIndex(s => s.idSupplier === id);
            if (index !== -1) supplierData.splice(index, 1);
            renderSupplier();
            await showAlert("Supplier berhasil dihapus!", "success", "Terhapus!");
        }
        saveAllData();
        updateStats();
        attachDeleteEvents();
    }
}

function attachDeleteEvents() {
    document.querySelectorAll(".delete-item").forEach(btn => {
        btn.removeEventListener("click", handleDelete);
        btn.addEventListener("click", handleDelete);
    });
}

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModalBtn = document.querySelector(".close-modal");

function closeModalFunction() {
    modal.style.display = "none";
}

async function handleFormSubmit(e, form, type) {
    e.preventDefault();
    const formData = new FormData(form);
    
    if (type === "bahan") {
        const newId = "B" + String(bahanData.length + 101).slice(1);
        const hargaStr = formData.get("harga");
        const harga = parseRupiahKeAngka(hargaStr);
        bahanData.push({
            idBahan: newId,
            namaBahan: formData.get("namaBahan"),
            stok: parseInt(formData.get("stok")),
            satuan: formData.get("satuan"),
            harga: harga
        });
        renderBahan();
        await showAlert("✅ Bahan berhasil ditambahkan!", "success", "Berhasil!");
    } else if (type === "karyawan") {
        const newId = "K" + String(karyawanData.length + 101).slice(1);
        karyawanData.push({
            idKaryawan: newId,
            namaKaryawan: formData.get("namaKaryawan"),
            jabatan: formData.get("jabatan"),
            noTelepon: formData.get("noTelepon")
        });
        renderKaryawan();
        await showAlert("✅ Karyawan berhasil ditambahkan!", "success", "Berhasil!");
    } else if (type === "supplier") {
        const newId = "S" + String(supplierData.length + 101).slice(1);
        supplierData.push({
            idSupplier: newId,
            namaSupplier: formData.get("namaSupplier"),
            noTelepon: formData.get("noTelepon"),
            alamat: formData.get("alamat")
        });
        renderSupplier();
        await showAlert("✅ Supplier berhasil ditambahkan!", "success", "Berhasil!");
    }
    
    saveAllData();
    updateStats();
    attachDeleteEvents();
    closeModalFunction();
}

function openModal(contentHTML) {
    modalBody.innerHTML = contentHTML;
    modal.style.display = "flex";
    const form = modalBody.querySelector("form");
    if (form) {
        const type = form.dataset.type;
        form.addEventListener("submit", (e) => handleFormSubmit(e, form, type));
        
        const hargaInput = form.querySelector("#inputHargaBahan");
        if (hargaInput && type === "bahan") {
            hargaInput.addEventListener("input", function(e) {
                let nilai = this.value.replace(/\./g, "");
                nilai = nilai.replace(/[^0-9]/g, "");
                if (nilai === "") nilai = "0";
                this.value = parseInt(nilai).toLocaleString("id-ID");
            });
        }
    }
}

function getFormBahan() {
    return `<h3><i class="fas fa-box"></i> Tambah Bahan Baku</h3>
    <form data-type="bahan">
        <label>Nama Bahan</label>
        <input type="text" name="namaBahan" required placeholder="Contoh: Selada">
        <label>Stok</label>
        <input type="number" name="stok" required min="0">
        <label>Satuan</label>
        <input type="text" name="satuan" required placeholder="kg, liter, butir, lembar">
        <label>Harga per Satuan (Rp)</label>
        <input type="text" name="harga" required placeholder="Contoh: 5000" id="inputHargaBahan">
        <button type="submit" class="btn-primary">Simpan Bahan</button>
    </form>`;
}

function getFormKaryawan() {
    return `<h3><i class="fas fa-user-plus"></i> Tambah Karyawan</h3>
    <form data-type="karyawan">
        <label>Nama Karyawan</label>
        <input type="text" name="namaKaryawan" required>
        <label>Jabatan</label>
        <input type="text" name="jabatan" required>
        <label>No Telepon</label>
        <input type="text" name="noTelepon" required>
        <button type="submit" class="btn-primary">Simpan Karyawan</button>
    </form>`;
}

function getFormSupplier() {
    return `<h3><i class="fas fa-truck"></i> Tambah Supplier</h3>
    <form data-type="supplier">
        <label>Nama Supplier</label>
        <input type="text" name="namaSupplier" required>
        <label>No Telepon</label>
        <input type="text" name="noTelepon" required>
        <label>Alamat</label>
        <textarea name="alamat" required rows="3"></textarea>
        <button type="submit" class="btn-primary">Simpan Supplier</button>
    </form>`;
}

function initTabs() {
    const tabs = document.querySelectorAll(".nav-link");
    const navMenu = document.getElementById("navMenu");
    const navToggle = document.getElementById("navToggle");
    
    tabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
            e.preventDefault();
            const tabId = tab.dataset.tab;
            switchTabWithLoading(tabId);
        });
    });
    
    // Event untuk toggle menu (titik tiga)
    if (navToggle) {
        navToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            navMenu.classList.toggle("show");
        });
    }
    
    // Tutup menu jika klik di luar (opsional, biar lebih nyaman)
    document.addEventListener("click", (e) => {
        if (navMenu && navMenu.classList.contains("show")) {
            if (navToggle && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove("show");
            }
        }
    });
}

// ========== EVENT LISTENERS ==========
document.getElementById("hargaPerPcs")?.addEventListener("input", () => {
    hitungTotal();
    hitungKembalian();
});
document.getElementById("jumlah")?.addEventListener("input", () => {
    hitungTotal();
    hitungKembalian();
});
document.getElementById("uangBayar")?.addEventListener("input", formatInputUang);
document.getElementById("uangBayar")?.addEventListener("blur", () => hitungKembalian());
document.getElementById("simpanPesananBtn")?.addEventListener("click", simpanPesanan);

["namaMenu", "hargaPerPcs", "jumlah", "uangBayar"].forEach(id => {
    const input = document.getElementById(id);
    input?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            simpanPesanan();
        }
    });
});

document.getElementById("tambahBahanBtn")?.addEventListener("click", () => openModal(getFormBahan()));
document.getElementById("tambahKaryawanBtn")?.addEventListener("click", () => openModal(getFormKaryawan()));
document.getElementById("tambahSupplierBtn")?.addEventListener("click", () => openModal(getFormSupplier()));

function tambahTombolHapusRiwayat() {
    const sectionHeader = document.querySelector("#riwayat .section-header");
    if (sectionHeader && !document.getElementById("hapusSemuaRiwayatBtn")) {
        const btnHapusSemua = document.createElement("button");
        btnHapusSemua.id = "hapusSemuaRiwayatBtn";
        btnHapusSemua.className = "btn-primary";
        btnHapusSemua.style.background = "linear-gradient(95deg, #e53935, #d32f2f)";
        btnHapusSemua.innerHTML = '<i class="fas fa-trash-alt"></i> Hapus Semua Riwayat';
        btnHapusSemua.addEventListener("click", hapusSemuaRiwayat);
        sectionHeader.appendChild(btnHapusSemua);
    }
}

document.getElementById("navToggle")?.addEventListener("click", () => {
    document.getElementById("navMenu")?.classList.toggle("show");
});

closeModalBtn?.addEventListener("click", closeModalFunction);
window.addEventListener("click", (e) => { if (e.target === modal) closeModalFunction(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.style.display === "flex") closeModalFunction(); });

// ========== INITIAL RENDER ==========
function initRender() {
    hitungTotal();
    renderPesananAktif();
    renderBahan();
    renderKaryawan();
    renderSupplier();
    renderRiwayat();
    renderRecentOrders();
    updateStats();
    attachDeleteEvents();
    tambahTombolHapusRiwayat();
}

initRender();
initTabs();