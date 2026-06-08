// services/dataClientService.js
import { db } from '@/lib/firebaseConfig';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';

// Ambil semua data client
export const getAllClient = async () => {
  const querySnapshot = await getDocs(collection(db, 'dataClient'));
  const data = [];
  querySnapshot.forEach(docSnap => {
    data.push({ id: docSnap.id, ...docSnap.data() });
  });
  return data;
};

// Tambah / Update data client
export const saveClient = async (kode, data) => {
  const docRef = doc(db, 'dataClient', kode);
  await setDoc(docRef, data, { merge: true });
};

// Hapus data client
export const deleteClient = async (kode) => {
  await deleteDoc(doc(db, 'dataClient', kode));
};

// Bulk upload dari Excel
export const bulkUploadClient = async (file) => {
  const expectedHeaders = [
    'kodeClient',
    'namaClient',
    'namaGedung',
    'alamatClient',
    'kotaClient',
    'kodePos',
    'NPWP',
    'contactPerson',
    'nomorContactPerson',
    'periodeKontrakStart',
    'periodeKontrakEnd',
    'dokumenKontrak'
  ];

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // cari sheet Data_Client
        const sheetName = workbook.SheetNames.find(
          name =>
            name.toLowerCase().replace(/\s+/g, '_') === 'data_client' ||
            name.toLowerCase() === 'data_client' ||
            (name.toLowerCase().includes('data') && name.toLowerCase().includes('client'))
        );
        if (!sheetName) return reject('Sheet "Data_Client" tidak ditemukan');
        const sheet = workbook.Sheets[sheetName];

        const allRows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });
        if (!allRows || allRows.length === 0) return reject('Sheet kosong');

        // cari baris header dengan pencocokan fleksibel
        let headerRowIndex = allRows.findIndex(row =>
          Array.isArray(row) && row.some(cell =>
            typeof cell === 'string' && cell.trim().replace(/\s+/g,'').toLowerCase() === 'kodeclient'
          )
        );
        if (headerRowIndex === -1) headerRowIndex = 0; // fallback ke baris pertama

        const headerRow = allRows[headerRowIndex] || [];

        // mapping col index
        const colIndexByHeader = {};
        expectedHeaders.forEach(expected => {
          const normalizedExpected = expected.replace(/\s+/g,'').toLowerCase();
          const idx = headerRow.findIndex(cell =>
            cell?.toString().trim().replace(/\s+/g,'').toLowerCase() === normalizedExpected
          );
          colIndexByHeader[expected] = idx >= 0 ? idx : -1;
        });

        const dataRows = allRows.slice(headerRowIndex + 1);
        if (dataRows.length === 0) return reject('Data client kosong');

        let counterKosong = 1;
        const tasks = [];
        let inserted = 0;

        for (const row of dataRows) {
          const isEmpty = expectedHeaders.every(h => {
            const ci = colIndexByHeader[h];
            const val = ci >= 0 ? (row[ci] ?? '') : '';
            return !val;
          });
          if (isEmpty) continue;

          const clientData = {};
          expectedHeaders.forEach(headerName => {
            const ci = colIndexByHeader[headerName];
            const rawVal = ci >= 0 ? (row[ci] ?? '') : '';
            clientData[headerName] = (typeof rawVal === 'string') ? rawVal.trim() : rawVal;
          });

          const kode = (clientData['kodeClient'] ?? '').toString().trim();
          const docId = kode !== '' ? kode : `kosong-${counterKosong++}`;

          tasks.push(
            setDoc(doc(db, 'dataClient', docId), clientData, { merge: true }).then(() => { inserted += 1; })
          );
        }

        await Promise.all(tasks);
        resolve({ success: true, inserted });
      } catch (err) {
        reject(err?.message || err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};
