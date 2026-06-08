const BASE_URL =
  "https://script.google.com/macros/s/AKfycbzWpoI5fF1LbTlUhA1NTH1uayYSsuJGX5i7CRTzG92y8xlcyrT5aOPzg9cIUC5k_kCF/exec";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

/* ===================== TYPES ===================== */

export type InvoiceFile = {
  file_id: string;
  drive_file_id: string;
  invoice_id: string;
  file_name: string;
  folder_tahun: string;
  folder_bulan: string;
  folder_tipe: string;
  url: string;
  created_at: string;
};

export type UploadInvoiceFilePayload = {
  invoice_id: string;
  folder_tahun: string;
  folder_bulan: string;
  folder_tipe: string;
  file: File;
};

export type UploadInvoiceFileResponse = {
  file_id: string;
  url: string;
};

/* ===================== GET ===================== */

export async function apiGet<T = any>(
  action: string,
  params?: Record<string, string | number>
): Promise<ApiResponse<T>> {
  const url = new URL(BASE_URL);

  url.searchParams.append(
    "action",
    action
  );

  if (params) {
    Object.entries(params).forEach(
      ([key, value]) => {
        url.searchParams.append(
          key,
          String(value)
        );
      }
    );
  }

  const res = await fetch(
    url.toString(),
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Gagal mengambil data dari server"
    );
  }

  const data =
  await res.json();

console.log(
  "API RESPONSE",
  data
);

return data;
}

/* ===================== POST ===================== */

export async function apiPost<T = any>(
  action: string,
  payload: Record<string, any>
): Promise<ApiResponse<T>> {

  const formData =
    new URLSearchParams();

  formData.append(
    "action",
    action
  );

  Object.entries(payload)
    .forEach(
      ([key, value]) => {

        formData.append(
          key,
          String(value)
        );

      }
    );

  const res =
    await fetch(
      BASE_URL,
      {
        method: "POST",
        body:
          formData,
      }
    );

  if (!res.ok) {
    throw new Error(
      "Gagal mengirim data ke server"
    );
  }

  return res.json();
}

/* ===================== FILE HELPERS ===================== */

function fileToBase64(
  file: File
): Promise<string> {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        const result =
          reader.result as string;

        const base64 =
          result.split(",")[1];

        resolve(base64);
      };

      reader.onerror =
        reject;

      reader.readAsDataURL(
        file
      );
    }
  );
}

/* ===================== INVOICE FILES ===================== */

export async function getInvoiceFiles(
  invoice_id: string
) {
  return apiGet<InvoiceFile[]>(
    "invoice.files",
    {
      invoice_id,
    }
  );
}

export async function uploadInvoiceFile(
  payload: UploadInvoiceFilePayload
) {
  const base64 =
    await fileToBase64(
      payload.file
    );

return apiPost<UploadInvoiceFileResponse>(
  "invoice.uploadFile",
  {
    invoice_id:
      payload.invoice_id,

    folder_tahun:
      payload.folder_tahun,

    folder_bulan:
      payload.folder_bulan,

    folder_tipe:
      payload.folder_tipe,

    file_name:
      payload.file.name,

    mime_type:
      payload.file.type,

    file_base64:
      base64,
  }
);
}

/* ===================== SHORTCUT ===================== */

export const api = {
  get: apiGet,
  post: apiPost,

  invoiceFiles:
    getInvoiceFiles,

  uploadInvoiceFile,
};