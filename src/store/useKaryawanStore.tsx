import { create } from "zustand";
import { api } from "@/lib/api";
import { initialFormKaryawan, FormKaryawan } from "@/lib/dataKaryawanHelper";

/* ===================== TYPE ===================== */

export type Karyawan = {
  id_karyawan: string;
  nik: string;
  no_jkn: string;
  npp: string;
  nama: string;
  kota_lahir: string;
  tanggal_lahir: string;
  status_pernikahan: string;
  alamat_ktp: string;
  alamat_domisili: string;
  no_hp: string;
  nama_kontak_darurat: string;
  no_kontak_darurat: string;
  bank: string;
  nama_rekening: string;
  nomor_rekening: string;
  ukuran_baju: string;
  ukuran_celana: string;
  ukuran_sepatu: string;
  kategori_tenaga_kerja: string;
  jabatan: string;
  penempatan: string;
  basic_salary: number;
  tunjangan_makan: number;
  tunjangan_transport: number;
  tunjangan_jabatan: number;
  tmt: string;
  masa_kerja: number;
  status_kerja: string;
  status_karyawan: string;
  tanggal_non_aktif: string;
  bpjs_kesehatan: string;
  bpjs_naker: string;
  keterangan: string;
  foto_url: string;
};

/* ===================== STORE TYPE ===================== */

type KaryawanStore = {
  data: FormKaryawan[];
  loading: boolean;
  error: string | null;
  form: FormKaryawan;

  fetchKaryawan: () => Promise<void>;
  selectKaryawan: (k: FormKaryawan) => void;
  handleChange: (name: keyof FormKaryawan, value: any) => void;
  resetForm: () => void;
  clearError: () => void;
};

/* ===================== STORE ===================== */

export const useKaryawanStore = create<KaryawanStore>((set, get) => ({
  data: [],
  loading: false,
  error: null,

  form: initialFormKaryawan,

  fetchKaryawan: async () => {
    try {
      set({ loading: true, error: null });

      const res = await api.get<Karyawan[]>("karyawan.list");

      if (!res.success) {
        set({ error: res.message, loading: false });
        return;
      }

      set({
        data: res.data,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Terjadi kesalahan saat mengambil data",
        loading: false,
      });
    }
  },

  selectKaryawan: (karyawan) => {
    set({ form: karyawan });
  },

  handleChange: (name, value) => {
    const prev = get().form;
    set({
      form: {
        ...prev,
        [name]: value,
      },
    });
  },

  resetForm: () => set({ form: initialFormKaryawan }),

  clearError: () => set({ error: null }),
}));
