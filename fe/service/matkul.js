
async function fetchMataPelajaran() {
    const response = await fetch('http://localhost:8080/api/mata-pelajaran');
    const data = await response.json();
    return data;
}

async function renderMataPelajaran() {
    const mataPelajaranList = await fetchMataPelajaran();
    const tbody = document.querySelector('#tabelMataPelajaran tbody');

    tbody.innerHTML = ''; // Bersihkan isi tbody sebelumnya

    mataPelajaranList.forEach(mataPelajaran => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${mataPelajaran.id}</td>
            <td>${mataPelajaran.kodeMapel}</td>
            <td>${mataPelajaran.namaMapel}</td>
            <td>${mataPelajaran.tingkat}</td>
            <td>
                <button onclick="fillFormEdit(${mataPelajaran.id})">Edit</button>
                <button onclick="confirmDelete(${mataPelajaran.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function fillFormEdit(id) {
    const mataPelajaran = await getMataPelajaranById(id);

    document.getElementById('idMapel').value = mataPelajaran.id;
    document.getElementById('editKodeMapel').value = mataPelajaran.kodeMapel;
    document.getElementById('editNamaMapel').value = mataPelajaran.namaMapel;
    document.getElementById('editTingkat').value = mataPelajaran.tingkat;

    // Tampilkan form edit dan sembunyikan tabel
    document.getElementById('formEditMapel').style.display = 'block';
    document.getElementById('tabelMataPelajaran').style.display = 'none';
}

async function cancelEdit() {
    // Reset form edit dan tampilkan kembali tabel
    document.getElementById('formEditMapel').reset();
    document.getElementById('formEditMapel').style.display = 'none';
    document.getElementById('tabelMataPelajaran').style.display = 'block';
}

async function editMataPelajaran(event) {
    event.preventDefault();

    const id = document.getElementById('idMapel').value;
    const kodeMapel = document.getElementById('editKodeMapel').value;
    const namaMapel = document.getElementById('editNamaMapel').value;
    const tingkat = document.getElementById('editTingkat').value;

    const data = {
        id: parseInt(id),
        kodeMapel: kodeMapel,
        namaMapel: namaMapel,
        tingkat: tingkat
    };

    const response = await fetch(`http://localhost:8080/api/mata-pelajaran/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert('Data mata pelajaran berhasil diperbarui!');
        // Kosongkan form dan tampilkan kembali tabel setelah berhasil
        document.getElementById('formEditMapel').reset();
        document.getElementById('formEditMapel').style.display = 'none';
        document.getElementById('tabelMataPelajaran').style.display = 'block';

        // Refresh tabel setelah update
        renderMataPelajaran();
    } else {
        alert('Gagal memperbarui data mata pelajaran.');
    }
}

async function confirmDelete(id) {
    if (confirm('Anda yakin ingin menghapus data mata pelajaran ini?')) {
        const response = await fetch(`http://localhost:8080/api/mata-pelajaran/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Data mata pelajaran berhasil dihapus!');
            // Refresh tabel setelah hapus
            renderMataPelajaran();
        } else {
            alert('Gagal menghapus data mata pelajaran.');
        }
    }
}

// Fungsi untuk mendapatkan data mata pelajaran berdasarkan ID
async function getMataPelajaranById(id) {
    const response = await fetch(`http://localhost:8080/api/mata-pelajaran/${id}`);
    const data = await response.json();
    return data;
}

// Event listener untuk form edit mata pelajaran
document.getElementById('formEditMapel').addEventListener('submit', editMataPelajaran);

// Event listener untuk form tambah mata pelajaran
document.getElementById('formTambahMapel').addEventListener('submit', async function(event) {
    event.preventDefault();

    const kodeMapel = document.getElementById('kodeMapel').value;
    const namaMapel = document.getElementById('namaMapel').value;
    const tingkat = document.getElementById('tingkat').value;

    const data = {
        kodeMapel: kodeMapel,
        namaMapel: namaMapel,
        tingkat: tingkat
    };

    const response = await fetch('http://localhost:8080/api/mata-pelajaran', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert('Data mata pelajaran berhasil disimpan!');
        // Clear form fields after successful submission
        document.getElementById('formTambahMapel').reset();

        // Refresh tabel setelah tambah data
        renderMataPelajaran();
    } else {
        alert('Gagal menyimpan data mata pelajaran.');
    }
});

// Panggil fungsi renderMataPelajaran untuk memuat data saat halaman dimuat
renderMataPelajaran();