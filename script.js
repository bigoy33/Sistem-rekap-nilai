// Array untuk menyimpan data siswa
let dataSiswa = [];
let currentEditIndex = -1; // Menyimpan index data yang sedang diedit

// Fungsi untuk menambah data siswa
function tambahData() {
    let idSiswa = prompt("Masukkan ID Siswa:");
    let namaSiswa = prompt("Masukkan Nama Siswa:");
    
    let mataPelajaranList = [];
    let jumlahPelajaran = parseInt(prompt("Berapa jumlah mata pelajaran?"));
    
    for (let i = 0; i < jumlahPelajaran; i++) {
        let mataPelajaran = prompt(`Masukkan nama Mata Pelajaran ${i+1}:`);
        let nilai = prompt(`Masukkan Nilai untuk ${mataPelajaran}:`);
        mataPelajaranList.push({ mataPelajaran: mataPelajaran, nilai: nilai });
    }

    let status = prompt("Masukkan Status Kehadiran (Sakit/Izin/Tanpa Keterangan):");

    // Menambahkan data baru ke dalam array dataSiswa
    let siswaBaru = {
        id: idSiswa,
        nama: namaSiswa,
        mataPelajaran: mataPelajaranList,
        status: status
    };

    dataSiswa.push(siswaBaru);
    tampilkanData();
}

// Fungsi untuk menampilkan data siswa ke dalam tabel
function tampilkanData() {
    const tbody = document.getElementById("data-siswa");
    tbody.innerHTML = ""; // Menghapus data lama

    dataSiswa.forEach((siswa, index) => {
        let tr = document.createElement("tr");

        let mataPelajaranList = siswa.mataPelajaran.map(mp => mp.mataPelajaran).join(", ");
        let nilaiList = siswa.mataPelajaran.map(mp => mp.nilai).join(", ");

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${siswa.id}</td>
            <td>${siswa.nama}</td>
            <td>${mataPelajaranList}</td>
            <td>${nilaiList}</td>
            <td>${siswa.status}</td>
            <td>
                <button onclick="editData(${index})">Edit</button>
                <button onclick="hapusData(${index})">Hapus</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// Fungsi untuk menghapus data siswa berdasarkan index
function hapusData(index) {
    dataSiswa.splice(index, 1); // Menghapus data berdasarkan index
    tampilkanData(); // Menampilkan ulang data yang tersisa
}

// Fungsi untuk membuka modal edit
function editData(index) {
    currentEditIndex = index;
    let siswa = dataSiswa[index];

    // Isi form dengan data siswa yang akan diedit
    document.getElementById("editId").value = siswa.id;
    document.getElementById("editNama").value = siswa.nama;
    document.getElementById("editMataPelajaran").value = siswa.mataPelajaran.map(mp => mp.mataPelajaran).join(", ");
    document.getElementById("editNilai").value = siswa.mataPelajaran.map(mp => mp.nilai).join(", ");
    document.getElementById("editStatus").value = siswa.status;

    // Tampilkan modal
    document.getElementById("editModal").style.display = "block";
}

// Fungsi untuk menutup modal edit
function tutupModal() {
    document.getElementById("editModal").style.display = "none";
}

// Fungsi untuk menyimpan data edit
function simpanEdit() {
    let idSiswa = document.getElementById("editId").value;
    let namaSiswa = document.getElementById("editNama").value;
    let mataPelajaran = document.getElementById("editMataPelajaran").value.split(",");
    let nilai = document.getElementById("editNilai").value.split(",");
    let status = document.getElementById("editStatus").value;

    // Memperbarui data siswa
    dataSiswa[currentEditIndex] = {
        id: idSiswa,
        nama: namaSiswa,
        mataPelajaran: mataPelajaran.map((mp, index) => ({ mataPelajaran: mp.trim(), nilai: nilai[index].trim() })),
        status: status
    };

    // Menampilkan data yang telah diperbarui
    tampilkanData();

    // Menutup modal
    tutupModal();
}

// Fungsi untuk mengekspor data siswa ke file CSV
function eksporCSV() {
    let csvContent = "No,ID Siswa,Nama Siswa,Mata Pelajaran,Nilai,Status Kehadiran\n";

    dataSiswa.forEach((siswa, index) => {
        let mataPelajaranList = siswa.mataPelajaran.map(mp => mp.mataPelajaran).join(", ");
        let nilaiList = siswa.mataPelajaran.map(mp => mp.nilai).join(", ");
        
        csvContent += `${index + 1},${siswa.id},${siswa.nama},${mataPelajaranList},${nilaiList},${siswa.status}\n`;
    });

    let blob = new Blob([csvContent], { type: 'text/csv' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = "data_siswa.csv";
    a.click();
}

// Fungsi untuk mengimpor data dari file CSV
function imporCSV(event) {
    let file = event.target.files[0];
    if (!file) {
        alert("Pilih file CSV terlebih dahulu.");
        return;
    }

    let reader = new FileReader();
    reader.onload = function(e) {
        let content = e.target.result;
        let lines = content.split("\n");

        // Menghapus header
        lines.shift();

        // Mengimpor data siswa
        dataSiswa = lines.map(line => {
            let columns = line.split(",");
            let mataPelajaranList = columns[3].split(";");
            let nilaiList = columns[4].split(";");

            let mataPelajaran = mataPelajaranList.map((mp, index) => ({
                mataPelajaran: mp,
                nilai: nilaiList[index]
            }));

            return {
                id: columns[1],
                nama: columns[2],
                mataPelajaran: mataPelajaran,
                status: columns[5]
            };
        });

        tampilkanData();
    };

    reader.readAsText(file);
}

// Menampilkan data siswa pertama kali ketika halaman dimuat
window.onload = tampilkanData;
