// services/dataKaryawanService.js
import { db } from '@/lib/firebaseConfig';
import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';

// Ambil semua data karyawan
export const getAllKaryawan = async () => {
  const querySnapshot = await getDocs(collection(db, 'dataKaryawan'));
  const data = [];
  querySnapshot.forEach(docSnap => {
    data.push({ id: docSnap.id, ...docSnap.data() });
  });
  return data;
};

// Tambah / Update data karyawan
export const saveKaryawan = async (nik, data) => {
  const docRef = doc(db, 'dataKaryawan', nik);
  await setDoc(docRef, data, { merge: true });
};

// Hapus data karyawan
export const deleteKaryawan = async (nik) => {
  await deleteDoc(doc(db, 'dataKaryawan', nik));
};

// Bulk upload dari Excel
export const bulkUploadKaryawan = async (file) => {
  // daftar header persis seperti yang ada di sheet (urut)
  const expectedHeaders = [
    'NIK',
    'NO JKN Peserta',
    'NPP',
    'Nama',
    'Kota Lahir',
    'Tanggal Lahir',
    'Status Pernikahan',
    'Alamat KTP',
    'Alamat Domisili',
    'No HP',
    'Nama Kontak Darurat',
    'Nomor Kontak Darurat',
    'Nama Bank',
    'Nomor Rekening',
    'Ukuran Baju',
    'Ukuran Celana',
    'Ukuran Sepatu',
    'Kategori Tenaga Kerja',
    'Jabatan',
    'Penempatan',
    'Basic Salary',
    'Tunjangan Makan',
    'Tunjangan Transport',
    'Tunjangan Jabatan',
    'Libur Nasional',
    'Rit Dalam Kota',
    'Rit Luar Kota',
    'TMT',
    'Status Kerja',
    'Status',
    'Tanggal Non Aktif',
    'BPJS Kesehatan',
    'BPJS Naker',
    'Keterangan',
    'Foto'
  ];

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // cari sheet Data_Karyawan case-insensitive
        const sheetName = workbook.SheetNames.find(name => name.toLowerCase().replace(/\s+/g,'_') === 'data_karyawan' || name.toLowerCase() === 'data_karyawan' || name.toLowerCase().includes('data') && name.toLowerCase().includes('karyawan'));
        if (!sheetName) return reject('Sheet "Data_Karyawan" tidak ditemukan');
        const sheet = workbook.Sheets[sheetName];

        // baca seluruh sheet sebagai array of arrays
        const allRows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });

        if (!allRows || allRows.length === 0) return reject('Sheet kosong');

        // Temukan indeks baris header: cari baris yang mengandung 'NIK' (kasus-insensitif)
        let headerRowIndex = allRows.findIndex(row => Array.isArray(row) && row.some(cell => typeof cell === 'string' && cell.trim().toLowerCase() === 'nik'));
        if (headerRowIndex === -1) {
          // fallback ke baris ke-1 (index 1) jika memang sudah pasti baris 2
          headerRowIndex = 1;
        }

        const headerRow = allRows[headerRowIndex] || [];

        // buat mapping columnIndex => headerName berdasarkan expectedHeaders
        // kita cari posisi header tiap expectedHeader di headerRow (case-insensitive trim)
        const colIndexByHeader = {};
        expectedHeaders.forEach(expected => {
          const idx = headerRow.findIndex(cell => {
            if (cell === undefined || cell === null) return false;
            return cell.toString().trim().toLowerCase() === expected.toLowerCase();
          });
          colIndexByHeader[expected] = idx >= 0 ? idx : -1; // -1 menandakan kolom tidak ditemukan
        });

        // debugging (opsional) - bisa dikomentari setelah berhasil
        console.log('found headerRowIndex:', headerRowIndex);
        console.log('colIndexByHeader:', colIndexByHeader);

        // data rows mulai dari next row
        const dataRows = allRows.slice(headerRowIndex + 1);

        if (dataRows.length === 0) return reject('Data karyawan kosong (tidak ada baris data setelah header)');

        let counterKosong = 1;
        const tasks = [];
        let inserted = 0;

        for (const row of dataRows) {
          // cek apakah row kosong secara keseluruhan
          const isEmpty = expectedHeaders.every(h => {
            const ci = colIndexByHeader[h];
            const val = ci >= 0 ? (row[ci] ?? '') : '';
            return val === '' || val === null || val === undefined;
          });
          if (isEmpty) continue;

          // bangun object sesuai header yang diharapkan
          const karyawanData = {};
          expectedHeaders.forEach(headerName => {
            const ci = colIndexByHeader[headerName];
            const rawVal = ci >= 0 ? (row[ci] ?? '') : '';
            // biarkan tipe apa adanya (string/number); trim string
            karyawanData[headerName] = (typeof rawVal === 'string') ? rawVal.trim() : rawVal;
          });

          const nikValue = (karyawanData['NIK'] ?? '').toString().trim();
          const docId = nikValue !== '' ? nikValue : `kosong-${counterKosong++}`;

          // push task
          tasks.push(
            setDoc(doc(db, 'dataKaryawan', docId), karyawanData, { merge: true })
              .then(() => { inserted += 1; })
          );
        }

        // jalankan semua sekaligus
        await Promise.all(tasks);

        resolve({ success: true, inserted });
      } catch (err) {
        reject(err?.message || err);
      }
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsArrayBuffer(file);
  });
};